import { getCurrentLanguage } from "../controller/languageController.js"; // make sure this import exists
import { getCurrentLangStrings } from '../controller/languageController.js';

const DOMElements = {
  categorySelector: document.getElementById("category-selector"),
  criteriaOptions: document.getElementById("criteria-options"),
  regexOutput: document.getElementById("regex-output"),
  jsCodeOutput: document.getElementById("js-code-output"),
  generateButton: document.getElementById("generate-button"),
  copyRegexButton: document.getElementById("copy-regex-button"),
  copyJsButton: document.getElementById("copy-js-button"),
  testInput: document.getElementById("test-input"),
  testButton: document.getElementById("test-button"),
  testResult: document.getElementById("test-result"),
};

/**
 * Renderiza os botões de seleção de categoria na interface.
 * @param {Object} categories - O objeto RegexCategories do Model.
 * @param {string} activeCategory - A categoria atualmente selecionada.
 * @param {Function} handler - A função de callback do Controller para manipular o clique.
 */
export const renderCategories = (categories, activeCategory, handler) => {
  DOMElements.categorySelector.innerHTML = ""; // clear container

  const lang = getCurrentLanguage(); // get current language code (e.g., 'pt' or 'en')

  Object.keys(categories).forEach((key) => {
    const categoryData = categories[key];
    const button = document.createElement("button");

    // Handle multilingual category names
    button.textContent =
      typeof categoryData.name === "object"
        ? categoryData.name[lang] || categoryData.name["en"] || "[Unnamed]"
        : categoryData.name;

    button.dataset.category = key;
    button.classList.add("btn-category");

    if (key === activeCategory) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => handler(key));
    DOMElements.categorySelector.appendChild(button);
  });
};

/**
 * Renderiza as opções de critérios (checkboxes) para a categoria selecionada.
 * @param {Object} criteria - Array de critérios da categoria do Model.
 * @param {Function} handler - A função de callback do Controller para manipular a mudança de estado.
 */
export const renderCriteria = (criteria, handler, currentLang = "pt", placeholderText) => {
  DOMElements.criteriaOptions.innerHTML = ""; // Limpa a área

  if (criteria.length === 0) {
    DOMElements.criteriaOptions.innerHTML = `<p class="placeholder-text">${placeholderText || (currentLang === "pt" ? "Sem critérios de customização para esta categoria." : "No customization criteria for this category.")}</p>`;
    return;
  }

  criteria.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("criteria-item");

    const input = document.createElement("input");
    input.type = item.type;
    input.id = item.id;
    input.name = item.id;
    input.checked = item.default;
    input.addEventListener("change", (e) => handler(item.id, e.target.checked));

    const label = document.createElement("label");
    label.htmlFor = item.id;
    label.textContent = item.labels[currentLang] || item.labels["pt"];

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
  const strings = getCurrentLangStrings();

  const finalRegex = `/${pattern}/${flags}`;
  const jsCode = `const regex = new RegExp('${pattern.replace(
    /\\/g,
    "\\\\"
  )}', '${flags}');\n\n${strings.js_example_comment || "// Exemplo de uso:\n// regex.test('seu texto aqui');"}`;

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
  DOMElements.testButton.addEventListener("click", handler);
};

/**
 * Atualiza o mini visor de teste com o resultado.
 * @param {string} resultText - O texto a ser exibido (matches encontrados).
 * @param {boolean} success - Se a validação foi bem-sucedida.
 */

export const updateTestResult = (resultText, success) => {
  const strings = getCurrentLangStrings();

  // Always use a valid string from the language file
  const message =
    typeof resultText === "string" && resultText.trim() !== ""
      ? resultText
      : strings.awaiting_test || "Aguardando teste...";

  DOMElements.testResult.textContent = message;

  // Clear previous classes
  DOMElements.testResult.classList.remove("result-success", "result-failure");

  if (success !== undefined) {
    DOMElements.testResult.classList.add(success ? "result-success" : "result-failure");
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
  DOMElements.copyRegexButton.addEventListener("click", regexHandler);
  DOMElements.copyJsButton.addEventListener("click", jsHandler);
};

/**
 * Atualiza o label do campo de teste baseado na categoria selecionada.
 * @param {string} categoryKey - A chave da categoria (ex: 'email', 'cpf').
 */
export const updateTestInputLabel = (categoryKey) => {
  const strings = getCurrentLangStrings();

  const labelMap = {
    email: strings.test_label_email,
    cpf: strings.test_label_cpf,
    cep: strings.test_label_cep,
    uuid: strings.test_label_uuid,
  const labels = {
    'email': 'Insira o email:',
    'cpf': 'Insira o CPF:',
    'cep': 'Insira o CEP:',
    'uuid': 'Insira o UUID:',
    'slug': 'Insira o slug (URL-friendly):',

     // Adicione mais categorias aqui conforme necessário
  };

  const label = labelMap[categoryKey] || strings.test_label;
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
export const showToast = (message, type = "info", duration = 3000) => {
  // Cria o container de toasts se não existir
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }

  // Cria o elemento do toast
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  // Adiciona ícone baseado no tipo
  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
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
    toast.classList.add("toast-show");
  }, 10);

  // Remove automaticamente após a duração especificada
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }, duration);
};

export const getDOMElements = () => DOMElements;
