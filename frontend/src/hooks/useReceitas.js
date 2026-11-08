import { useCallback, useEffect, useState } from 'react'
import { listarReceitas } from '../services/api'

// Carrega a lista de receitas (opcionalmente de uma categoria).
//  - Respostas atrasadas são ignoradas: se o filtro mudar enquanto uma requisição está
//    em andamento, ela é cancelada e o resultado dela nunca chega à tela.
//  - `recarregar()` busca de novo com o mesmo filtro. Se já havia uma lista desse filtro
//    na tela, ela continua visível (`atualizando`) em vez de piscar um carregamento.
export default function useReceitas(categoria = '') {
  const [tentativa, setTentativa] = useState(0)
  const [resultado, setResultado] = useState({
    chave: null,
    categoria: null,
    receitas: [],
    erro: null,
  })
  const chave = `${categoria}#${tentativa}`

  useEffect(() => {
    const controle = new AbortController()
    let ativo = true

    listarReceitas(categoria, { signal: controle.signal })
      .then((receitas) => {
        if (ativo) setResultado({ chave, categoria, receitas, erro: null })
      })
      .catch((erro) => {
        if (!ativo || erro.name === 'AbortError') return
        setResultado({ chave, categoria, receitas: [], erro })
      })

    return () => {
      ativo = false
      controle.abort()
    }
  }, [categoria, chave])

  const recarregar = useCallback(() => setTentativa((n) => n + 1), [])

  // O resultado guardado só vale se for da busca atual (mesma chave).
  const pendente = resultado.chave !== chave
  const manterLista = pendente && !resultado.erro && resultado.categoria === categoria
  const carregando = pendente && !manterLista

  return {
    receitas: carregando ? [] : resultado.receitas,
    carregando,
    atualizando: manterLista,
    erro: pendente ? null : resultado.erro,
    recarregar,
  }
}
