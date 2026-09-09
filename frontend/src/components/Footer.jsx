import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function subscribe(e) {
    e.preventDefault()
    await api.post('/newsletter', { email })
    setSent(true)
  }

  return (
    <footer className="bg-neutral-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-semibold text-aqua-dark mb-3">Newsletter</h3>
          {sent ? (
            <p className="text-sm">Obrigado por se inscrever! 💖</p>
          ) : (
            <form onSubmit={subscribe} className="flex gap-2">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 rounded-full border border-neutral-300 px-3 py-2 text-sm"
              />
              <button className="bg-aqua text-white rounded-full px-4 py-2 text-sm hover:bg-aqua-dark transition-colors">
                OK
              </button>
            </form>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Institucional</h3>
          <ul className="text-sm space-y-2 text-neutral-600">
            <li><Link to="/sobre" className="hover:text-aqua transition-colors">Sobre a Lima Lica</Link></li>
            <li><Link to="/trocas" className="hover:text-aqua transition-colors">Trocas e Devoluções</Link></li>
            <li><Link to="/privacidade" className="hover:text-aqua transition-colors">Política de Privacidade</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Atendimento</h3>
          <ul className="text-sm space-y-2 text-neutral-600">
            <li><Link to="/ajuda" className="hover:text-aqua transition-colors">Central de Ajuda</Link></li>
            <li><Link to="/contato" className="hover:text-aqua transition-colors">Fale Conosco</Link></li>
            <li><Link to="/minha-conta/pedidos" className="hover:text-aqua transition-colors">Rastrear Pedido</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Pagamento</h3>
          <p className="text-sm text-neutral-600">Pix • Cartão de Crédito • Cartão de Débito</p>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-400 py-4 border-t border-neutral-200">
        © {new Date().getFullYear()} Lima Lica. Todos os direitos reservados.
      </div>
    </footer>
  )
}
