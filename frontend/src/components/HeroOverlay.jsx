import { Link } from 'react-router-dom'

/** Fundo do hero: degradê da marca em tons de rosa + manchas de cor desfocadas (rosa e dourado champagne). */
export function HeroBackdrop() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-[#FDF6F7] via-[#F9ECEE] to-[#F2D5D9]" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#F4D9DC]/70 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#FBEFD5]/60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 w-[28rem] h-[28rem] rounded-full bg-[#E8BEC2]/60 blur-3xl" />
    </>
  )
}

function Fade({ visible, delay = 0, className = '', as: Tag = 'div', children }) {
  return (
    <Tag
      className={`transition-all duration-1000 ease-out motion-reduce:transition-none ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  )
}

/**
 * Título + botões do hero. Aparece com fade-in suave quando `visible` vira true
 * (no Hero3D isso acontece quando a animação da câmera termina).
 */
export default function HeroOverlay({
  visible,
  title = 'Lima Lica',
  subtitle = 'peças pensadas pro seu dia a dia',
}) {
  return (
    <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none">
      {/* véu suave embaixo, só pra garantir leitura do texto sobre o modelo */}
      <div
        className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-[#FDF8F9]/90 to-transparent transition-opacity duration-1000 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative px-6 pb-10 md:px-14 md:pb-16 max-w-xl mx-auto md:mx-0 text-center md:text-left">
        <Fade visible={visible} delay={0} as="p" className="text-xs md:text-sm tracking-[0.3em] uppercase text-[#B86B77] font-semibold mb-3">
          Nova coleção
        </Fade>

        <Fade visible={visible} delay={150} as="h1" className="font-serif font-medium text-5xl md:text-7xl leading-[0.95] tracking-tight text-neutral-900">
          {title}
        </Fade>

        <Fade visible={visible} delay={300} as="p" className="mt-4 text-base md:text-lg text-neutral-700">
          {subtitle}
        </Fade>

        <Fade
          visible={visible}
          delay={450}
          className={`mt-7 flex flex-wrap gap-3 justify-center md:justify-start ${visible ? 'pointer-events-auto' : ''}`}
        >
          <Link
            to="/categoria/novidades"
            className="bg-neutral-900 text-white rounded-full px-7 py-3 text-sm font-medium shadow-md transition-all duration-200 hover:bg-[#B86B77] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            Ver novidades
          </Link>
          <Link
            to="/categoria/feminino"
            className="border-2 border-[#B86B77] text-[#B86B77] bg-white/50 backdrop-blur-sm rounded-full px-7 py-3 text-sm font-medium transition-all duration-200 hover:bg-[#B86B77] hover:text-white hover:-translate-y-0.5 active:translate-y-0"
          >
            Explorar coleção
          </Link>
        </Fade>
      </div>

      <Fade
        visible={visible}
        delay={900}
        className="hidden md:flex absolute right-14 bottom-16 flex-col items-center text-[11px] tracking-[0.3em] uppercase text-[#B86B77]"
      >
        role
        <span className="mt-2 text-lg animate-bounce">↓</span>
      </Fade>
    </div>
  )
}

/** Hero sem 3D (aparelho sem WebGL ou "reduzir movimento" ligado): título e botões já visíveis. */
export function HeroStatic() {
  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      <HeroBackdrop />
      <HeroOverlay visible />
    </section>
  )
}

/** Só o fundo, enquanto o pacote do 3D baixa (mesma altura do Hero3D pra página não "pular"). */
export function HeroSkeleton() {
  return (
    <section className="relative h-[82vh] md:h-[88vh] overflow-hidden">
      <HeroBackdrop />
    </section>
  )
}