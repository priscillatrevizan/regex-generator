import { RegexCategories } from '../model/regexPatterns.js';
import * as Renderer from '../view/domRenderer.js';
import { setupLanguageToggle } from './languageController.js';
import { getCurrentLanguage, getCurrentLangStrings } from './languageController.js';

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
  const strings = getCurrentLangStrings();
  const category = RegexCategories[categoryKey];
  if (!category) return;

  state.selectedCategory = categoryKey;
  state.criteriaOptions = {};

  // Inicializa o estado das opções com os valores padrão do Model
  category.criteria.forEach(item => {
    state.criteriaOptions[item.id] = item.default;
  });

  // Renderiza a lista de categorias
  Renderer.renderCategories(RegexCategories, categoryKey, handleCategorySelect);

  // Renderiza os critérios da categoria
  Renderer.renderCriteria(category.criteria, handleCriteriaChange, getCurrentLanguage(), strings.criteria_placeholder);

  // Habilita e desabilita botões
  Renderer.enableGenerateButton(true);
  Renderer.enableCopyButtons(false);
  Renderer.enableTestButton(false);

  // Limpa saída e campo de teste
  Renderer.updateOutput('', '');
  Renderer.getDOMElements().testInput.value = '';
  Renderer.updateTestResult(strings.test_result, undefined);

  // Atualiza label do campo de teste
  Renderer.updateTestInputLabel(categoryKey);

  // Toast de categoria selecionada
// Get current language code
const currentLang = getCurrentLanguage();

// Extract the category name string based on current language, fallback to Portuguese
const categoryName = RegexCategories[categoryKey].name[currentLang] || RegexCategories[categoryKey].name.pt;

// Show the toast with the correct string
Renderer.showToast(
  strings.category_selected?.replace('{category}', categoryName) ||
  `Categoria "${categoryName}" selecionada. Configure os critérios e gere sua regex!`,
  'info',
  2500
);

};

/**
 * Manipulador de evento: Chamado quando um critério muda.
 */
const handleCriteriaChange = (id, value) => {
  state.criteriaOptions[id] = value;
};

/**
 * Geração de Regex.
 */
const generateRegex = () => {
  const strings = getCurrentLangStrings();
  const key = state.selectedCategory;
  const category = RegexCategories[key];
  if (!category) return;

  const { pattern, flags } = category.generator(state.criteriaOptions);

  Renderer.updateOutput(pattern, flags);
  Renderer.enableCopyButtons(true);
  Renderer.enableTestButton(true);

  Renderer.showToast(strings.regex_generated_success, 'success');
};

/**
 * Copiar Regex para clipboard.
 */
const copyRegex = () => {
  const strings = getCurrentLangStrings();
  const outputElement = Renderer.getDOMElements().regexOutput;

  if (outputElement.value) {
    navigator.clipboard.writeText(outputElement.value)
      .then(() => Renderer.showToast(strings.regex_copy_success, 'success'))
      .catch(() => Renderer.showToast(strings.regex_copy_error, 'error'));
  }
};

/**
 * Copiar JS para clipboard.
 */
const copyJsCode = () => {
  const strings = getCurrentLangStrings();
  const jsOutputElement = Renderer.getDOMElements().jsCodeOutput;

  if (jsOutputElement.value) {
    navigator.clipboard.writeText(jsOutputElement.value)
      .then(() => Renderer.showToast(strings.js_copy_success, 'success'))
      .catch(() => Renderer.showToast(strings.js_copy_error, 'error'));
  }
};

/**
 * Inicialização da aplicação.
 */
const initialize = () => {
  Renderer.renderCategories(RegexCategories, state.selectedCategory, handleCategorySelect);

  Renderer.getDOMElements().generateButton.addEventListener('click', generateRegex);
  Renderer.setupTestHandler(runTest);
  Renderer.setupCopyHandlers(copyRegex, copyJsCode);

  Renderer.enableGenerateButton(false);
  Renderer.enableCopyButtons(false);
  Renderer.enableTestButton(false);

  setupLanguageToggle();

  const strings = getCurrentLangStrings();
console.log(strings.app_initialized || "Regex Generator initialized. Ready for Hacktoberfest!");


  // Toast de boas-vindas
  setTimeout(() => {
    const strings = getCurrentLangStrings();
    Renderer.showToast(strings.welcome_message, 'info', 4000);
  }, 500);
};

document.addEventListener('DOMContentLoaded', initialize);

/**
 * Executa o teste de Regex.
 */
const runTest = () => {
  const strings = getCurrentLangStrings();
  const outputRegex = Renderer.getDOMElements().regexOutput.value;
  const testText = Renderer.getDOMElements().testInput.value;

  if (!outputRegex || !testText) {
    Renderer.updateTestResult(strings.test_missing_input, false);
    return;
  }

  try {
    const match = outputRegex.match(/^\/(.+)\/([igm]{0,3})$/);
    if (!match) {
      Renderer.updateTestResult(strings.test_invalid_format, false);
      return;
    }

    const pattern = match[1];
    const flags = match[2];
    const regex = new RegExp(pattern, flags);
    const isMatch = regex.test(testText);

    let resultMessage = isMatch ? strings.validation_passed : strings.validation_failed;

    if (isMatch) {
      if (flags.includes('g')) {
        const matches = [...testText.matchAll(regex)].map(m => m[0]);
        resultMessage += `\n\n${strings.matches_found}:\n${matches.join('\n')}`;
      } else {
        const firstMatch = testText.match(regex);
        if (firstMatch) resultMessage += `\n\n${strings.first_match}: ${firstMatch[0]}`;
      }
    }

    Renderer.updateTestResult(resultMessage, isMatch);

    if (isMatch) {
      Renderer.showToast(strings.test_success, 'success');
    } else {
      Renderer.showToast(strings.test_failure, 'warning');
    }

  } catch (e) {
    Renderer.updateTestResult(`${strings.test_error}: ${e.message}`, false);
    Renderer.showToast(`${strings.test_error}: ${e.message}`, 'error');
  }
};
