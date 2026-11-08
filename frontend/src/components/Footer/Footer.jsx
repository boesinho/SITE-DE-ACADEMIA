import { SITE } from '../../config/site'
import './Footer.css'

// Calculado uma vez, fora do componente (não precisa mudar a cada renderização).
const ANO_ATUAL = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__interno container">
        <p className="footer__marca">
          <span className="footer__nome">{SITE.nome}</span>
          <span className="footer__ano">© {ANO_ATUAL}</span>
        </p>
        <p className="footer__aviso">{SITE.aviso}</p>
      </div>
    </footer>
  )
}
