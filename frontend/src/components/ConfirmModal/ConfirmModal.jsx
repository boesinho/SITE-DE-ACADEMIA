import { useId } from 'react'
import Modal from '../Modal/Modal'
import './ConfirmModal.css'

// Confirmação própria do site (nunca usamos confirm()/alert() do navegador).
// Quem usa controla `processando` (pedido em andamento) e `erro` (mensagem se falhar).
// O foco inicial vai para "Cancelar", a opção segura, em ações destrutivas.
export default function ConfirmModal({
  titulo,
  mensagem,
  textoConfirmar = 'Confirmar',
  perigo = false,
  processando = false,
  erro = '',
  onConfirmar,
  onCancelar,
}) {
  const descricaoId = useId()

  return (
    <Modal
      titulo={titulo}
      onFechar={onCancelar}
      largura="sm"
      bloqueado={processando}
      descricaoId={descricaoId}
      rodape={
        <>
          <button
            type="button"
            className="btn btn-ghost"
            data-autofocus
            onClick={onCancelar}
            disabled={processando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className={`btn ${perigo ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirmar}
            disabled={processando}
          >
            {processando ? 'Aguarde…' : textoConfirmar}
          </button>
        </>
      }
    >
      <p id={descricaoId} className="confirm__mensagem">
        {mensagem}
      </p>
      {erro && (
        <p className="confirm__erro" role="alert">
          {erro}
        </p>
      )}
    </Modal>
  )
}
