
import { useState } from 'react';
import './cadastro-psicologo.css';

// Separa um texto em uma lista, usando a vírgula como separador.
function paraArray(valor) {
  return valor
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Aplica automaticamente a barra no campo CRP.
function maskCRP(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);

  if (digitos.length > 2) {
    return digitos.slice(0, 2) + '/' + digitos.slice(2);
  }

  return digitos;
}

// Aplica automaticamente parênteses e hífen no telefone.
function maskTelefone(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);

  if (digitos.length > 7) {
    return digitos.replace(
      /^(\d{2})(\d{5})(\d{0,4})/,
      '($1) $2-$3'
    );
  } else if (digitos.length > 2) {
    return digitos.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
  } else if (digitos.length > 0) {
    return digitos.replace(/^(\d{0,2})/, '($1');
  }

  return digitos;
}

// Traduz alguns erros retornados pela API para mensagens mais claras.
function traduzirErro(status, dados) {
  if (status === 404) {
    return 'Registro não encontrado';
  }

  if (
    dados?.erro &&
    dados.erro.toLowerCase().includes('validation')
  ) {
    return 'Verifique os dados informados: pode haver um campo inválido ou já cadastrado.';
  }

  return 'Ocorreu um erro inesperado ao processar seu cadastro. Tente novamente em alguns instantes.';
}

function CadastroPsicologo() {
  // Guarda os valores preenchidos nos campos do formulário.
  
  const [formulario, setFormulario] = useState({
    apiUrl: 'http://localhost:3000/psicologo',
    nome: '',
    email: '',
    senha: '',
    crp: '',
    contato: '',
    genero: '',
    nascimento: '',
    especialidades: '',
    diploma: '',
    descricao: ''
  });
  
  // Guarda a mensagem de resultado e seu tipo: sucesso ou erro.
  const [resultado, setResultado] = useState(null);

  // Informa se o formulário está sendo enviado.
  const [enviando, setEnviando] = useState(false);

  // Atualiza somente o campo que foi alterado.
  function atualizarCampo(e) {
    const { id, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [id]: value
    }));
  }

  // Atualiza o CRP aplicando sua máscara.
  function atualizarCRP(e) {
    setFormulario((anterior) => ({
      ...anterior,
      crp: maskCRP(e.target.value)
    }));
  }

  // Atualiza o telefone aplicando sua máscara.
  function atualizarTelefone(e) {
    setFormulario((anterior) => ({
      ...anterior,
      contato: maskTelefone(e.target.value)
    }));
  }

  // Executa quando o usuário envia o formulário.
  async function enviarFormulario(e) {
    e.preventDefault();

    setEnviando(true);
    setResultado(null);

    // Monta os dados no formato esperado pelo backend.
    const payload = {
      nome_psicologo: formulario.nome.trim(),
      email_usuario: formulario.email.trim(),
      senha_usuario: formulario.senha,
      crp_psicologo: formulario.crp.trim(),
      contato_psicologo: formulario.contato.replace(/\D/g, ''),
      genero_psicologo: formulario.genero,
      data_nascimento_psicologo: formulario.nascimento,
      especialidade_psicologo: paraArray(formulario.especialidades),
      diploma_psicologo: paraArray(formulario.diploma),
      descricao_psicologo: formulario.descricao.trim() || null
    };

    try {
      // Envia os dados para a API.
      const resp = await fetch(formulario.apiUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // Tenta interpretar a resposta enviada pelo backend.
      let dados = {};

      try {
        dados = await resp.json();
      } catch {
        dados = {};
      }

      // Se a API responder com sucesso...
    if (resp.ok) {
      setResultado({
        tipo: 'ok',
        mensagem: 'Psicólogo cadastrado com sucesso!'
      });

      setFormulario((anterior) => ({
        ...anterior,
        nome: '',
        email: '',
        senha: '',
        crp: '',
        contato: '',
        genero: '',
        nascimento: '',
        especialidades: '',
        diploma: '',
        descricao: ''
      }));
    } else {
      setResultado({
        tipo: 'erro',
        mensagem: traduzirErro(resp.status, dados)
      });
    }

    } catch {
      // Se não conseguir conectar com o servidor...
      setResultado({
        tipo: 'erro',
        mensagem:
          'Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente em instantes.'
      });
    } finally {
      // Habilita o botão novamente, mesmo se houver erro.
      setEnviando(false);
    }
  }

  return (
    <div className="card">
      <h1>Cadastro de Psicólogo</h1>

      <p className="subtitle">
        Formulário de teste — envia POST para a rota /psicologo da API PsyCool.
      </p>

      <div className="config">
        <label htmlFor="apiUrl">URL da API</label>
        <input
          type="text"
          id="apiUrl"
          value={formulario.apiUrl}
          onChange={atualizarCampo}
        />
      </div>

      <form id="form" onSubmit={enviarFormulario}>
        <label htmlFor="nome">Nome</label>
        <input
          type="text"
          id="nome"
          value={formulario.nome}
          onChange={atualizarCampo}
          required
          minLength={4}
          placeholder="Ex: Maria Oliveira"
        />
        
        <label htmlFor="email">E-mail</label>
        <input
          type="email"
          id="email"
          value={formulario.email}
          onChange={atualizarCampo}
          required
          placeholder="Ex: psicologo@email.com"
        />

        <label htmlFor="senha">Senha</label>
        <input
          type="password"
          id="senha"
          value={formulario.senha}
          onChange={atualizarCampo}
          required
          minLength={8}
          placeholder="Digite uma senha"
        />

        <label htmlFor="crp">CRP</label>
        <input
          type="text"
          id="crp"
          value={formulario.crp}
          onChange={atualizarCRP}
          required
          placeholder="Ex: 08/123456"
          pattern="^\d{2}/\d{5,6}$"
        />
        <div className="hint">
          Formato: NN/NNNNN ou NN/NNNNNN
        </div>

        <label htmlFor="contato">Contato (telefone)</label>
        <input
          type="text"
          id="contato"
          value={formulario.contato}
          onChange={atualizarTelefone}
          required
          placeholder="Ex: (41) 99999-8888"
          pattern="^\(\d{2}\) \d{5}-\d{4}$"
          maxLength={16}
        />
        <div className="hint">
          Preencha o DDD e o número de telefone.
        </div>

        <label htmlFor="genero">Gênero</label>
        <select
          id="genero"
          value={formulario.genero}
          onChange={atualizarCampo}
          required
        >
          <option value="">Selecione...</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
          <option value="OUTRO">Outro</option>
          <option value="PREFIRO NÃO INFORMAR">
            Prefiro não informar
          </option>
        </select>

        <label htmlFor="nascimento">Data de nascimento</label>
        <input
          type="date"
          id="nascimento"
          value={formulario.nascimento}
          onChange={atualizarCampo}
          required
        />
        <div className="hint">
          Psicólogo precisa ter no mínimo 21 anos (validado pelo servidor)
        </div>

        <label htmlFor="especialidades">Especialidades</label>
        <input
          type="text"
          id="especialidades"
          value={formulario.especialidades}
          onChange={atualizarCampo}
          required
          placeholder="Ex: Terapia Cognitivo-Comportamental, Ansiedade"
        />
        <div className="hint">
          Separe por vírgula — pelo menos uma é obrigatória
        </div>

        <label htmlFor="diploma">
          Diploma (texto simples por enquanto)
        </label>
        <input
          type="text"
          id="diploma"
          value={formulario.diploma}
          onChange={atualizarCampo}
          placeholder="Ex: Bacharel em Psicologia - UFPR"
        />
        <div className="hint">
          Opcional. Também pode separar por vírgula se houver mais de um.
        </div>

        <label htmlFor="descricao">Descrição (opcional)</label>
        <textarea
          id="descricao"
          rows={3}
          value={formulario.descricao}
          onChange={atualizarCampo}
          placeholder="Breve descrição do profissional"
        />

        <button type="submit" id="btnEnviar" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Cadastrar'}
        </button>
      </form>

      {resultado && (
        <div id="resultado" className={resultado.tipo}>
          <pre>{resultado.mensagem}</pre>
        </div>
      )}
    </div>
  );
}

export default CadastroPsicologo;