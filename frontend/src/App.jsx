/* Importa a tela de cadastro de psicólogo. Assim, podemos utilizar essa tela dentro do App. */

import CadastroPsicologo from './pages/CadastroPsicologo';

// Cria o componente principal da aplicação React.
function App() {
    // O return define o que será exibido na tela.
    return (
        // Exibe o componente de cadastro de psicólogo.
        <CadastroPsicologo />
    );
}

// Exporta o componente App para que outros arquivos possam importá-lo, como a estrutura principal do React.
export default App;