// src/model/regexPatterns.js

/**
 * MÓDULO MODEL: Contém toda a lógica Pura para gerar as expressões regulares.
 * Novas contribuições devem seguir este padrão, adicionando novas funções de geração.
 * * As funções recebem um objeto de opções (critérios) e retornam um objeto
 * contendo o padrão (string) e as flags (string).
 */

// --- CATEGORIA 1: E-MAIL ---

/**
 * Gera um padrão de Regex para validação de e-mail.
 * @param {Object} options - Critérios de customização (ex: { allowSubdomains: true })
 * @returns {{pattern: string, flags: string}}
 */
export const generateEmailRegex = (options = {}) => {
  // Padrão de e-mail simplificado (seguro para a maioria dos casos web)
  let pattern = "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}";
  let flags = "i"; // Case Insensitive

  // Exemplo de como a lógica do Model reage aos critérios:
  if (options.allowSubdomains) {
    // Se a opção de subdomínio for marcada, relaxamos o domínio:
    pattern =
      "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}(\\.[a-zA-Z]{2})?";
  }

  // Adicionamos as âncoras para garantir que case a string INTEIRA, essencial para validação.
  pattern = `^${pattern}$`;

  return { pattern, flags };
};

// --- CATEGORIA 2: CPF ---

/**
 * Gera um padrão de Regex para validação de formato de CPF (sem validar o algoritmo de dígitos).
 * @param {Object} options - Critérios de customização (ex: { allowOptionalSymbols: true })
 * @returns {{pattern: string, flags: string}}
 */
export const generateCPFRegex = (options = {}) => {
  let pattern = "";
  let flags = "";

  if (options.allowOptionalSymbols) {
    // Permite o formato 000.000.000-00 OU 00000000000 (pontos e hífen opcionais)
    pattern = "\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}";
  } else {
    // Exige o formato estrito 000.000.000-00
    pattern = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}";
  }

  // Adicionamos as âncoras
  pattern = `^${pattern}$`;

  return { pattern, flags };
};

// --- CATEGORIA 3: CEP ---

/**
 * Gera um padrão de Regex para validação de formato de CEP.
 * @param {Object} options - Critérios de customização (ex: { allowOptionalSymbols: true })
 * @returns {{pattern: string, flags: string}}
 */
export const generateCEPRegex = (options = {}) => {
  let pattern = "";
  let flags = "";

  if (options.allowOptionalSymbols) {
    // Permite o formato 00000-000 OU 00000000 (pontos e hífen opcionais)
    pattern = "\\d{5}-?\\d{3}";
  } else {
    // Exige o formato estrito 00000-000
    pattern = "\\d{5}-\\d{3}";
  }

  // Adicionamos as âncoras
  pattern = `^${pattern}$`;

  return { pattern, flags };
};

// --- CATEGORIA 4: UUID v4 ---

/**
 * Gera um padrão de Regex para validação de UUID v4.
 * @returns {{pattern: string, flags: string}}
 */
export const generateUUIDRegex = () => {
  let pattern = "";
  let flags = "i"; // Case insensitive para aceitar A-F e a-f

  // UUID v4 formato: 8-4-4-4-12 caracteres hexadecimais
  // Exemplo: 550e8400-e29b-41d4-a716-446655440000
  const uuidPattern =
    "[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

  pattern = uuidPattern;

  // Adicionamos as âncoras
  pattern = `^${pattern}$`;

  return { pattern, flags };
};

// --- CATEGORIA 5: Slug ---
/**
 * Gera um padrão de Regex para validação de Slug (URL-friendly string).
 * @param {Object} options - Critérios de customização (ex: { allowUppercase: false })
 * @returns {{pattern: string, flags: string}}
 */
export const generateSlugRegex = (options = {}) => {
  const { allowUppercase = false } = options;
  let pattern = '';

  if (allowUppercase) {
    // Permite letras maiúsculas, minúsculas, números e hífens únicos
    pattern = '^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$';
  } else {
    // Apenas letras minúsculas, números e hífens únicos
    pattern = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
  }

  const flags = ''; // Não há necessidade de flags adicionais
  return { pattern, flags };
};

// --- CATEGORIA 6: IPv4 ---

  /**
   * Gera um padrão de Regex para validação de endereços IPv4.
   * @param {Object} options - Critérios de customização (ex: { allowCIDR: true })
   * @returns {{pattern: string, flags: string}}
   */
  export const generateIPv4Regex = (options = {}) => {
    // Octet: 0-255 => (25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)
    const octet = '(?:25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]?\\d)';

    // Quatro octets separados por ponto
    let pattern = `${octet}\\.${octet}\\.${octet}\\.${octet}`;

    // Se permitido, aceitar sufixo CIDR (ex: /24) com prefixo 0-32
    if (options.allowCIDR) {
      pattern = `${pattern}(?:\/(?:[0-9]|[12][0-9]|3[0-2]))?`;
    }

    // Adicionamos as âncoras para validação completa
    pattern = `^${pattern}$`;

    const flags = '';

    return { pattern, flags };
  };

// --- ESTRUTURA PARA NOVAS CONTRIBUIÇÕES ---

/**
 * Dicionário principal que mapeia o nome da categoria (usado na View) para
 * a função de geração (no Model). Contribuidores só precisam adicionar
 * suas novas funções aqui.
 */
export const RegexCategories = {
  email: {
    name: { pt: "E-mail", en: "Email" },
    generator: generateEmailRegex,
    criteria: [
      {
        id: "allowSubdomains",
        labels: { pt: 'Permitir subdomínios (.ex: ".com" , ".com.br")', en: 'Allow subdomains (ex: ".com", ".com.br")' },
        type: "checkbox",
        default: false,
      },
    ],
  },
  cpf: {
    name: { pt: "CPF (Formato)", en: "CPF (Format)" },
    generator: generateCPFRegex,
    criteria: [
      {
        id: "allowOptionalSymbols",
        labels: { pt: 'Permitir símbolos opcionais', en: 'Allow optional symbols' },
        type: "checkbox",
        default: true,
      },
    ],
  },
  cep: {
    name: { pt: "CEP", en: "CEP" },
    generator: generateCEPRegex,
    criteria: [
      {
        id: "allowOptionalSymbols",
        labels: { pt: 'Permitir símbolos opcionais', en: 'Allow optional symbols' },
        type: "checkbox",
        default: true,
      },
    ],
  },
  uuid: {
    name: { pt: "UUID v4", en: "UUID v4" },
    generator: generateUUIDRegex,
    criteria: [],
  },
  slug: {
    name: { pt: "Slug (URL-friendly)", en: "Slug (URL-friendly)" },
    generator: generateSlugRegex,
    criteria: [
      {
        id: 'allowUppercase',
        labels: { pt: 'Permitir letras maiúsculas (A-Z)', en: 'Allow uppercase letters (A-Z)' },
        type: 'checkbox',
        default: false,
      },
    ],
  },
  // NOVAS CATEGORIAS (Telefone, Senha, etc.) DEVEM SER ADICIONADAS AQUI.
  ipv4: {
    name: { pt: "IPv4 (Endereço)", en: "IPv4 (Address)" },
    generator: generateIPv4Regex,
    criteria: [
      {
        id: 'allowCIDR',
        labels: { pt: 'Permitir sufixo CIDR (ex: /24)', en: 'Allow CIDR suffix (e.g. /24)' },
        type: 'checkbox',
        default: false,
      },
    ],
  },
};
