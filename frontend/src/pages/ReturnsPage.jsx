export default function ReturnsPage() {
  const steps = [
    { title: 'Acesse seus pedidos', text: 'Vá em "Minha Conta > Meus Pedidos" e escolha a compra que deseja trocar ou devolver.' },
    { title: 'Solicite a troca', text: 'Selecione o item, o motivo e se prefere troca por outro tamanho/cor ou reembolso.' },
    { title: 'Enviamos a etiqueta', text: 'Você recebe por e-mail uma etiqueta de postagem grátis para devolver o produto.' },
    { title: 'Receba a novidade', text: 'Assim que recebermos o item, processamos a troca ou o reembolso em até 5 dias úteis.' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif font-medium text-4xl mb-2">Trocas e Devoluções</h1>
      <p className="text-neutral-600 mb-10">
        Você tem até <strong>30 dias corridos</strong> após o recebimento para solicitar troca ou
        devolução, sem custo nenhum.
      </p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.title} className="flex gap-4 bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow duration-300">
            <div className="shrink-0 w-9 h-9 rounded-full bg-aqua text-white flex items-center justify-center font-serif font-medium">
              {i + 1}
            </div>
            <div>
              <h3 className="font-medium mb-1">{s.title}</h3>
              <p className="text-sm text-neutral-600">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-blush-light/40 rounded-2xl p-6 text-sm text-neutral-700">
        <p className="font-medium mb-1">Condições para troca</p>
        <p>Peça sem uso, com etiqueta original e embalagem intacta. Roupas íntimas e itens em
          promoção relâmpago seguem condições específicas, indicadas na página do produto.</p>
      </div>
    </div>
  )
}