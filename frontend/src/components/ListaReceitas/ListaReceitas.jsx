import ReceitaCard from '../ReceitaCard/ReceitaCard'
import './ListaReceitas.css'

// Mostra a lista de receitas com todos os estados: carregando, erro (com "Tentar de novo"),
// vazio e a grade de cards. Usada na Home (destaques) e na página de Receitas.
//  - `vazio`: conteúdo mostrado quando não há receitas (cada página escreve o seu texto)
//  - `atualizando`: a lista continua na tela enquanto é recarregada em segundo plano
export default function ListaReceitas({
  receitas,
  carregando,
  atualizando = false,
  erro,
  onTentarNovamente,
  onAbrir,
  vazio,
  quantidadeEsqueleto = 6,
}) {
  if (carregando) {
    return (
      <div role="status">
        <span className="sr-only">Carregando receitas…</span>
        <ul className="lista-receitas__grade" aria-hidden="true">
          {Array.from({ length: quantidadeEsqueleto }, (_, indice) => (
            <li key={indice} className="lista-receitas__esqueleto">
              <span className="lista-receitas__esqueleto-capa" />
              <span className="lista-receitas__esqueleto-linha lista-receitas__esqueleto-linha--titulo" />
              <span className="lista-receitas__esqueleto-linha" />
              <span className="lista-receitas__esqueleto-linha lista-receitas__esqueleto-linha--curta" />
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (erro) {
    return (
      <div className="lista-receitas__aviso lista-receitas__aviso--erro" role="alert">
        <h3>{erro.semConexao ? 'A API parece estar fora do ar' : 'Algo deu errado'}</h3>
        <p>{erro.message}</p>
        <button type="button" className="btn btn-primary" onClick={onTentarNovamente}>
          Tentar de novo
        </button>
      </div>
    )
  }

  if (receitas.length === 0) {
    return <div className="lista-receitas__aviso">{vazio}</div>
  }

  return (
    <ul
      className={`lista-receitas__grade${atualizando ? ' lista-receitas__grade--atualizando' : ''}`}
      aria-busy={atualizando}
    >
      {receitas.map((receita) => (
        <li key={receita.id_receita}>
          <ReceitaCard receita={receita} onAbrir={onAbrir} />
        </li>
      ))}
    </ul>
  )
}
