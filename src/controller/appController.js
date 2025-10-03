// src/controller/appController.js

import { RegexCategories } from '../model/regexPatterns.js';
import * as Renderer from '../view/domRenderer.js';

// ESTADO DA APLICAÇÃO (Controller)
let state = {
  selectedCategory: null,
  criteriaOptions: {}, // Ex: { allowSubdomains: true, allowOptionalSymbols: false }
};

/**
 * Manipulador de evento: Chamado quando uma nova categoria é selecionada.
 * @param {string} categoryKey - A chave da categoria (ex: 'email').
 */
const handleCategorySelect = (categoryKey) => {
  const category = RegexCategories[categoryKey];

  if (!category) return;

  state.selectedCategory = categoryKey;
  state.criteriaOptions = {}; // Resetar opções ao mudar de categoria

  // 1. Inicializa o estado das opções com os valores padrão do Model
  category.criteria.forEach(item => {
    state.criteriaOptions[item.id] = item.default;
  });

  // 2. Renderiza novamente a lista de categorias (para destacar a ativa)
  Renderer.renderCategories(RegexCategories, categoryKey, handleCategorySelect);

  // 3. Renderiza os critérios da categoria (usa a função do Model para injetar no DOM)
  Renderer.renderCriteria(category.criteria, handleCriteriaChange);

  // 4. Habilita o botão de geração e desabilita os botões subsequentes
  Renderer.enableGenerateButton(true);
  Renderer.enableCopyButtons(false);
  Renderer.enableTestButton(false);

  // 5. Limpa a saída
  Renderer.updateOutput('', '');

  // 6. Atualiza o label do campo de teste
  Renderer.updateTestInputLabel(categoryKey);

  // 7. Limpa o campo de teste e resultado quando muda de categoria
  Renderer.getDOMElements().testInput.value = '';
  Renderer.updateTestResult('Aguardando teste...', undefined);

  // 8. Mostra toast informativo sobre a categoria selecionada
  const categoryName = RegexCategories[categoryKey].name;
  Renderer.showToast(`Categoria "${categoryName}" selecionada. Configure os critérios e gere sua regex!`, 'info', 2500);
};


/**
 * Manipulador de evento: Chamado quando um critério (checkbox/radio) muda.
 * @param {string} id - O ID do critério (ex: 'allowSubdomains').
 * @param {boolean} value - O novo valor (true/false).
 */
const handleCriteriaChange = (id, value) => {
  state.criteriaOptions[id] = value;
  // Opcional: Gerar automaticamente ao mudar o critério, se for desejado.
  // generateRegex(); 
};


/**
 * A função principal: Chama o Model e atualiza a View.
 */
const generateRegex = () => {
  const key = state.selectedCategory;
  const category = RegexCategories[key];

  if (!category) return;

  // 1. CHAMADA AO MODEL: Passa as opções de estado para a função de geração pura.
  const { pattern, flags } = category.generator(state.criteriaOptions);

  // 2. ATUALIZAÇÃO DA VIEW: Exibe o resultado.
  Renderer.updateOutput(pattern, flags);

  // 3. Habilita os botões de cópia após a geração
  Renderer.enableCopyButtons(true);

  // 4. Mantém o botão de teste desabilitado até que a regex seja copiada ou o usuário clique em testar
  Renderer.enableTestButton(true);

  // 5. Mostra toast de sucesso
  Renderer.showToast('Regex gerada com sucesso! Agora você pode copiá-la ou testá-la.', 'success');
};

/**
 * Manipulador de evento: Copia o conteúdo da área de Regex.
 */
const copyRegex = () => {
  const outputElement = Renderer.getDOMElements().regexOutput;
  if (outputElement.value) {
    navigator.clipboard.writeText(outputElement.value)
      .then(() => {
        Renderer.showToast('Regex copiada para a área de transferência!', 'success');
      })
      .catch(err => {
        console.error('Falha ao copiar:', err);
        Renderer.showToast('Erro ao copiar regex. Tente novamente.', 'error');
      });
  }
};

/**
 * Manipulador de evento: Copia o código JavaScript.
 */
const copyJsCode = () => {
  const jsOutputElement = Renderer.getDOMElements().jsCodeOutput;
  if (jsOutputElement.value) {
    navigator.clipboard.writeText(jsOutputElement.value)
      .then(() => {
        Renderer.showToast('Código JavaScript copiado para a área de transferência!', 'success');
      })
      .catch(err => {
        console.error('Falha ao copiar:', err);
        Renderer.showToast('Erro ao copiar código. Tente novamente.', 'error');
      });
  }
};


/**
 * Inicialização da aplicação (chamado ao carregar o script no index.html).
 */
const initialize = () => {
  // 1. Renderiza as categorias iniciais (não há categoria ativa)
  Renderer.renderCategories(RegexCategories, state.selectedCategory, handleCategorySelect);

  // 2. Configura o Listener do botão de Geração
  Renderer.getDOMElements().generateButton.addEventListener('click', generateRegex);

  // 3. Configura o Listener do botão de Teste
  Renderer.setupTestHandler(runTest);

  // 4. Configura os Listeners dos botões de Copiar
  Renderer.setupCopyHandlers(copyRegex, copyJsCode);

  // 5. Inicializa todos os botões como desabilitados (exceto seleção de categoria)
  Renderer.enableGenerateButton(false);
  Renderer.enableCopyButtons(false);
  Renderer.enableTestButton(false);

  console.log("Gerador de Regex inicializado. Pronto para o Hacktoberfest!");
  
  // Toast de boas-vindas
  setTimeout(() => {
    Renderer.showToast('Bem-vindo ao Gerador de Regex! Selecione uma categoria para começar.', 'info', 4000);
  }, 500);
};

// Inicia a aplicação quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', initialize);


/**
 * Executa o teste de Regex e atualiza a View de resultado.
 */
const runTest = () => {
  const outputRegex = Renderer.getDOMElements().regexOutput.value;
  const testText = Renderer.getDOMElements().testInput.value;

  if (!outputRegex || !testText) {
    Renderer.updateTestResult('Insira um padrão de Regex e um texto para validar.', false);
    return;
  }

  try {
    // Extrai o padrão e as flags do formato /padrao/flags
    const match = outputRegex.match(/^\/(.+)\/([igm]{0,3})$/);
    if (!match) {
      Renderer.updateTestResult('Erro: Formato de Regex inválido.', false);
      return;
    }

    const pattern = match[1];
    const flags = match[2];

    // Cria o objeto RegExp
    const regex = new RegExp(pattern, flags);

    // Executa o teste
    const isMatch = regex.test(testText);
    let resultMessage = `A validação ${isMatch ? 'PASSOU' : 'FALHOU'}.`;

    if (isMatch) {
      // Se tiver a flag 'g' (global), extraímos todos os matches
      if (flags.includes('g')) {
        const matches = [...testText.matchAll(regex)].map(m => m[0]);
        resultMessage += `\n\nMatches encontrados:\n${matches.join('\n')}`;
      } else {
        // Sem a flag 'g', apenas testamos a presença (ou o primeiro match)
        const firstMatch = testText.match(regex);
        if (firstMatch) {
          resultMessage += `\n\nPrimeiro Match: ${firstMatch[0]}`;
        }
      }
    }

    // Atualiza o mini visor de teste
    Renderer.updateTestResult(resultMessage, isMatch);

    // Adiciona uma dica sobre o próximo passo
    if (isMatch) {
      resultMessage += '\n\n✅ Teste concluído! Você pode testar outros valores ou gerar uma nova regex.';
      Renderer.showToast('Validação bem-sucedida! O texto corresponde ao padrão.', 'success');
    } else {
      resultMessage += '\n\n❌ Teste falhou. Verifique se o texto está no formato esperado ou ajuste os critérios.';
      Renderer.showToast('Validação falhou. Verifique o formato do texto.', 'warning');
    }
    
    Renderer.updateTestResult(resultMessage, isMatch);

  } catch (e) {
    Renderer.updateTestResult(`Erro de Regex: ${e.message}`, false);
    Renderer.showToast(`Erro na regex: ${e.message}`, 'error');
  }
};