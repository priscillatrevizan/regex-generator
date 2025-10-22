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
    let pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}';
    let flags = 'i'; // Case Insensitive

    // Exemplo de como a lógica do Model reage aos critérios:
    if (options.allowSubdomains) {
        // Se a opção de subdomínio for marcada, relaxamos o domínio:
        pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,63}(\\.[a-zA-Z]{2})?';
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
    let pattern = '';
    let flags = '';

    if (options.allowOptionalSymbols) {
        // Permite o formato 000.000.000-00 OU 00000000000 (pontos e hífen opcionais)
        pattern = '\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}';
    } else {
        // Exige o formato estrito 000.000.000-00
        pattern = '\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}';
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
    let pattern = '';
    let flags = '';

    if (options.allowOptionalSymbols) {
        // Permite o formato 00000-000 OU 00000000 (pontos e hífen opcionais)
        pattern = '\\d{5}-?\\d{3}';
    } else {
        // Exige o formato estrito 00000-000
        pattern = '\\d{5}-\\d{3}';
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
    let pattern = '';
    let flags = 'i'; // Case insensitive para aceitar A-F e a-f
    
    // UUID v4 formato: 8-4-4-4-12 caracteres hexadecimais
    // Exemplo: 550e8400-e29b-41d4-a716-446655440000
    const uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
    
    pattern = uuidPattern;
    
    // Adicionamos as âncoras
    pattern = `^${pattern}$`;
    
    return { pattern, flags };
};

// --- CATEGORIA 5: TELEPHONE (BRAZIL) ---

/**
 * Gera um padrão de Regex para validação de números de telefone brasileiros.
 * Suporta DDD, código do país opcional (+55), formatação opcional e padrões de celular e fixo.
 * @param {Object} options - Critérios de customização
 * @param {boolean} options.allowCountryCode - Permitir código do país (+55)
 * @param {boolean} options.allowFormatting - Permitir caracteres de formatação (espaços, parênteses, hífens)
 * @returns {{pattern: string, flags: string}}
 */
export const generatePhoneBRRegex = (options = {}) => {
    const { allowCountryCode = false, allowFormatting = false } = options;
    
    // Prefixo do país opcional
    const countryCodePattern = allowCountryCode ? '(\\+55\\s?)?' : '';
    
    // Caracteres de formatação opcionais
    const formattingPattern = allowFormatting ? '[\\s\\(\\)-]*' : '';
    
    // DDD (código de área) - 2 dígitos
    const dddPattern = allowFormatting ? 
        `\\(?${formattingPattern}(1[1-9]|2[12478]|3[1234578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])${formattingPattern}\\)?` :
        `(1[1-9]|2[12478]|3[1234578]|4[1-9]|5[1345]|6[1-9]|7[134579]|8[1-9]|9[1-9])`;
    
    // Separador entre DDD e número (opcional com formatação)
    const separatorPattern = allowFormatting ? `${formattingPattern}${formattingPattern}` : '';
    
    // Padrões para celular (9 dígitos) e fixo (8 dígitos)
    // Celular: 9xxxx-xxxx (começa com 9)
    // Fixo: xxxx-xxxx (não começa com 9)
    const phonePattern = allowFormatting ?
        `(${formattingPattern}9${formattingPattern}\\d{4}${formattingPattern}-${formattingPattern}\\d{4}|${formattingPattern}[1-8]${formattingPattern}\\d{3}${formattingPattern}-${formattingPattern}\\d{4})` :
        `(9\\d{8}|[1-8]\\d{7})`;
    
    // Montagem do padrão completo
    let pattern = `${countryCodePattern}${dddPattern}${separatorPattern}${phonePattern}`;
    
    // Adicionamos as âncoras
    pattern = `^${pattern}$`;
    
    // Sem flags especiais necessárias
    const flags = '';
    
    return { pattern, flags };
};

// --- CATEGORIA 6: IPv4 ADDRESS ---

/**
 * Gera um padrão de Regex para validação de endereços IPv4.
 * @returns {{pattern: string, flags: string}}
 */
export const generateIPv4Regex = () => {
    // Pattern for validating each octet (0-255):
    // 0-9: \d
    // 10-99: [1-9]\d
    // 100-199: 1\d{2}
    // 200-249: 2[0-4]\d
    // 250-255: 25[0-5]
    const octetPattern = '(25[0-5]|2[0-4]\\d|1\\d{2}|[1-9]\\d|\\d)';
    
    // Full IPv4 pattern: four octets separated by dots
    let pattern = `${octetPattern}\\.${octetPattern}\\.${octetPattern}\\.${octetPattern}`;
    
    // Add anchors to ensure the entire string matches
    pattern = `^${pattern}$`;
    
    // No special flags needed
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
    'email': {
        name: 'E-mail',
        generator: generateEmailRegex,
        // Definição dos critérios para o Controller renderizar a View:
        criteria: [
            { id: 'allowSubdomains', label: 'Permitir subdomínios (.ex: ".com" , ".com.br")', type: 'checkbox', default: false },
        ]
    },
    'cpf': {
        name: 'CPF (Formato)',
        generator: generateCPFRegex,
        criteria: [
            { id: 'allowOptionalSymbols', label: 'Permitir símbolos opcionais', type: 'checkbox', default: true },
        ]
    },
    'cep': {
        name: 'CEP',
        generator: generateCEPRegex,
        criteria: [
            { id: 'allowOptionalSymbols', label: 'Permitir símbolos opcionais', type: 'checkbox', default: true },
        ]
    },
    'uuid': {
        name: 'UUID v4',
        generator: generateUUIDRegex,
        criteria: []
    },
    'phonebr': {
        name: 'Telefone (BR)',
        generator: generatePhoneBRRegex,
        criteria: [
            { id: 'allowCountryCode', label: 'Permitir código do país (+55)', type: 'checkbox', default: false },
            { id: 'allowFormatting', label: 'Permitir formatação (parênteses, espaços, hífens)', type: 'checkbox', default: true },
        ]
    },
    'ipv4': {
        name: 'IPv4 Address',
        generator: generateIPv4Regex,
        criteria: []
    }
    // NOVAS CATEGORIAS (Telefone, Senha, etc.) DEVEM SER ADICIONADAS AQUI.
};