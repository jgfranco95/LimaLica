import { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  {
    q: 'Como acompanho meu pedido?',
    a: 'Depois de pago, seu pedido aparece em "Meus Pedidos" na sua conta, com o status atualizado em cada etapa: separação, envio e entrega.',
  },
  {
    q: 'Quais formas de pagamento vocês aceitam?',
    a: 'Aceitamos Pix, cartão de crédito (em até 10x sem juros) e cartão de débito.',
  },
  {
    q: 'Como funciona a troca?',
    a: 'Você tem até 30 dias corridos após o recebimento para solicitar troca ou devolução, sem custo, direto pela sua conta.',
  },
  {
    q: 'Quanto tempo demora o frete?',
    a: 'O prazo varia por região e é calculado na página do produto ou no checkout, digitando seu CEP. Compras acima de R$299 têm frete grátis.',
  },
  {
    q: 'Esqueci minha senha, e agora?',
    a: 'Na tela de login, clique em "Esqueci minha senha" e siga as instruções enviadas para o seu e-mail cadastrado.',
  },
]

export default function HelpPage() {
  const [open, setOpen] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif font-medium text-4xl mb-2">Central de Ajuda</h1>
      <p className="text-neutral-600 mb-10">Reunimos as dúvidas mais comuns por aqui. Não encontrou o que precisa?{' '}
        <Link to="/contato" className="text-aqua-dark underline">Fale com a gente</Link>.
      </p>

      <div className="space-y-3">
        {FAQS.map((item, i) => (
          <div key={item.q} className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between text-left px-5 py-4 font-medium hover:text-aqua-dark transition-colors"
            >
              {item.q}
              <span className={`ml-4 shrink-0 transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>+</span>
            </button>
            <div
              className="grid transition-all duration-300 ease-out"
              style={{ gridTemplateRows: open === i ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm text-neutral-600">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}