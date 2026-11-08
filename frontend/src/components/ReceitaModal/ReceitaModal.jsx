import { buscarCategoria } from '../../config/categorias'
import { formatarNumero, formatarTempo, separarLinhas, separarPassos } from '../../utils/formatar'
import Modal from '../Modal/Modal'
import './ReceitaModal.css'

// Detalhes de uma receita. Os botões Editar/Excluir só aparecem se os handlers forem passados
// (na Home o modal é só de leitura).
export default function ReceitaModal({ receita, onFechar, onEditar, onExcluir }) {
  const categoria = buscarCategoria(receita.categoria)
  const ingredientes = separarLinhas(receita.ingredientes)
  const { passos, observacoes } = separarPassos(receita.modo_preparo)
  const temCalorias = receita.calorias !== null && receita.calorias !== undefined
  const temProteina = receita.proteina_g !== null && receita.proteina_g !== undefined

  return (
    <Modal
      titulo={receita.nome_receita}
      onFechar={onFechar}
      largura="lg"
      rodape={
        <div className="receita-modal__acoes">
          {onExcluir && (
            <button type="button" className="btn btn-danger" onClick={() => onExcluir(receita)}>
              Excluir
            </button>
          )}
          <span className="receita-modal__espaco" />
          {onEditar && (
            <button type="button" className="btn btn-ghost" onClick={() => onEditar(receita)}>
              Editar
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={onFechar}>
            Fechar
          </button>
        </div>
      }
    >
      <div className="receita-modal__capa" style={{ background: categoria.gradiente }}>
        <span className="receita-modal__emoji" aria-hidden="true">
          {categoria.emoji}
        </span>
        <span className="receita-modal__selo">{categoria.rotulo}</span>
      </div>

      <ul className="receita-modal__dados">
        <li>
          <span className="receita-modal__valor">{formatarTempo(receita.tempo_preparo_min)}</span>
          <span className="receita-modal__legenda">de preparo</span>
        </li>
        {temCalorias && (
          <li>
            <span className="receita-modal__valor">{formatarNumero(receita.calorias)} kcal</span>
            <span className="receita-modal__legenda">calorias</span>
          </li>
        )}
        {temProteina && (
          <li className="receita-modal__dado-destaque">
            <span className="receita-modal__valor">{formatarNumero(receita.proteina_g)} g</span>
            <span className="receita-modal__legenda">de proteína</span>
          </li>
        )}
      </ul>

      {(temCalorias || temProteina) && (
        <p className="receita-modal__nota">Valores nutricionais aproximados, por porção.</p>
      )}

      {receita.descricao_curta && <p className="receita-modal__descricao">{receita.descricao_curta}</p>}

      <div className="receita-modal__colunas">
        <section aria-labelledby={`ingredientes-${receita.id_receita}`}>
          <h3 id={`ingredientes-${receita.id_receita}`}>Ingredientes</h3>
          <ul className="receita-modal__ingredientes">
            {ingredientes.map((item, indice) => (
              <li key={indice}>{item}</li>
            ))}
          </ul>
        </section>

        <section aria-labelledby={`preparo-${receita.id_receita}`}>
          <h3 id={`preparo-${receita.id_receita}`}>Modo de preparo</h3>
          <ol className="receita-modal__passos">
            {passos.map((passo, indice) => (
              <li key={indice}>{passo}</li>
            ))}
          </ol>
          {observacoes.map((observacao, indice) => (
            <p key={indice} className="receita-modal__observacao">
              {observacao}
            </p>
          ))}
        </section>
      </div>
    </Modal>
  )
}
