export default function AboutPage() {
  return (
    <div>
      {/* Degradê ajustado para os tons de rosa da logo */}
      <section className="relative h-[46vh] md:h-[56vh] overflow-hidden bg-gradient-to-br from-[#FDF6F7] via-[#F4D9DC] to-[#E8BEC2] flex items-end">
        <div className="max-w-5xl mx-auto px-6 pb-10 w-full">
          <h1 className="font-serif font-medium text-4xl md:text-6xl text-neutral-900 animate-fade-in-up">
            Sobre a Lima Lica
          </h1>
          <p className="mt-3 text-neutral-800/80 max-w-lg animate-fade-in-up-delay">
            Moda pensada pra quem quer se sentir bem em qualquer dia.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 space-y-6 text-neutral-700 leading-relaxed">
        <p>
          A Lima Lica nasceu da vontade de criar uma loja onde vestir bem não fosse
          complicado nem caro. Começamos pequenos, escolhendo peça por peça com
          carinho, e hoje atendemos famílias inteiras — do básico do dia a dia às
          ocasiões que pedem um look especial.
        </p>
        <p>
          Trabalhamos com parceiros que compartilham nossos valores de qualidade
          e preço justo, trazendo sempre novidades que unem conforto, bom caimento
          e estilo. Pensamos em cada detalhe para oferecer opções versáteis e
          acessíveis, porque acreditamos que moda boa é aquela que a gente usa de
          verdade.
        </p>
        <p>
          Mais do que vender roupas, queremos fazer parte do seu dia: a camiseta
          confortável pra trabalhar de casa, o vestido pra aquele jantar especial,
          o tênis que aguenta o corre com as crianças. Obrigada por fazer parte
          dessa história com a gente. 💖
        </p>
      </section>

      <section className="bg-[#FDF4F5] py-14">
        <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Escolhas com carinho', text: 'Peças pensadas para o dia a dia, unindo conforto, estilo e preço justo.' },
            { title: 'Compra sem medo', text: 'Troca grátis em até 30 dias e pagamento 100% seguro.' },
            { title: 'Feito pra todo mundo', text: 'Opções feminina, masculina e infantil, vestindo toda a família.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-[#F4D9DC]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif font-medium text-lg mb-2 text-neutral-900">{item.title}</h3>
              <p className="text-sm text-neutral-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}