import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../../components/Hero/Hero'
import ListaReceitas from '../../components/ListaReceitas/ListaReceitas'
import ReceitaModal from '../../components/ReceitaModal/ReceitaModal'
import { SITE } from '../../config/site'
import useReceitas from '../../hooks/useReceitas'
import './Home.css'

const BENEFICIOS = [
  {
    icone: '💪',
    titulo: 'Força e saúde',
    texto:
      'Músculos mais fortes protegem as articulações, melhoram a postura e deixam as tarefas do dia a dia mais leves.',
  },
  {
    icone: '📈',
    titulo: 'Ganho de massa muscular',
    texto:
      'Com treino progressivo, boa alimentação e descanso, o corpo se adapta e ganha massa magra ao longo do tempo.',
  },
  {
    icone: '🧠',
    titulo: 'Disciplina e mente',
    texto:
      'Manter a rotina ensina constância, ajuda a aliviar o estresse e melhora o foco e o humor.',
  },
  {
    icone: '⏳',
    titulo: 'Longevidade',
    texto:
      'Preservar massa muscular e ossos fortes com o passar dos anos ajuda a manter autonomia e qualidade de vida.',
  },
]

const PILARES = [
  {
    numero: '01',
    titulo: 'Treino',
    texto:
      'Constância vale mais do que intensidade de um dia só. Treine com boa técnica, aumente a carga aos poucos e respeite os seus limites.',
  },
  {
    numero: '02',
    titulo: 'Alimentação',
    texto:
      'Proteínas, carboidratos e gorduras boas dão energia para treinar e matéria-prima para evoluir. É por isso que o site tem receitas.',
  },
  {
    numero: '03',
    titulo: 'Descanso',
    texto:
      'O músculo se recupera e cresce nas horas de sono e nos dias de folga. Dormir bem também faz parte do treino.',
  },
]

const QUANTIDADE_DESTAQUES = 3

// Escolhe receitas de categorias diferentes primeiro, para a vitrine ficar variada.
function escolherDestaques(receitas, quantidade) {
  const escolhidas = []
  const categoriasVistas = new Set()
  for (const receita of receitas) {
    if (escolhidas.length === quantidade) break
    if (!categoriasVistas.has(receita.categoria)) {
      categoriasVistas.add(receita.categoria)
      escolhidas.push(receita)
    }
  }
  for (const receita of receitas) {
    if (escolhidas.length === quantidade) break
    if (!escolhidas.includes(receita)) escolhidas.push(receita)
  }
  return escolhidas
}

export default function Home() {
  const { receitas, carregando, erro, recarregar } = useReceitas('')
  const [selecionada, setSelecionada] = useState(null)
  const destaques = escolherDestaques(receitas, QUANTIDADE_DESTAQUES)

  useEffect(() => {
    document.title = SITE.nome
  }, [])

  return (
    <>
      <Hero alvoId="por-que-musculacao" />

      <section id="por-que-musculacao" className="secao home-beneficios" aria-labelledby="titulo-beneficios">
        <div className="container">
          <span className="eyebrow">Para começar</span>
          <h2 id="titulo-beneficios" className="titulo-secao">
            Por que musculação?
          </h2>
          <p className="subtitulo-secao">
            Mais do que estética: treinar com regularidade muda como o corpo funciona e como a gente se sente.
          </p>

          <ul className="home-beneficios__grade">
            {BENEFICIOS.map((beneficio) => (
              <li key={beneficio.titulo} className="beneficio">
                <span className="beneficio__icone" aria-hidden="true">
                  {beneficio.icone}
                </span>
                <h3>{beneficio.titulo}</h3>
                <p>{beneficio.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="secao home-pilares" aria-labelledby="titulo-pilares">
        <div className="container">
          <span className="eyebrow">O método Kaizen</span>
          <h2 id="titulo-pilares" className="titulo-secao">
            Os 3 pilares
          </h2>
          <p className="subtitulo-secao">
            A evolução vem do equilíbrio. Melhorar 1% em cada um deles, todos os dias, faz a diferença.
          </p>

          <ol className="home-pilares__grade">
            {PILARES.map((pilar) => (
              <li key={pilar.numero} className="pilar">
                <span className="pilar__numero" aria-hidden="true">
                  {pilar.numero}
                </span>
                <h3>{pilar.titulo}</h3>
                <p>{pilar.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="secao home-destaques" aria-labelledby="titulo-destaques">
        <div className="container">
          <span className="eyebrow">Para abastecer o treino</span>
          <h2 id="titulo-destaques" className="titulo-secao">
            Receitas em destaque
          </h2>
          <p className="subtitulo-secao">Algumas ideias simples para você começar hoje.</p>

          <div className="home-destaques__lista">
            <ListaReceitas
              receitas={destaques}
              carregando={carregando}
              erro={erro}
              onTentarNovamente={recarregar}
              onAbrir={setSelecionada}
              quantidadeEsqueleto={QUANTIDADE_DESTAQUES}
              vazio={
                <>
                  <h3>Ainda não há receitas</h3>
                  <p>Cadastre a primeira receita na página de receitas.</p>
                  <Link to="/receitas" className="btn btn-primary">
                    Ir para as receitas
                  </Link>
                </>
              }
            />
          </div>

          <p className="home-destaques__rodape">
            <Link to="/receitas" className="home-destaques__link">
              Ver todas as receitas <span aria-hidden="true">→</span>
            </Link>
          </p>
        </div>
      </section>

      <section className="home-cta" aria-labelledby="titulo-cta">
        <div className="container home-cta__interno">
          <h2 id="titulo-cta" className="home-cta__titulo">
            Um pouco melhor <span>a cada dia.</span>
          </h2>
          <p className="home-cta__texto">
            Hoje é um bom dia para começar: treine, coma bem e deixe a evolução acontecer.
          </p>
          <Link to="/receitas" className="btn btn-primary">
            Ver receitas
          </Link>
        </div>
      </section>

      {/* Na Home o modal é só de leitura (sem editar/excluir). */}
      {selecionada && <ReceitaModal receita={selecionada} onFechar={() => setSelecionada(null)} />}
    </>
  )
}
