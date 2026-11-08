import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import './Modal.css'

const SELETOR_FOCAVEL =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Modais abertos agora (o último é o que está no topo). Só o do topo reage ao Esc e ao Tab.
const pilha = []
// Valor do overflow do body ANTES do primeiro modal abrir. É guardado uma única vez: se cada
// modal guardasse o "anterior" dele, ao fechar dois de uma vez o de cima restauraria "hidden"
// (o valor que o de baixo deixou) e a página ficaria sem rolagem.
let overflowOriginal = ''

// Base de todos os modais do site. Cuida da acessibilidade em um lugar só:
//  - role="dialog" + aria-modal + título associado (aria-labelledby)
//  - Esc fecha; Tab fica preso dentro do modal
//  - o foco entra no modal e VOLTA para o botão que o abriu
//  - o scroll do fundo fica travado e o resto da página fica inerte (leitores de tela e Tab)
// Props: `titulo`, `onFechar`, `rodape` (botões), `largura` ('sm' | 'md' | 'lg'),
//        `bloqueado` (impede fechar, ex.: enquanto salva), `fecharAoClicarFora`, `descricaoId`.
// Um elemento com o atributo data-autofocus recebe o foco inicial; sem ele, o foco vai
// para o próprio diálogo (o leitor de tela lê o título).
export default function Modal({
  titulo,
  onFechar,
  children,
  rodape = null,
  largura = 'md',
  bloqueado = false,
  fecharAoClicarFora = true,
  descricaoId,
}) {
  const tituloId = useId()
  const sobreposicaoRef = useRef(null)
  const painelRef = useRef(null)
  // Guardamos as props "vivas" em refs para o efeito principal rodar só na abertura/fechamento.
  const onFecharRef = useRef(onFechar)
  const bloqueadoRef = useRef(bloqueado)

  useEffect(() => {
    onFecharRef.current = onFechar
    bloqueadoRef.current = bloqueado
  })

  useEffect(() => {
    const sobreposicao = sobreposicaoRef.current
    const painel = painelRef.current
    const origem = document.activeElement // normalmente o botão que abriu o modal
    const raiz = document.getElementById('root')

    if (pilha.length === 0) overflowOriginal = document.body.style.overflow
    pilha.push(sobreposicao)
    document.body.style.overflow = 'hidden'

    if (raiz) raiz.inert = true
    const outrosModais = [...document.querySelectorAll('[data-modal]')].filter(
      (el) => el !== sobreposicao,
    )
    outrosModais.forEach((el) => {
      el.inert = true
    })

    const alvoInicial = painel.querySelector('[data-autofocus]') ?? painel
    alvoInicial.focus({ preventScroll: true })

    function aoTeclar(evento) {
      if (pilha[pilha.length - 1] !== sobreposicao) return

      if (evento.key === 'Escape') {
        if (!bloqueadoRef.current) {
          evento.preventDefault()
          onFecharRef.current()
        }
        return
      }

      if (evento.key !== 'Tab') return
      const focaveis = [...painel.querySelectorAll(SELETOR_FOCAVEL)].filter(
        (el) => el.getClientRects().length > 0,
      )
      if (focaveis.length === 0) {
        evento.preventDefault()
        painel.focus()
        return
      }
      const primeiro = focaveis[0]
      const ultimo = focaveis[focaveis.length - 1]
      const ativo = document.activeElement
      if (!painel.contains(ativo) || (evento.shiftKey && (ativo === primeiro || ativo === painel))) {
        evento.preventDefault()
        ;(evento.shiftKey ? ultimo : primeiro).focus()
      } else if (!evento.shiftKey && ativo === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', aoTeclar)

    return () => {
      document.removeEventListener('keydown', aoTeclar)
      pilha.splice(pilha.indexOf(sobreposicao), 1)
      // Só o ÚLTIMO modal a fechar destrava a página (não importa a ordem em que fecharem).
      if (pilha.length === 0) {
        document.body.style.overflow = overflowOriginal
        if (raiz) raiz.inert = false
      }
      outrosModais.forEach((el) => {
        if (el.isConnected) el.inert = false
      })
      // O foco só volta se o botão de origem ainda existir na página.
      if (origem && origem !== document.body && origem.isConnected) {
        origem.focus({ preventScroll: true })
      }
    }
  }, [])

  function aoPressionarFundo(evento) {
    // Só fecha se o clique COMEÇOU no fundo (arrastar de dentro do painel para fora não fecha).
    if (evento.target === evento.currentTarget && fecharAoClicarFora && !bloqueado) onFechar()
  }

  return createPortal(
    <div className="modal" data-modal ref={sobreposicaoRef} onMouseDown={aoPressionarFundo}>
      <div
        className={`modal__painel modal__painel--${largura}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        aria-describedby={descricaoId}
        tabIndex={-1}
        ref={painelRef}
      >
        <header className="modal__cabecalho">
          <h2 id={tituloId} className="modal__titulo">
            {titulo}
          </h2>
          <button
            type="button"
            className="modal__fechar"
            aria-label="Fechar"
            onClick={onFechar}
            disabled={bloqueado}
          >
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div className="modal__corpo">{children}</div>

        {rodape && <footer className="modal__rodape">{rodape}</footer>}
      </div>
    </div>,
    document.body,
  )
}
