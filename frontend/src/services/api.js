// Acesso à API do backend (Express). Usa fetch, sem bibliotecas extras.
// O endereço vem de frontend/.env (VITE_API_URL); o padrão é o backend local.
const URL_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '')

// Erro com a mensagem amigável da API (campo `erro`) e os erros por campo (`campos`),
// no formato { erro, campos?: [{ campo, mensagem }] }.
export class ApiError extends Error {
  constructor(mensagem, { status = 0, campos = [], semConexao = false } = {}) {
    super(mensagem)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
    this.semConexao = semConexao
  }
}

function mensagemPadrao(status) {
  if (status === 404) return 'Receita não encontrada.'
  if (status >= 500) return 'O servidor encontrou um erro. Tente novamente em instantes.'
  return 'Não foi possível concluir a operação.'
}

async function requisitar(caminho, { metodo = 'GET', corpo, signal } = {}) {
  let resposta
  let texto
  try {
    resposta = await fetch(`${URL_BASE}${caminho}`, {
      method: metodo,
      headers: corpo !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
      signal,
    })
    texto = await resposta.text()
  } catch (erro) {
    // Requisição cancelada de propósito (ex.: o usuário trocou o filtro): quem chamou ignora.
    if (erro.name === 'AbortError') throw erro
    throw new ApiError('Não foi possível conectar à API. Verifique se o servidor está rodando.', {
      semConexao: true,
    })
  }

  let dados = null
  if (texto) {
    try {
      dados = JSON.parse(texto)
    } catch {
      dados = null
    }
  }

  if (!resposta.ok) {
    throw new ApiError(dados?.erro || mensagemPadrao(resposta.status), {
      status: resposta.status,
      campos: Array.isArray(dados?.campos) ? dados.campos : [],
    })
  }
  return dados
}

// `categoria` é opcional ('' ou undefined = todas). `opcoes.signal` permite cancelar.
export function listarReceitas(categoria, opcoes = {}) {
  const consulta = categoria ? `?categoria=${encodeURIComponent(categoria)}` : ''
  return requisitar(`/receitas${consulta}`, opcoes)
}

export function buscarReceita(id, opcoes = {}) {
  return requisitar(`/receitas/${encodeURIComponent(id)}`, opcoes)
}

export function criarReceita(dados) {
  return requisitar('/receitas', { metodo: 'POST', corpo: dados })
}

// PUT = substituição completa: envie a receita inteira.
export function atualizarReceita(id, dados) {
  return requisitar(`/receitas/${encodeURIComponent(id)}`, { metodo: 'PUT', corpo: dados })
}

export function excluirReceita(id) {
  return requisitar(`/receitas/${encodeURIComponent(id)}`, { metodo: 'DELETE' })
}
