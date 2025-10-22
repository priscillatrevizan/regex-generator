const DOMElements = {
  categorySelector: document.getElementById('category-selector'),
  criteriaOptions: document.getElementById('criteria-options'),
  regexOutput: document.getElementById('regex-output'),
  jsCodeOutput: document.getElementById('js-code-output'),
  generateButton: document.getElementById('generate-button'),
  copyRegexButton: document.getElementById('copy-regex-button'),
  copyJsButton: document.getElementById('copy-js-button'),
  testInput: document.getElementById('test-input'),
  testButton: document.getElementById('test-button'),
  testResult: document.getElementById('test-result'),
};


/**
 * Renderiza os botões de seleção de categoria na interface.
 * @param {Object} categories - O objeto RegexCategories do Model.
 * @param {string} activeCategory - A categoria atualmente selecionada.
 * @param {Function} handler - A função de callback do Controller para manipular o clique.
 */
export const renderCategories = (categories, activeCategory, handler) => {
  DOMElements.categorySelector.innerHTML = ''; // Limpa a área

  Object.keys(categories).forEach(key => {
    const categoryData = categories[key];
    const button = document.createElement('button');
    button.textContent = categoryData.name;
    button.dataset.category = key;
    button.classList.add('btn-category'); // Classe CSS para estilo

    if (key === activeCategory) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => handler(key));
    DOMElements.categorySelector.appendChild(button);
  });
};


/**
 * Renderiza as opções de critérios (checkboxes) para a categoria selecionada.
 * @param {Object} criteria - Array de critérios da categoria do Model.
 * @param {Function} handler - A função de callback do Controller para manipular a mudança de estado.
 */
export const renderCriteria = (criteria, handler) => {
  DOMElements.criteriaOptions.innerHTML = ''; // Limpa a área

  if (criteria.length === 0) {
    DOMElements.criteriaOptions.innerHTML = '<p class="placeholder-text">Sem critérios de customização para esta categoria.</p>';
    return;
  }

  criteria.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('criteria-item');

    const input = document.createElement('input');
    input.type = item.type;
    input.id = item.id;
    input.name = item.id;
    input.checked = item.default; // Define o estado padrão
    input.addEventListener('change', (e) => handler(item.id, e.target.checked));

    const label = document.createElement('label');
    label.htmlFor = item.id;
    label.textContent = item.label;

    div.appendChild(input);
    div.appendChild(label);
    DOMElements.criteriaOptions.appendChild(div);
  });
};


/**
 * Atualiza os campos de saída com a Regex gerada.
 * @param {string} pattern - O padrão Regex (string).
 * @param {string} flags - As flags da Regex (string).
 */
export const updateOutput = (pattern, flags) => {
  const finalRegex = `/${pattern}/${flags}`;
  const jsCode = `const regex = new RegExp('${pattern.replace(/\\/g, '\\\\')}', '${flags}');\n\n// Exemplo de uso:\n// regex.test('seu texto aqui');`;

  DOMElements.regexOutput.value = finalRegex;
  DOMElements.jsCodeOutput.value = jsCode;
};

/**
 * Habilita ou desabilita o botão de teste.
 */
export const enableTestButton = (enabled) => {
  DOMElements.testButton.disabled = !enabled;
};

/**
 * Configura o Listener do botão de teste.
 */
export const setupTestHandler = (handler) => {
  DOMElements.testButton.addEventListener('click', handler);
};

/**
 * Atualiza o mini visor de teste com o resultado.
 * @param {string} resultText - O texto a ser exibido (matches encontrados).
 * @param {boolean} success - Se a validação foi bem-sucedida.
 */
export const updateTestResult = (resultText, success) => {
  DOMElements.testResult.textContent = resultText;

  // Limpa e aplica as classes de estilo
  DOMElements.testResult.classList.remove('result-success', 'result-failure');

  if (success !== undefined) {
    if (success) {
      DOMElements.testResult.classList.add('result-success');
    } else {
      DOMElements.testResult.classList.add('result-failure');
    }
  } else {
    // Reset para o estado inicial
    DOMElements.testResult.textContent = 'Aguardando teste...';
  }
};

/**
 * Funções utilitárias de UI
 */
export const enableGenerateButton = (enabled) => {
  DOMElements.generateButton.disabled = !enabled;
};

export const enableCopyButtons = (enabled) => {
  DOMElements.copyRegexButton.disabled = !enabled;
  DOMElements.copyJsButton.disabled = !enabled;
};

export const setupCopyHandlers = (regexHandler, jsHandler) => {
  DOMElements.copyRegexButton.addEventListener('click', regexHandler);
  DOMElements.copyJsButton.addEventListener('click', jsHandler);
};



/**
 * Atualiza o label do campo de teste baseado na categoria selecionada.
 * @param {string} categoryKey - A chave da categoria (ex: 'email', 'cpf').
 */
export const updateTestInputLabel = (categoryKey) => {
    const labels = {
        'email': 'Insira o email:',
        'cpf': 'Insira o CPF:',
        'cep': 'Insira o CEP:',
        'uuid': 'Insira o UUID:',
        'phonebr': 'Insira o telefone:',
         // Adicione mais categorias aqui conforme necessário
    };

    const label = labels[categoryKey] || 'Conteúdo a Validar (Texto de Teste):';
    const labelElement = document.querySelector('label[for="test-input"]');
    if (labelElement) {
        labelElement.textContent = label;
    }
};

/**
 * Sistema de Toast para notificações elegantes
 */

/**
 * Cria e exibe um toast
 * @param {string} message - A mensagem a ser exibida
 * @param {string} type - O tipo do toast: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duração em milissegundos (padrão: 3000)
 */
export const showToast = (message, type = 'info', duration = 3000) => {
  // Cria o container de toasts se não existir
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  // Cria o elemento do toast
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Adiciona ícone baseado no tipo
  const icons = {
    'success': '✅',
    'error': '❌',
    'info': 'ℹ️',
    'warning': '⚠️'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">×</button>
  `;

  // Adiciona o toast ao container
  toastContainer.appendChild(toast);

  // Anima a entrada
  setTimeout(() => {
    toast.classList.add('toast-show');
  }, 10);

  // Remove automaticamente após a duração especificada
  setTimeout(() => {
    toast.classList.add('toast-hide');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
};

export const getDOMElements = () => DOMElements;


