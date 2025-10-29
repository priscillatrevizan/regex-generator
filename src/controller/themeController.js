// src/controller/themeController.js
export function setupThemeToggle() {
  const themeSwitch = document.getElementById("theme-switch");
  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-label");
  const html = document.documentElement;

  if (!themeSwitch || !themeIcon || !themeLabel) {
    console.error("Theme toggle elements not found");
    return;
  }

  // --- Load saved theme from localStorage ---
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") applyDarkTheme();
  else if (savedTheme === "light") applyLightTheme();
  else detectSystemPreference(); // default to system theme

  // --- Event Listener ---
  themeSwitch.addEventListener("click", () => {
    if (html.classList.contains("dark")) {
      applyLightTheme();
      localStorage.setItem("theme", "light");
    } else {
      applyDarkTheme();
      localStorage.setItem("theme", "dark");
    }
  });

  // --- Functions ---
  function applyDarkTheme() {
    html.classList.add("dark");
    themeIcon.textContent = "☀️";
    themeLabel.textContent = "Light Mode";
  }

  function applyLightTheme() {
    html.classList.remove("dark");
    themeIcon.textContent = "🌙";
    themeLabel.textContent = "Dark Mode";
  }

  function detectSystemPreference() {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    prefersDark ? applyDarkTheme() : applyLightTheme();
  }
}
