import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal'
import ListaReceitas from '../../components/ListaReceitas/ListaReceitas'
import ReceitaForm from '../../components/ReceitaForm/ReceitaForm'
import ReceitaModal from '../../components/ReceitaModal/ReceitaModal'
import { buscarCategoria, categoriaValida, CATEGORIAS } from '../../config/categorias'
import { SITE } from '../../config/site'
import useReceitas from '../../hooks/useReceitas'
import { excluirReceita } from '../../services/api'
import './Receitas.css'

const FILTROS = [{ valor: '', rotulo: 'Todas' }, ...CATEGORIAS]

export default function Receitas() {
  // O filtro fica na URL (/receitas?categoria=lanche): recarregar a página ou usar o
  // botão "voltar" mantém a categoria escolhida.
  const [parametros, setParametros] = useSearchParams()
  const parametro = parametros.get('categoria') ?? ''
  const categoria = categoriaValida(parametro) ? parametro : ''

  const { receitas, carregando, atualizando, erro, recarregar } = useReceitas(categoria)

  const [selecionada, setSelecionada] = useState(null) // receita aberta no modal de detalhes
  const [formulario, setFormulario] = useState(null) // { receita } (null dentro = nova receita)
  const [exclusao, setExclusao] = useState(null) // { receita, processando, erro }
  const [aviso, setAviso] = useState('')
  const [pedidosDeFocoNoTitulo, setPedidosDeFocoNoTitulo] = useState(0)
  const tituloRef = useRef(null)

  useEffect(() => {
    document.title = `Receitas | ${SITE.nome}`
  }, [])

  // Depois de excluir, o card que abriu o modal não existe mais, então o foco vai para o título.
  // Precisa ser em um efeito: enquanto os modais estão abertos a página está inerte e o foco
  // falharia. Os efeitos de limpeza dos modais (que reativam a página) rodam antes deste.
  useEffect(() => {
    if (pedidosDeFocoNoTitulo > 0) tituloRef.current?.focus()
  }, [pedidosDeFocoNoTitulo])

  // A mensagem de sucesso some sozinha.
  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(''), 5000)
    return () => clearTimeout(temporizador)
  }, [aviso])

  function escolherCategoria(valor) {
    setParametros(valor ? { categoria: valor } : {})
  }

  function aoSalvar(salva, criou) {
    let mensagem = criou ? 'Receita criada com sucesso.' : 'Receita atualizada com sucesso.'
    // Se a receita foi para outra categoria, ela não aparece no filtro atual: avisamos onde ela está.
    if (categoria && salva.categoria !== categoria) {
      mensagem += ` Ela está em “${buscarCategoria(salva.categoria).rotulo}”.`
    }
    setFormulario(null)
    setSelecionada(null)
    setAviso(mensagem)
    recarregar()
  }

  async function confirmarExclusao() {
    const { receita } = exclusao
    setExclusao({ receita, processando: true, erro: '' })
    try {
      await excluirReceita(receita.id_receita)
      setExclusao(null)
      setSelecionada(null)
      setAviso('Receita excluída.')
      recarregar()
      setPedidosDeFocoNoTitulo((n) => n + 1)
    } catch (falha) {
      // 404: já tinha sido removida em outro lugar; atualizamos a lista de qualquer forma.
      if (falha.status === 404) recarregar()
      setExclusao({ receita, processando: false, erro: falha.message })
    }
  }

  const contagem = receitas.length === 1 ? '1 receita' : `${receitas.length} receitas`

  return (
    <div className="receitas">
      <div className="container">
        <header className="receitas__cabecalho">
          <div>
            <span className="eyebrow">Cozinha Kaizen</span>
            <h1 className="titulo-secao receitas__titulo" tabIndex={-1} ref={tituloRef}>
              Receitas fitness
            </h1>
            <p className="subtitulo-secao">
              Ideias simples para abastecer o treino, do café da manhã ao pós-treino. Cadastre, edite e organize as suas.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => setFormulario({ receita: null })}>
            + Nova receita
          </button>
        </header>

        <div className="receitas__filtros" role="group" aria-label="Filtrar por categoria">
          {FILTROS.map((filtro) => (
            <button
              key={filtro.valor || 'todas'}
              type="button"
              className="chip"
              aria-pressed={categoria === filtro.valor}
              onClick={() => escolherCategoria(filtro.valor)}
            >
              {filtro.rotulo}
            </button>
          ))}
        </div>

        <p className="receitas__contagem" aria-live="polite">
          {!carregando && !erro ? contagem : ' '}
        </p>

        <ListaReceitas
          receitas={receitas}
          carregando={carregando}
          atualizando={atualizando}
          erro={erro}
          onTentarNovamente={recarregar}
          onAbrir={setSelecionada}
          vazio={
            <>
              <h3>Nenhuma receita por aqui</h3>
              <p>
                {categoria
                  ? 'Ainda não há receitas nesta categoria. Que tal cadastrar a primeira?'
                  : 'Ainda não há receitas cadastradas. Que tal cadastrar a primeira?'}
              </p>
              <button type="button" className="btn btn-primary" onClick={() => setFormulario({ receita: null })}>
                + Nova receita
              </button>
            </>
          }
        />
      </div>

      {aviso && (
        <div className="receitas__aviso" role="status">
          <span aria-hidden="true">✓</span> {aviso}
        </div>
      )}

      {selecionada && (
        <ReceitaModal
          receita={selecionada}
          onFechar={() => setSelecionada(null)}
          onEditar={(receita) => setFormulario({ receita })}
          onExcluir={(receita) => setExclusao({ receita, processando: false, erro: '' })}
        />
      )}

      {formulario && (
        <ReceitaForm
          receita={formulario.receita}
          categoriaInicial={categoria}
          onCancelar={() => setFormulario(null)}
          onSalvo={aoSalvar}
        />
      )}

      {exclusao && (
        <ConfirmModal
          titulo="Excluir receita?"
          mensagem={`A receita “${exclusao.receita.nome_receita}” será removida de vez. Essa ação não pode ser desfeita.`}
          textoConfirmar="Excluir"
          perigo
          processando={exclusao.processando}
          erro={exclusao.erro}
          onConfirmar={confirmarExclusao}
          onCancelar={() => setExclusao(null)}
        />
      )}
    </div>
  )
}
