import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { SITE } from '../../config/site'
import './Navbar.css'

const classeLink = ({ isActive }) => `navbar__link${isActive ? ' navbar__link--ativo' : ''}`

export default function Navbar() {
  const { pathname } = useLocation()
  // Guardamos EM QUAL rota o menu foi aberto: ao navegar (inclusive pelo botão "voltar"),
  // a rota muda e o menu fecha sozinho, sem precisar de efeito para resetar o estado.
  const [abertoEm, setAbertoEm] = useState(null)
  const aberto = abertoEm === pathname

  useEffect(() => {
    if (!aberto) return undefined
    function aoTeclar(evento) {
      if (evento.key === 'Escape') setAbertoEm(null)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => document.removeEventListener('keydown', aoTeclar)
  }, [aberto])

  const fechar = () => setAbertoEm(null)

  return (
    <header className="navbar">
      <div className="navbar__interno container">
        <Link to="/" className="navbar__marca" onClick={fechar} aria-label={`${SITE.nome}, início`}>
          <span className="navbar__logo" aria-hidden="true" />
          <span className="navbar__nome">{SITE.nome}</span>
          <span className="navbar__kanji" lang="ja" title={SITE.significado} aria-hidden="true">
            {SITE.kanji}
          </span>
        </Link>

        <button
          type="button"
          className="navbar__botao"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAbertoEm(aberto ? null : pathname)}
        >
          <span className="navbar__hamburguer" aria-hidden="true" />
        </button>

        <nav
          id="menu-principal"
          className={`navbar__menu${aberto ? ' navbar__menu--aberto' : ''}`}
          aria-label="Principal"
        >
          <NavLink to="/" end className={classeLink} onClick={fechar}>
            Início
          </NavLink>
          <NavLink to="/receitas" className={classeLink} onClick={fechar}>
            Receitas
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
