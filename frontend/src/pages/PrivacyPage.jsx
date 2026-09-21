export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Quais dados coletamos',
      text: 'Coletamos os dados que você nos fornece ao criar conta ou fazer um pedido (nome, e-mail, CPF, telefone e endereço), além de dados de navegação para melhorar sua experiência no site.',
    },
    {
      title: '2. Como usamos seus dados',
      text: 'Usamos suas informações para processar pedidos, calcular frete, enviar atualizações sobre compras e, com seu consentimento, comunicar novidades e promoções.',
    },
    {
      title: '3. Compartilhamento',
      text: 'Compartilhamos dados apenas com parceiros essenciais para a operação (transportadoras e processadores de pagamento), nunca vendemos suas informações a terceiros.',
    },
    {
      title: '4. Segurança',
      text: 'Seus dados são armazenados com criptografia e acesso restrito. Pagamentos são processados por gateways certificados, e não guardamos números de cartão em nossos servidores.',
    },
    {
      title: '5. Seus direitos',
      text: 'Você pode solicitar a qualquer momento a atualização, exportação ou exclusão dos seus dados, entrando em contato pelo nosso canal de atendimento.',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif font-medium text-4xl mb-2">Política de Privacidade</h1>
      <p className="text-neutral-500 mb-10 text-sm">Última atualização: setembro de 2026</p>

      <div className="space-y-8">
        {sections.map((s) => (
          <div key={s.title}>
            <h2 className="font-medium text-lg mb-2">{s.title}</h2>
            <p className="text-sm text-neutral-600 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}