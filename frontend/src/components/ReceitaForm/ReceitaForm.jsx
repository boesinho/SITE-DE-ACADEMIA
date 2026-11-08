import { useId, useRef, useState } from 'react'
import { CATEGORIAS, categoriaValida } from '../../config/categorias'
import { atualizarReceita, criarReceita } from '../../services/api'
import Modal from '../Modal/Modal'
import './ReceitaForm.css'

// Limites iguais aos do banco/API (a API valida de novo; aqui é só para avisar mais cedo).
const INT_MAX = 2147483647
const PROTEINA_MAX = 9999.9

// Mesma ordem em que os campos aparecem na tela: usada para focar o primeiro com erro.
const ORDEM_CAMPOS = [
  'nome_receita',
  'categoria',
  'tempo_preparo_min',
  'descricao_curta',
  'calorias',
  'proteina_g',
  'ingredientes',
  'modo_preparo',
]

function valoresIniciais(receita, categoriaInicial) {
  if (!receita) {
    return {
      nome_receita: '',
      categoria: categoriaValida(categoriaInicial) ? categoriaInicial : '',
      descricao_curta: '',
      ingredientes: '',
      modo_preparo: '',
      tempo_preparo_min: '',
      calorias: '',
      proteina_g: '',
    }
  }
  return {
    nome_receita: receita.nome_receita,
    categoria: receita.categoria,
    descricao_curta: receita.descricao_curta ?? '',
    ingredientes: receita.ingredientes,
    modo_preparo: receita.modo_preparo,
    tempo_preparo_min: String(receita.tempo_preparo_min),
    calorias: receita.calorias === null ? '' : String(receita.calorias),
    // Em português se escreve 10,5; a API devolve 10.5
    proteina_g: receita.proteina_g === null ? '' : String(receita.proteina_g).replace('.', ','),
  }
}

// Validação simples no front. Devolve os erros por campo e, se estiver tudo certo,
// o objeto pronto para enviar à API (campos opcionais vazios viram null).
function validar(valores) {
  const erros = {}

  const nome = valores.nome_receita.trim()
  if (!nome) erros.nome_receita = 'Informe o nome da receita.'
  else if ([...nome].length > 120) erros.nome_receita = 'O nome pode ter no máximo 120 caracteres.'

  if (!categoriaValida(valores.categoria)) erros.categoria = 'Escolha uma categoria.'

  const descricao = valores.descricao_curta.trim()
  if ([...descricao].length > 255) {
    erros.descricao_curta = 'A descrição curta pode ter no máximo 255 caracteres.'
  }

  const ingredientes = valores.ingredientes.trim()
  if (!ingredientes) erros.ingredientes = 'Informe os ingredientes (um por linha).'

  const modoPreparo = valores.modo_preparo.trim()
  if (!modoPreparo) erros.modo_preparo = 'Informe o modo de preparo.'

  const tempo = valores.tempo_preparo_min.trim()
  if (!tempo) {
    erros.tempo_preparo_min = 'Informe o tempo de preparo, em minutos.'
  } else if (!/^\d+$/.test(tempo) || Number(tempo) < 1 || Number(tempo) > INT_MAX) {
    erros.tempo_preparo_min = 'Use um número inteiro maior que zero.'
  }

  const calorias = valores.calorias.trim()
  if (calorias && (!/^\d+$/.test(calorias) || Number(calorias) > INT_MAX)) {
    erros.calorias = 'Use um número inteiro maior ou igual a zero.'
  }

  const proteina = valores.proteina_g.trim().replace(',', '.')
  if (proteina && (!/^\d+(\.\d+)?$/.test(proteina) || Number(proteina) > PROTEINA_MAX)) {
    erros.proteina_g = 'Use um número entre 0 e 9999,9.'
  }

  if (Object.keys(erros).length > 0) return { erros, dados: null }

  return {
    erros,
    dados: {
      nome_receita: nome,
      categoria: valores.categoria,
      descricao_curta: descricao || null,
      ingredientes,
      modo_preparo: modoPreparo,
      tempo_preparo_min: Number(tempo),
      calorias: calorias ? Number(calorias) : null,
      proteina_g: proteina ? Number(proteina) : null,
    },
  }
}

// Converte o erro da API ({ erro, campos: [{ campo, mensagem }] }) em mensagens por campo.
// O que não for de um campo conhecido (ou um erro sem campos, como API fora do ar) vira `geral`.
function interpretarErroDaApi(erro) {
  const porCampo = {}
  const sobras = []
  for (const { campo, mensagem } of erro.campos ?? []) {
    if (ORDEM_CAMPOS.includes(campo)) porCampo[campo] = mensagem
    else sobras.push(mensagem)
  }
  if (erro.status === 409 && !porCampo.nome_receita) {
    porCampo.nome_receita = 'Já existe uma receita com esse nome.'
  }
  const temCampos = Object.keys(porCampo).length > 0
  return { porCampo, geral: temCampos ? sobras.join(' ') : erro.message }
}

// Rótulo + controle + dica + erro, com as ligações de acessibilidade (label, aria-describedby).
// `children` recebe as props que o controle precisa receber.
function Campo({ nome, rotulo, obrigatorio = false, dica, erro, children }) {
  const base = useId()
  const idControle = `${base}-controle`
  const idDica = `${base}-dica`
  const idErro = `${base}-erro`
  const descricao = [dica && idDica, erro && idErro].filter(Boolean).join(' ')

  return (
    <div className={`campo${erro ? ' campo--erro' : ''}`}>
      <label className="campo__rotulo" htmlFor={idControle}>
        {rotulo}
        {obrigatorio && (
          <span className="campo__obrigatorio" aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children({
        id: idControle,
        name: nome,
        'aria-invalid': erro ? 'true' : 'false',
        'aria-required': obrigatorio ? 'true' : undefined,
        'aria-describedby': descricao || undefined,
      })}
      {dica && (
        <p id={idDica} className="campo__dica">
          {dica}
        </p>
      )}
      {erro && (
        <p id={idErro} className="campo__erro">
          {erro}
        </p>
      )}
    </div>
  )
}

// Formulário de receita em modal. Sem `receita` cria; com `receita` edita (PUT = envia tudo).
// `onSalvo(receitaSalva, criou)` é chamado quando a API confirma.
export default function ReceitaForm({ receita = null, categoriaInicial = '', onCancelar, onSalvo }) {
  const formId = useId()
  const formRef = useRef(null)
  const [valores, setValores] = useState(() => valoresIniciais(receita, categoriaInicial))
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [salvando, setSalvando] = useState(false)
  const editando = receita !== null

  function alterar(campo) {
    return (evento) => {
      const valor = evento.target.value
      setValores((atual) => ({ ...atual, [campo]: valor }))
      // Ao digitar no campo, o erro dele some.
      setErros((atual) => {
        if (!atual[campo]) return atual
        const proximo = { ...atual }
        delete proximo[campo]
        return proximo
      })
    }
  }

  function focarPrimeiroComErro(mapaDeErros) {
    const campo = ORDEM_CAMPOS.find((nome) => mapaDeErros[nome])
    if (campo) formRef.current?.elements.namedItem(campo)?.focus()
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    if (salvando) return

    const { erros: errosDoFront, dados } = validar(valores)
    setErros(errosDoFront)
    setErroGeral('')
    if (!dados) {
      focarPrimeiroComErro(errosDoFront)
      return
    }

    setSalvando(true)
    try {
      const salva = editando
        ? await atualizarReceita(receita.id_receita, dados)
        : await criarReceita(dados)
      onSalvo(salva, !editando)
    } catch (erro) {
      const { porCampo, geral } = interpretarErroDaApi(erro)
      setErros(porCampo)
      setErroGeral(geral)
      setSalvando(false)
      focarPrimeiroComErro(porCampo)
    }
  }

  return (
    <Modal
      titulo={editando ? 'Editar receita' : 'Nova receita'}
      onFechar={onCancelar}
      largura="lg"
      bloqueado={salvando}
      fecharAoClicarFora={false}
      rodape={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancelar} disabled={salvando}>
            Cancelar
          </button>
          <button type="submit" form={formId} className="btn btn-primary" disabled={salvando}>
            {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : 'Criar receita'}
          </button>
        </>
      }
    >
      <form id={formId} ref={formRef} className="receita-form" onSubmit={aoEnviar} noValidate>
        {erroGeral && (
          <p className="receita-form__erro-geral" role="alert">
            {erroGeral}
          </p>
        )}

        <Campo nome="nome_receita" rotulo="Nome da receita" obrigatorio erro={erros.nome_receita}>
          {(props) => (
            <input
              {...props}
              type="text"
              maxLength={120}
              autoComplete="off"
              data-autofocus
              value={valores.nome_receita}
              onChange={alterar('nome_receita')}
            />
          )}
        </Campo>

        <div className="receita-form__linha">
          <Campo nome="categoria" rotulo="Categoria" obrigatorio erro={erros.categoria}>
            {(props) => (
              <select {...props} value={valores.categoria} onChange={alterar('categoria')}>
                <option value="">Selecione…</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.rotulo}
                  </option>
                ))}
              </select>
            )}
          </Campo>

          <Campo
            nome="tempo_preparo_min"
            rotulo="Tempo de preparo (min)"
            obrigatorio
            erro={erros.tempo_preparo_min}
          >
            {(props) => (
              <input
                {...props}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ex.: 15"
                value={valores.tempo_preparo_min}
                onChange={alterar('tempo_preparo_min')}
              />
            )}
          </Campo>
        </div>

        <Campo
          nome="descricao_curta"
          rotulo="Descrição curta"
          dica="Opcional. Até 255 caracteres."
          erro={erros.descricao_curta}
        >
          {(props) => (
            <input
              {...props}
              type="text"
              maxLength={255}
              autoComplete="off"
              value={valores.descricao_curta}
              onChange={alterar('descricao_curta')}
            />
          )}
        </Campo>

        <div className="receita-form__linha">
          <Campo nome="calorias" rotulo="Calorias (kcal)" dica="Opcional, por porção." erro={erros.calorias}>
            {(props) => (
              <input
                {...props}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Ex.: 260"
                value={valores.calorias}
                onChange={alterar('calorias')}
              />
            )}
          </Campo>

          <Campo nome="proteina_g" rotulo="Proteína (g)" dica="Opcional, por porção." erro={erros.proteina_g}>
            {(props) => (
              <input
                {...props}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="Ex.: 10,5"
                value={valores.proteina_g}
                onChange={alterar('proteina_g')}
              />
            )}
          </Campo>
        </div>

        <Campo
          nome="ingredientes"
          rotulo="Ingredientes"
          obrigatorio
          dica="Um ingrediente por linha."
          erro={erros.ingredientes}
        >
          {(props) => (
            <textarea
              {...props}
              rows={5}
              value={valores.ingredientes}
              onChange={alterar('ingredientes')}
            />
          )}
        </Campo>

        <Campo
          nome="modo_preparo"
          rotulo="Modo de preparo"
          obrigatorio
          dica="Um passo por linha. Pode numerar (1., 2., ...) ou não."
          erro={erros.modo_preparo}
        >
          {(props) => (
            <textarea
              {...props}
              rows={6}
              value={valores.modo_preparo}
              onChange={alterar('modo_preparo')}
            />
          )}
        </Campo>
      </form>
    </Modal>
  )
}
