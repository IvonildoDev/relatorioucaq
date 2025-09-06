// Verifica se o banco de dados SQLite já está inicializado
document.addEventListener('DOMContentLoaded', async function () {
    // Verifica se o WebAssembly é suportado pelo navegador
    if (!checkWebAssemblySupport()) {
        console.warn('WebAssembly não é suportado neste navegador. Usando localStorage como fallback.');
        // Carrega o script de fallback
        loadFallbackScript();
        return;
    }

    // Verifica se o banco de dados foi inicializado anteriormente
    const dbInitialized = localStorage.getItem('sqlite_initialized') === 'true';

    if (!dbInitialized) {
        // Se ainda não foi inicializado, exibe um banner informativo
        showDatabaseBanner();
    } else {
        // Se já foi inicializado, tenta carregar o banco de dados
        try {
            await window.db.init();
            console.log('Banco de dados SQLite inicializado com sucesso!');
        } catch (error) {
            console.error('Erro ao inicializar o banco de dados SQLite:', error);
            // Se falhar, volta para localStorage e exibe o banner
            localStorage.removeItem('sqlite_initialized');
            loadFallbackScript();
            showDatabaseBanner();
        }
    }
});

// Verifica se o WebAssembly é suportado pelo navegador
function checkWebAssemblySupport() {
    try {
        if (typeof WebAssembly === 'object'
            && typeof WebAssembly.instantiate === 'function'
            && typeof WebAssembly.compile === 'function') {

            const module = new WebAssembly.Module(new Uint8Array([
                0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00
            ]));

            if (module instanceof WebAssembly.Module) {
                const instance = new WebAssembly.Instance(module);
                return instance instanceof WebAssembly.Instance;
            }
        }
    } catch (e) { }

    return false;
}

// Carrega o script de fallback
function loadFallbackScript() {
    const script = document.createElement('script');
    script.src = 'js/localStorage-fallback.js';
    document.head.appendChild(script);
}

// Exibe um banner informativo sobre a nova funcionalidade de banco de dados
function showDatabaseBanner() {
    // Cria o elemento do banner
    const banner = document.createElement('div');
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 15px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        text-align: center;
        max-width: 90%;
        width: 400px;
        font-family: Arial, sans-serif;
    `;

    banner.innerHTML = `
        <h3 style="margin-top: 0; color: #FFD700;">Nova Funcionalidade!</h3>
        <p>Agora é possível usar um banco de dados SQLite para armazenar seus dados de forma mais segura.</p>
        <p>Deseja migrar seus dados para o novo formato?</p>
        <button id="setupDb" style="background-color: #4CAF50; border: none; color: white; padding: 10px 15px; 
            margin-right: 10px; border-radius: 4px; cursor: pointer;">Configurar Agora</button>
        <button id="closeDbBanner" style="background-color: #999; border: none; color: white; padding: 10px 15px; 
            border-radius: 4px; cursor: pointer;">Mais Tarde</button>
    `;

    // Adiciona o banner ao documento
    document.body.appendChild(banner);

    // Adiciona os event listeners para os botões
    document.getElementById('setupDb').addEventListener('click', function () {
        window.location.href = 'db-setup.html';
    });

    document.getElementById('closeDbBanner').addEventListener('click', function () {
        banner.style.display = 'none';
    });
}

// Função auxiliar para salvar no SQLite se disponível, ou no localStorage como fallback
async function saveData(tableName, storageKey, data) {
    // Salva no localStorage para compatibilidade
    localStorage.setItem(storageKey, JSON.stringify(data));

    // Se SQLite estiver disponível, salva também no banco de dados
    if (window.db && localStorage.getItem('sqlite_initialized') === 'true') {
        try {
            // Adiciona timestamp se não existir
            if (!data.timestamp) {
                data.timestamp = new Date().toISOString();
            }

            // Insere no banco de dados
            await window.db.insert(tableName, data);

            console.log(`Dados salvos em ${tableName} com sucesso!`);
            return true;
        } catch (error) {
            console.error(`Erro ao salvar dados em ${tableName}:`, error);
            // Continua usando localStorage como fallback
            return false;
        }
    }

    return true;
}

// --- Funções Originais do Aplicativo ---

// --- Funções Aguardo ---
