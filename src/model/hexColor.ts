// Função para gerar regex de cor hexadecimal
// Opções: { requireHash: boolean }
export function generateHexColorRegex(options: { requireHash?: boolean } = {}) {
  const { requireHash = false } = options;
  // 3 ou 6 dígitos hexadecimais
  const hex = "(?:[a-fA-F0-9]{3}|[a-fA-F0-9]{6})";
  let pattern = requireHash ? `^#${hex}$` : `^#?${hex}$`;
  return new RegExp(pattern);
}
