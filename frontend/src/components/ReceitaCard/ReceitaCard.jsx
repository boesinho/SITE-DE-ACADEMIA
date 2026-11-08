import { buscarCategoria } from '../../config/categorias'
import { formatarNumero, formatarTempo } from '../../utils/formatar'
import './ReceitaCard.css'

// Card de uma receita. O nome é um botão que "estica" para cobrir o card todo
// (assim o card inteiro é clicável, mas leitores de tela veem um único botão com o nome).
export default function ReceitaCard({ receita, onAbrir }) {
  const categoria = buscarCategoria(receita.categoria)
  const temCalorias = receita.calorias !== null && receita.calorias !== undefined
  const temProteina = receita.proteina_g !== null && receita.proteina_g !== undefined

  return (
    <article className="receita-card">
      <div className="receita-card__topo">
        <div className="receita-card__capa" style={{ background: categoria.gradiente }} aria-hidden="true">
          <span className="receita-card__emoji">{categoria.emoji}</span>
        </div>
        <span className="receita-card__selo">{categoria.rotulo}</span>
      </div>

      <div className="receita-card__corpo">
        <h3 className="receita-card__titulo">
          <button
            type="button"
            className="receita-card__abrir"
            aria-haspopup="dialog"
            onClick={() => onAbrir(receita)}
          >
            {receita.nome_receita}
          </button>
        </h3>

        {temProteina && (
          <p className="receita-card__proteina">
            <strong>{formatarNumero(receita.proteina_g)} g</strong> de proteína
          </p>
        )}

        {receita.descricao_curta && (
          <p className="receita-card__descricao">{receita.descricao_curta}</p>
        )}

        <ul className="receita-card__dados">
          <li>
            <span aria-hidden="true">🕒</span>
            <span className="sr-only">Tempo de preparo: </span>
            {formatarTempo(receita.tempo_preparo_min)}
          </li>
          {temCalorias && (
            <li>
              <span aria-hidden="true">🔥</span>
              <span className="sr-only">Calorias: </span>
              {formatarNumero(receita.calorias)} kcal
            </li>
          )}
        </ul>
      </div>
    </article>
  )
}
