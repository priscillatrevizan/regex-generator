/**
 * Current language strings loaded from JSON
 */
let currentLangStrings = {};

/**
 * Load language JSON and update the DOM
 */
export async function loadLanguage(lang) {
  try {
    const response = await fetch(`./src/model/lang/${lang}.json`);
    const strings = await response.json();
    currentLangStrings = strings;

    // --- Header ---
    const headerTitle = document.getElementById("header-title");
    const headerSubtitle = document.getElementById("header-subtitle");
    if (headerTitle) headerTitle.textContent = strings.title || "";
    if (headerSubtitle) headerSubtitle.textContent = strings.subtitle || "";

    // --- Steps ---
    const stepMap = {
      "step-category": "category_step",
      "step-criteria": "criteria_step",
      "step-generate": "generate_step",
      "step-result": "result_step",
      "step-test": "test_step",
    };
    Object.entries(stepMap).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = strings[key] || "";
    });

    // --- Labels ---
    const labelMap = {
      "label-regex": "regex_label",
      "label-js": "js_label",
      "label-test": "test_label",
      "label-language": "language_label",
      "label-test-result": "result_label",
      "label-theme": "theme_label",
    };
    Object.entries(labelMap).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = strings[key] || "";
    });

    // --- Buttons ---
    const buttonMap = {
      "generate-button": "generate_button",
      "copy-regex-button": "copy_regex",
      "copy-js-button": "copy_js",
      "test-button": "test_button",
    };
    Object.entries(buttonMap).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = strings[key] || "";
    });

    // --- Placeholders ---
    const regexOutput = document.getElementById("regex-output");
    const jsCodeOutput = document.getElementById("js-code-output");
    const testInput = document.getElementById("test-input");
    const criteriaPlaceholder = document.getElementById("criteria-placeholder");
    const testResult = document.getElementById("test-result");

    if (regexOutput) regexOutput.placeholder = strings.placeholder_regex || "";
    if (jsCodeOutput) jsCodeOutput.placeholder = strings.placeholder_js || "";
    if (testInput) testInput.placeholder = strings.placeholder_test_input || "";
    if (criteriaPlaceholder) criteriaPlaceholder.textContent = strings.criteria_placeholder || "";
    if (testResult) testResult.textContent = strings.awaiting_test || "Aguardando teste...";

    // --- Footer ---
    const footer = document.getElementById("footer-text");
    if (footer) footer.innerHTML = strings.footer_text || "";

    console.log(`Language set to: ${lang}`);
  } catch (err) {
    console.error("Failed to load language file:", err);
  }
}

/**
 * Get currently loaded language strings
 */
export function getCurrentLangStrings() {
  return currentLangStrings;
}

/**
 * Initialize the language selector and listener
 */
export function setupLanguageToggle() {
  const select = document.getElementById("language-select");
  if (!select) return;

  const savedLang = localStorage.getItem("app-lang") || "pt";
  select.value = savedLang;

  // Load initial language
  loadLanguage(savedLang);

  // Listen for changes
  select.addEventListener("change", (e) => {
    const lang = e.target.value;
    localStorage.setItem("app-lang", lang);
    loadLanguage(lang);
  });
}

/**
 * Get current language code
 */
export const getCurrentLanguage = () => {
  return localStorage.getItem("app-lang") || "pt";
};
