import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import './Hero.css'

// Banner em tela cheia. `alvoId` é o id da seção para onde o botão "Saiba mais" rola.
export default function Hero({ alvoId }) {
  function rolarAteProximaSecao() {
    const alvo = document.getElementById(alvoId)
    if (!alvo) return
    const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    alvo.scrollIntoView({ behavior: reduzirMovimento ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      {/* Fundo decorativo: gradiente + formas em CSS. A foto opcional vem de --hero-image (index.css). */}
      <div className="hero__fundo" aria-hidden="true">
        <span className="hero__disco" />
        <span className="hero__risco hero__risco--1" />
        <span className="hero__risco hero__risco--2" />
        <span className="hero__risco hero__risco--3" />
      </div>

      <div className="hero__conteudo container">
        <p className="hero__selo">Kaizen · melhoria contínua</p>

        <h1 id="hero-titulo" className="hero__titulo">
          <span>Treine.</span>
          <span>Coma bem.</span>
          <span className="hero__destaque">
            Evolua.
            <span className="hero__pincelada" aria-hidden="true" />
          </span>
        </h1>

        <p className="hero__subtitulo">{SITE.slogan}</p>

        <div className="hero__acoes">
          <Link to="/receitas" className="btn btn-primary">
            Ver receitas
          </Link>
          <button type="button" className="btn btn-ghost" onClick={rolarAteProximaSecao}>
            Saiba mais
          </button>
        </div>
      </div>
    </section>
  )
}
