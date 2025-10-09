# Diretrizes para Contribuição

Bem-vindo ao projeto Gerador de Regex por Critérios! Agradecemos seu interesse em contribuir para este projeto de código aberto.

Este projeto é um excelente ponto de partida para quem deseja contribuir para o código aberto, especialmente durante o **Hacktoberfest**.

## 🎃 Hacktoberfest 2025

Para participar do Hacktoberfest, este repositório deve ter:

### **Tags Obrigatórias no GitHub:**
- `hacktoberfest` (tag principal)
- `good-first-issue` (para issues iniciantes)
- `help-wanted` (para issues que precisam de ajuda)

### **Labels para Issues:**
- 🟢 `good first issue` - Ideal para iniciantes
- 🟡 `hacktoberfest` - Elegível para o evento
- 🔵 `help wanted` - Precisa de contribuidores
- 🟠 `enhancement` - Novas funcionalidades
- 🔴 `bug` - Correção de bugs
- 📝 `documentation` - Melhorias na documentação

## ✨ **Estrele esse repositório:**
<img width="155" height="34" alt="image" src="https://github.com/user-attachments/assets/827caeba-0963-49e7-9da7-c7c11fe03bd6" />

## Como Contribuir

Existem várias maneiras de contribuir para este projeto:

*   **Adicionar novos padrões de Regex:** Este é o foco principal das contribuições. Você pode adicionar novas funções e padrões de Regex validados ao arquivo `src/model/regexPatterns.js`.
*   **Melhorar o sistema de toasts:** Adicione novos tipos ou animações no `src/view/domRenderer.js`.
*   **Expandir categorias:** Adicione suporte a telefone, senha, URL, etc.
*   Melhorar a interface do usuário (UI) e a experiência do usuário (UX).
*   Corrigir bugs e melhorar a performance.
*   Aprimorar a documentação.

## Adicionando Novos Padrões de Regex (Model)

Para adicionar um novo padrão de Regex, siga estas etapas:

1.  **Crie uma nova branch:**
    ```bash
    git checkout -b feature/nome-do-seu-padrao
    ```

2.  **Edite `src/model/regexPatterns.js`:**
    Adicione uma nova função pura que recebe `opções` (um objeto com critérios) e retorna a string do padrão Regex. Certifique-se de que a Regex seja bem testada e validada.

    Exemplo:
    ```javascript
    // Função de geração (deve retornar objeto com pattern e flags)
    export const generatePhoneRegex = (options = {}) => {
        let pattern = '';
        
        if (options.allowCountryCode) {
            pattern = '\\+?\\d{1,3}[\\s-]?';
        }
        
        pattern += '\\(?\\d{2}\\)?[\\s-]?\\d{4,5}[\\s-]?\\d{4}';
        pattern = `^${pattern}$`;
        
        return { pattern, flags: 'i' };
    };

    // Adicione ao objeto RegexCategories
    'phone': {
        name: 'Telefone',
        generator: generatePhoneRegex,
        criteria: [
            { id: 'allowCountryCode', label: 'Permitir código do país', type: 'checkbox', default: false }
        ]
    }
    ```

3.  **Atualize o sistema de labels (se necessário):**
    Se sua nova categoria precisa de um label personalizado no campo de teste, atualize a função `updateTestInputLabel()` em `src/view/domRenderer.js`:
    
    ```javascript
    const labels = {
        'email': 'Insira o email:',
        'cpf': 'Insira o CPF:',
        'phone': 'Insira o telefone:', // Sua nova categoria
    };
    ```

4.  **Teste suas alterações:**
    Certifique-se de que seu novo padrão de Regex funciona como esperado e que a interface do usuário reflete as novas opções corretamente.

5.  **Crie um Pull Request (PR):**
    Envie seu PR para a branch `main` com uma descrição clara das suas alterações.

## Estrutura do Projeto

```
src/
├── controller/
│   └── appController.js    # Lógica de controle e estado
├── model/
│   └── regexPatterns.js    # Padrões de regex (ADICIONE AQUI)
├── view/
│   └── domRenderer.js      # Manipulação do DOM e toasts
└── styles/
    ├── main.css           # Estilos principais
    └── components/
        └── generator.css   # Estilos específicos do gerador
```

## Boas Práticas

*   **Teste sua regex**: Sempre teste com casos válidos e inválidos
*   **Use âncoras**: Sempre adicione `^` e `$` para validação completa
*   **Mantenha a arquitetura MVC**: Model para lógica, View para DOM, Controller para coordenação
*   **Comente seu código**: Explique a lógica por trás de padrões complexos
*   **Seja respeitoso**: Mantenha interações construtivas e profissionais

## Sistema de Toasts

O projeto agora inclui um sistema de toasts elegante. Para adicionar notificações:

```javascript
// No controller, use:
Renderer.showToast('Mensagem', 'tipo', duração);
// Tipos: 'success', 'error', 'info', 'warning'
```

## 📋 Issues Sugeridas para Hacktoberfest

### **Iniciantes (good-first-issue):**
- Adicionar regex para **telefone brasileiro**  
- Adicionar regex para **RG (Registro Geral)**
- Melhorar mensagens de toast
- Adicionar mais exemplos na documentação

### **Intermediário:**
- Implementar regex para **senhas seguras**
- Adicionar regex para **URLs válidas** 
- Criar regex para **datas (DD/MM/YYYY)**
- Implementar **modo escuro** na interface
- Adicionar **histórico de regexes** geradas

### **Avançado:**
- Sistema de **export/import** de configurações
- **API REST** para geração de regex
- **Testes automatizados** com Jest
- **Performance optimization**
- **Internacionalização (i18n)**

## 🚀 Como Começar uma Contribuição

1. **Escolha uma issue** com label `good first issue` ou `hacktoberfest`
2. **Comente na issue** pedindo para ser assignado
3. **Faça um fork** do repositório
4. **Crie uma branch** com nome descritivo
5. **Desenvolva sua solução**
6. **Teste tudo** antes de enviar
7. **Abra um Pull Request** com descrição detalhada

Obrigado por sua contribuição! 🚀

---

# Contribution Guidelines

Welcome to the Regex Generator by Criteria project! We appreciate your interest in contributing to this open source project.

This project is an excellent starting point for those who want to contribute to open source, especially during **Hacktoberfest**.

## 🎃 Hacktoberfest 2025

To participate in Hacktoberfest, this repository must have:

### **Required Tags on GitHub:**
- `hacktoberfest` (main tag)
- `good-first-issue` (for beginner issues)
- `help-wanted` (for issues that need help)

### **Labels for Issues:**
- 🟢 `good first issue` - Ideal for beginners
- 🟡 `hacktoberfest` - Eligible for the event
- 🔵 `help wanted` - Needs contributors
- 🟠 `enhancement` - New features
- 🔴 `bug` - Bug fixes
- 📝 `documentation` - Documentation improvements

### **How to Configure the Repository:**

1. **Add topics on GitHub:**
   - Go to Settings → General → Topics
   - Add: `hacktoberfest`, `regex`, `javascript`, `open-source`, `good-first-issue`

2. **Create Issues with appropriate labels**
3. **Maintain active and welcoming discussions**

## How to Contribute

There are several ways to contribute to this project:

*   **Add new Regex patterns:** This is the main focus of contributions. You can add new functions and validated Regex patterns to the `src/model/regexPatterns.js` file.
*   **Improve the toast system:** Add new types or animations in `src/view/domRenderer.js`.
*   **Expand categories:** Add support for phone, password, URL, etc.
*   Improve user interface (UI) and user experience (UX).
*   Fix bugs and improve performance.
*   Enhance documentation.

## Adding New Regex Patterns (Model)

To add a new Regex pattern, follow these steps:

1.  **Create a new branch:**
    ```bash
    git checkout -b feature/your-pattern-name
    ```

2.  **Edit `src/model/regexPatterns.js`:**
    Add a new pure function that receives `options` (an object with criteria) and returns the Regex pattern string. Make sure the Regex is well tested and validated.

    Example:
    ```javascript
    // Generation function (must return object with pattern and flags)
    export const generatePhoneRegex = (options = {}) => {
        let pattern = '';
        
        if (options.allowCountryCode) {
            pattern = '\\+?\\d{1,3}[\\s-]?';
        }
        
        pattern += '\\(?\\d{2}\\)?[\\s-]?\\d{4,5}[\\s-]?\\d{4}';
        pattern = `^${pattern}$`;
        
        return { pattern, flags: 'i' };
    };

    // Add to RegexCategories object
    'phone': {
        name: 'Phone',
        generator: generatePhoneRegex,
        criteria: [
            { id: 'allowCountryCode', label: 'Allow country code', type: 'checkbox', default: false }
        ]
    }
    ```

3.  **Update the label system (if needed):**
    If your new category needs a custom label in the test field, update the `updateTestInputLabel()` function in `src/view/domRenderer.js`:
    
    ```javascript
    const labels = {
        'email': 'Enter email:',
        'cpf': 'Enter CPF:',
        'phone': 'Enter phone:', // Your new category
    };
    ```

4.  **Test your changes:**
    Make sure your new Regex pattern works as expected and that the user interface reflects the new options correctly.

5.  **Create a Pull Request (PR):**
    Submit your PR to the `main` branch with a clear description of your changes.

## Project Structure

```
src/
├── controller/
│   └── appController.js    # Control logic and state
├── model/
│   └── regexPatterns.js    # Regex patterns (ADD HERE)
├── view/
│   └── domRenderer.js      # DOM manipulation and toasts
└── styles/
    ├── main.css           # Main styles
    └── components/
        └── generator.css   # Generator-specific styles
```

## Best Practices

*   **Test your regex**: Always test with valid and invalid cases
*   **Use anchors**: Always add `^` and `$` for complete validation
*   **Maintain MVC architecture**: Model for logic, View for DOM, Controller for coordination
*   **Comment your code**: Explain the logic behind complex patterns
*   **Be respectful**: Maintain constructive and professional interactions

## Toast System

The project now includes an elegant toast system. To add notifications:

```javascript
// In controller, use:
Renderer.showToast('Message', 'type', duration);
// Types: 'success', 'error', 'info', 'warning'
```

## 📋 Suggested Issues for Hacktoberfest

### **Beginners (good-first-issue):**
- Add regex for **Brazilian phone**  
- Add regex for **RG (General Registry)**
- Improve toast messages
- Add more examples in documentation

### **Intermediate:**
- Implement regex for **secure passwords**
- Add regex for **valid URLs** 
- Create regex for **dates (DD/MM/YYYY)**
- Implement **dark mode** in interface
- Add **history of generated regexes**

### **Advanced:**
- **Export/import** configuration system
- **REST API** for regex generation
- **Automated tests** with Jest
- **Performance optimization**
- **Internationalization (i18n)**

## 🚀 How to Start a Contribution

1. **Choose an issue** with `good first issue` or `hacktoberfest` label
2. **Comment on the issue** asking to be assigned
3. **Fork** the repository
4. **Create a branch from `development`** following the naming convention:
   - `feat/regex-phone-insert` (new feature)  
   - `fix/toast-notification-bug` (bug fix)
   - `docs/readme-update` (documentation)
   - `style/button-hover-effect` (style/UI)
5. **Develop your solution**
6. **Test everything** before submitting
7. **Open a Pull Request to `development` branch** with detailed description

> **⚠️ Important:** Always create PRs targeting the `development` branch, never `main`.

Thank you for your contribution! 🚀

