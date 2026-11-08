// Categorias de receita. O `valor` é exatamente o que a API aceita e devolve.
// Emoji e gradiente são só visuais (não existem imagens externas no projeto).
export const CATEGORIAS = [
  {
    valor: 'cafe_da_manha',
    rotulo: 'Café da manhã',
    emoji: '🍳',
    gradiente: 'linear-gradient(135deg, #6b4a14 0%, #2e2210 55%, #1a1a1d 100%)',
  },
  {
    valor: 'pre_treino',
    rotulo: 'Pré-treino',
    emoji: '⚡',
    gradiente: 'linear-gradient(135deg, #4f6a0c 0%, #26330a 55%, #1a1a1d 100%)',
  },
  {
    valor: 'pos_treino',
    rotulo: 'Pós-treino',
    emoji: '🥤',
    gradiente: 'linear-gradient(135deg, #0e5a55 0%, #0b2d2b 55%, #1a1a1d 100%)',
  },
  {
    valor: 'almoco_jantar',
    rotulo: 'Almoço/Jantar',
    emoji: '🍗',
    gradiente: 'linear-gradient(135deg, #6e2a1c 0%, #33150f 55%, #1a1a1d 100%)',
  },
  {
    valor: 'lanche',
    rotulo: 'Lanche',
    emoji: '🍎',
    gradiente: 'linear-gradient(135deg, #52336f 0%, #271835 55%, #1a1a1d 100%)',
  },
]

const PADRAO = {
  valor: '',
  rotulo: 'Receita',
  emoji: '🍽️',
  gradiente: 'linear-gradient(135deg, #34343a 0%, #1a1a1d 100%)',
}

// Devolve os dados visuais da categoria (ou um padrão neutro se vier uma desconhecida).
export function buscarCategoria(valor) {
  return CATEGORIAS.find((c) => c.valor === valor) ?? PADRAO
}

export function categoriaValida(valor) {
  return CATEGORIAS.some((c) => c.valor === valor)
}
