import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, useGLTF } from '@react-three/drei'
import gsap from 'gsap'
import HeroOverlay, { HeroBackdrop } from './HeroOverlay'

/* ============================================================
 * AJUSTES FÁCEIS — mexa só aqui pra mudar o "jeito" do hero
 * ============================================================ */
const FOV = 38 // abertura da câmera
const MODEL_FIT_WIDTH = 3.0 // largura (em unidades 3D) que precisa caber na tela
const MIN_END_Z = 6.0 // o mais perto que a câmera chega (em telas largas)
const START_EXTRA_Z = 7 // quão mais longe a câmera começa antes de se aproximar
const LOOK_Y = 0.1 // altura pra onde a câmera olha
const INTRO_SECONDS = 2.6 // duração da aproximação
const FAILSAFE_MS = 7000 // se algo demorar demais, mostra título/botões mesmo assim
const COLORS = {
  dress: '#A9E6DA', // aqua-light
  sheen: '#F3E0E5', // blush-light
  pearlA: '#E8C8D0', // blush
  pearlB: '#7FD8C6', // aqua
}

/* ------------------------------------------------------------
 * Proteção: se o 3D der erro (ex.: arquivo .glb não existe),
 * mostra o `fallback` em vez de derrubar a página.
 * ---------------------------------------------------------- */
class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error) {
    console.warn('[Hero3D]', error)
    this.props.onError?.(error)
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children
  }
}

/* ------------------------------------------------------------
 * MODELO 1 — vestido procedural (não precisa de arquivo nenhum).
 * É o que aparece enquanto você não tiver um modelo .glb próprio.
 * ---------------------------------------------------------- */
const PEARLS = [
  { p: [1.9, 0.9, 0.4], s: 0.16, c: COLORS.pearlA, speed: 1.4 },
  { p: [-1.8, 0.2, 0.8], s: 0.22, c: COLORS.pearlB, speed: 1.8 },
  { p: [1.5, -0.8, 1.0], s: 0.12, c: COLORS.pearlB, speed: 1.2 },
  { p: [-1.4, 1.2, -0.6], s: 0.14, c: COLORS.pearlA, speed: 1.6 },
  { p: [0.3, 1.9, 0.5], s: 0.1, c: COLORS.pearlA, speed: 2 },
]

function ProceduralDress() {
  const geometry = useMemo(() => {
    // perfil do vestido (raio, altura) — do barrado até o decote
    const profile = [
      [1.3, -1.65],
      [1.12, -1.2],
      [0.82, -0.6],
      [0.52, -0.1],
      [0.3, 0.35],
      [0.4, 0.75],
      [0.36, 1.05],
      [0.16, 1.3],
      [0.001, 1.42],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    const curve = new THREE.SplineCurve(profile)
    return new THREE.LatheGeometry(curve.getPoints(90), 72)
  }, [])

  useEffect(() => () => geometry.dispose(), [geometry])

  return (
    <group>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial
          color={COLORS.dress}
          roughness={0.42}
          metalness={0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.35}
          sheen={1}
          sheenColor={COLORS.sheen}
          side={THREE.DoubleSide}
        />
      </mesh>

      {PEARLS.map((pearl, i) => (
        <Float key={i} speed={pearl.speed} rotationIntensity={0.4} floatIntensity={1.2}>
          <mesh position={pearl.p}>
            <sphereGeometry args={[pearl.s, 32, 32]} />
            <meshPhysicalMaterial color={pearl.c} roughness={0.2} clearcoat={1} />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

/* ------------------------------------------------------------
 * MODELO 2 — seu próprio arquivo .glb / .gltf (se informar modelUrl).
 * Centraliza e ajusta o tamanho sozinho.
 * ---------------------------------------------------------- */
function GltfModel({ url }) {
  const { scene } = useGLTF(url)

  const { object, scale } = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
    clone.position.sub(center)
    return { object: clone, scale: 3.2 / Math.max(size.x, size.y, size.z) }
  }, [scene])

  return (
    <group scale={scale}>
      <primitive object={object} />
    </group>
  )
}

/* ------------------------------------------------------------
 * CÂMERA — o GSAP aproxima a câmera do modelo ao montar.
 * Quando termina, chama onDone (que muda o estado e revela o texto).
 * ---------------------------------------------------------- */
function CameraRig({ onDone }) {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useLayoutEffect(() => {
    // distância final: em celular (tela estreita) precisa afastar mais pra caber
    const aspect = size.width / size.height
    const halfTan = Math.tan((FOV * Math.PI) / 360)
    const endZ = Math.max(MIN_END_Z, MODEL_FIT_WIDTH / (2 * halfTan * aspect))

    camera.position.set(0, 0.9, endZ + START_EXTRA_Z)
    camera.lookAt(0, LOOK_Y, 0)

    const tween = gsap.to(camera.position, {
      x: 0,
      y: 0.35,
      z: endZ,
      duration: INTRO_SECONDS,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(0, LOOK_Y, 0),
      onComplete: () => doneRef.current?.(),
    })

    return () => tween.kill()
    // roda só uma vez, ao montar (não reinicia se a janela for redimensionada)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [camera])

  return null
}

/* ------------------------------------------------------------
 * PALCO — interação: o modelo acompanha o mouse, gira ao arrastar
 * (no celular, só o arrasto horizontal; rolar pra baixo continua
 * rolando a página) e fica girando devagar depois da intro.
 * ---------------------------------------------------------- */
function Stage({ introDone, children }) {
  const group = useRef()
  const gl = useThree((s) => s.gl)
  const aspect = useThree((s) => s.size.width / s.size.height)
  const auto = useRef(0)
  const drag = useRef({ active: false, lastX: 0, offset: 0 })

  // começa virado de lado e "gira pra frente" durante a intro
  useLayoutEffect(() => {
    if (group.current) group.current.rotation.y = -1.3
  }, [])

  useEffect(() => {
    const el = gl.domElement
    el.style.touchAction = 'pan-y' // vertical = rolar a página; horizontal = girar o modelo
    el.style.cursor = 'grab'

    const onDown = (e) => {
      drag.current.active = true
      drag.current.lastX = e.clientX
      el.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      const d = drag.current
      if (!d.active) return
      d.offset += (e.clientX - d.lastX) * 0.01
      d.lastX = e.clientX
    }
    const onUp = () => {
      drag.current.active = false
      el.style.cursor = 'grab'
    }

    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [gl])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (introDone && !drag.current.active) auto.current += delta * 0.3

    const k = Math.min(1, delta * 4)
    const targetY = auto.current + drag.current.offset + state.pointer.x * 0.35
    const targetX = -state.pointer.y * 0.1
    g.rotation.y += (targetY - g.rotation.y) * k
    g.rotation.x += (targetX - g.rotation.x) * k
  })

  // telas largas: modelo vai pra direita (texto fica à esquerda).
  // celular: modelo sobe um pouco, pra não ficar todo atrás do texto.
  const wide = aspect > 1.2
  return (
    <group ref={group} position={[wide ? 1.1 : 0, wide ? 0 : 0.5, 0]}>
      {children}
    </group>
  )
}

function Scene({ modelUrl, introDone, onIntroComplete }) {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 5, 4]} intensity={2.4} />
      <pointLight position={[-4, 1, 3]} intensity={40} color={COLORS.pearlA} />

      {/* Tudo aqui dentro só "monta" depois que o modelo carregou,
          então a aproximação da câmera começa quando já há o que ver. */}
      <Suspense fallback={null}>
        <Stage introDone={introDone}>
          <Boundary fallback={<ProceduralDress />}>
            {modelUrl ? <GltfModel url={modelUrl} /> : <ProceduralDress />}
          </Boundary>
        </Stage>
        <CameraRig onDone={onIntroComplete} />
      </Suspense>
    </>
  )
}

/* ------------------------------------------------------------
 * COMPONENTE PRINCIPAL
 * Props: modelUrl (opcional, ex.: "/models/vestido.glb"), title, subtitle
 * ---------------------------------------------------------- */
export default function Hero3D({ modelUrl = null, ...overlayProps }) {
  const [introDone, setIntroDone] = useState(false) // vira true quando a câmera termina
  const [inView, setInView] = useState(true)
  const sectionRef = useRef(null)
  const handleDone = useCallback(() => setIntroDone(true), [])

  // rede de segurança: se o 3D travar/demorar, o título e os botões aparecem mesmo assim
  useEffect(() => {
    const t = setTimeout(handleDone, FAILSAFE_MS)
    return () => clearTimeout(t)
  }, [handleDone])

  // pausa o desenho do 3D quando o hero sai da tela (economiza bateria no celular)
  useEffect(() => {
    const el = sectionRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[82vh] md:h-[88vh] overflow-hidden"
      aria-label="Apresentação da loja"
    >
      <HeroBackdrop />

      <Boundary fallback={null} onError={handleDone}>
        <Canvas
          dpr={[1, 1.75]}
          frameloop={inView ? 'always' : 'never'}
          camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0.9, 14] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Scene modelUrl={modelUrl} introDone={introDone} onIntroComplete={handleDone} />
        </Canvas>
      </Boundary>

      {/* título + botões: só aparecem (fade-in) quando introDone vira true */}
      <HeroOverlay visible={introDone} {...overlayProps} />
    </section>
  )
}
