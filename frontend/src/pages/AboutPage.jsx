export default function AboutPage() {
  return (
    <div>
      <section className="relative h-[46vh] md:h-[56vh] overflow-hidden bg-gradient-to-br from-aqua-light to-blush-light flex items-end">
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
          Trabalhamos com fornecedores que compartilham nossos valores de qualidade
          e respeito, e revisamos cada coleção pensando em conforto, caimento e
          durabilidade. Nosso time de curadoria testa as peças antes de colocá-las
          no site, porque acreditamos que moda boa é aquela que a gente usa de
          verdade.
        </p>
        <p>
          Mais do que vender roupas, queremos fazer parte do seu dia: a camiseta
          confortável pra trabalhar de casa, o vestido pra aquele jantar especial,
          o tênis que aguenta o corre com as crianças. Obrigada por fazer parte
          dessa história com a gente. 💖
        </p>
      </section>

      <section className="bg-blush-light/40 py-14">
        <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-8 text-center">
          {[
            { title: 'Curadoria própria', text: 'Cada peça é escolhida e aprovada pelo nosso time antes de chegar até você.' },
            { title: 'Compra sem medo', text: 'Troca grátis em até 30 dias e pagamento 100% seguro.' },
            { title: 'Feito pra todo mundo', text: 'Coleções feminina, masculina e infantil, do PP ao GG.' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <h3 className="font-serif font-medium text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-neutral-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}