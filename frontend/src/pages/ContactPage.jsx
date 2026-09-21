import { useState } from 'react'

const inputClass =
  'w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-aqua/40 focus:border-aqua transition'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Endpoint de contato pode ser plugado aqui (ex.: api.post('/contact', form))
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-serif font-medium text-4xl mb-2">Fale Conosco</h1>
      <p className="text-neutral-600 mb-10">Dúvidas, sugestões ou parcerias — respondemos em até 1 dia útil.</p>

      {sent ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 text-center">
          <p className="font-medium text-lg mb-1">Mensagem enviada! 💌</p>
          <p className="text-sm text-neutral-600">Obrigada por entrar em contato, retornamos em breve.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-100 space-y-3">
          <input required placeholder="Seu nome" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
          <input required type="email" placeholder="Seu e-mail" value={form.email} onChange={(e) => set('email', e.target.value)} className={inputClass} />
          <textarea required rows={5} placeholder="Como podemos ajudar?" value={form.message}
            onChange={(e) => set('message', e.target.value)} className={`${inputClass} resize-none`} />
          <button className="btn-primary w-full">Enviar mensagem</button>
        </form>
      )}

      <div className="mt-10 text-sm text-neutral-600 space-y-1">
        <p>📧 contato@limalica.com.br</p>
        <p>📱 (11) 91234-5678 — WhatsApp e telefone</p>
        <p>🕑 Atendimento de segunda a sexta, 9h às 18h</p>
      </div>
    </div>
  )
}