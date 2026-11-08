const formatadorNumero = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

// 10.5 -> "10,5"; 37 -> "37"
export function formatarNumero(valor) {
  return formatadorNumero.format(valor)
}

// 15 -> "15 min"; 65 -> "1 h 5 min"; 120 -> "2 h"
export function formatarTempo(minutos) {
  if (minutos < 60) return `${minutos} min`
  const horas = Math.floor(minutos / 60)
  const resto = minutos % 60
  return resto ? `${horas} h ${resto} min` : `${horas} h`
}

// "a\nb\n\n c " -> ["a", "b", "c"]
export function separarLinhas(texto) {
  return String(texto ?? '')
    .split(/\r?\n/)
    .map((linha) => linha.trim())
    .filter(Boolean)
}

// Prefixo de passo numerado: "1. ", "2) ", "3 - "
const PREFIXO_PASSO = /^\d+\s*[.)\-–:]\s*/

// Separa o modo de preparo em passos e observações.
// O texto vem como "1. Faça isso\n2. Faça aquilo". Como a lista na tela já é numerada,
// o "1. " é removido para não aparecer "1. 1. Faça isso". Linhas sem número, quando
// existem passos numerados, viram observações (ex.: "O descanso na geladeira é à parte.").
// Se nenhuma linha for numerada, todas são passos.
export function separarPassos(texto) {
  const linhas = separarLinhas(texto)
  const numeradas = linhas.filter((linha) => PREFIXO_PASSO.test(linha))
  if (numeradas.length === 0) return { passos: linhas, observacoes: [] }
  return {
    passos: numeradas.map((linha) => linha.replace(PREFIXO_PASSO, '')),
    observacoes: linhas.filter((linha) => !PREFIXO_PASSO.test(linha)),
  }
}
