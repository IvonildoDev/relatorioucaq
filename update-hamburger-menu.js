// Script para implementar o menu hambúrguer em todos os arquivos HTML

// Lista de arquivos HTML que precisam ser atualizados
const htmlFiles = [
    'abastecimento.html',
    'aguardo.html',
    'alimentacao.html',
    'deslocamento.html',
    'desmobilizacao.html',
    'details.html',
    'home.html',
    'mobilizacao.html',
    'relatorio.html',
    'sobre.html'
];

// Código do menu hambúrguer para inserir
const hamburgerCode = `
    <!-- Fundo escuro para quando o menu estiver aberto em mobile -->
    <div class="sidebar-backdrop" onclick="closeMenu()"></div>

    <!-- Menu hambúrguer animado -->
    <label class="hamburger">
        <input type="checkbox">
        <svg viewBox="0 0 32 32">
            <path class="line line-top-bottom"
                d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22">
            </path>
            <path class="line" d="M7 16 27 16"></path>
        </svg>
    </label>
`;

// Script para adicionar ao head
const scriptTag = `<script src="js/hamburger.js" defer></script>`;

// Percorre cada arquivo HTML
htmlFiles.forEach(file => {
    // Lê o conteúdo do arquivo
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, file);

    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // Adiciona o script no head
        content = content.replace('</head>', `    ${scriptTag}\n</head>`);

        // Substitui o botão de menu pelo hambúrguer
        // Procura por padrões comuns de botão de menu
        if (content.includes('<button class="menu-btn" onclick="toggleDrawer()">☰</button>')) {
            content = content.replace(
                '<button class="menu-btn" onclick="toggleDrawer()">☰</button>',
                hamburgerCode + '\n    <!-- Botão de menu para compatibilidade -->\n    <button class="menu-btn" onclick="toggleDrawer()">☰</button>'
            );
        }
        // Adiciona o backdrop se não existir
        if (!content.includes('sidebar-backdrop')) {
            content = content.replace(
                '</div>\n\n    <button class="menu-btn"',
                '</div>\n\n    <!-- Fundo escuro para quando o menu estiver aberto em mobile -->\n    <div class="sidebar-backdrop" onclick="closeMenu()"></div>\n\n    <button class="menu-btn"'
            );
        }

        // Salva o arquivo atualizado
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Arquivo ${file} atualizado com sucesso.`);
    } catch (error) {
        console.error(`Erro ao processar o arquivo ${file}:`, error);
    }
});

console.log('Implementação do menu hambúrguer em todas as páginas concluída.');
