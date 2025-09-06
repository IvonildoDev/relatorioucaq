// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para selecionar o tipo de abastecimento
function selectType(type) {
    document.getElementById('supplyType').value = type;

    // Atualizar botões
    const aguaBtn = document.getElementById('aguaBtn');
    const combustivelBtn = document.getElementById('combustivelBtn');

    if (type === 'Água') {
        aguaBtn.classList.add('active');
        combustivelBtn.classList.remove('active');
    } else {
        aguaBtn.classList.remove('active');
        combustivelBtn.classList.add('active');
    }
}

// Função para verificar se o banco de dados está disponível
function checkDatabaseStatus() {
    if (!window.db) {
        console.error('window.db não está disponível');
        return false;
    }

    if (!window.db.insert) {
        console.error('window.db.insert não está disponível');
        return false;
    }

    console.log('Banco de dados está disponível');
    return true;
}

// Função para salvar os dados de abastecimento no banco SQLite
function saveSupply() {
    // Capturar os valores dos campos
    const well = document.getElementById('well').value.trim();
    const supplyType = document.getElementById('supplyType').value.trim();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Validar se todos os campos estão preenchidos
    if (!well || !supplyType || !startTime || !endTime) {
        alert('Por favor, preencha todos os campos obrigatórios e selecione um tipo de abastecimento.');
        return;
    }

    // Calcular a duração do abastecimento
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);

    // Se a hora final for menor que a inicial, assume que passou para o dia seguinte
    let diffMs = end - start;
    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000; // Adiciona 24 horas
    }

    // Calcula a duração em horas e minutos
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const duration = `${diffHrs}h ${diffMins}m`;

    // Obter a data escolhida pelo usuário
    let date = '';
    const dateInput = document.getElementById('date');
    if (dateInput) {
        date = dateInput.value;
    }
    // Verificar se o banco de dados está disponível
    if (!checkDatabaseStatus()) {
        alert('Banco de dados não está disponível. Verifique se o sistema foi inicializado corretamente.');
        return;
    }

    // Preparar dados para inserção
    const supplyData = {
        local: well,
        data: date || new Date().toISOString().slice(0, 10),
        litros: '', // Campo removido do formulário
        valor: '',
        kilometragem: '',
        timestamp: new Date().toISOString()
    };

    console.log('Tentando salvar dados de abastecimento:', supplyData);

    // Salvar no banco SQLite
    try {
        const success = window.db.insert('abastecimento', supplyData);

        if (success) {
            console.log('Abastecimento salvo com sucesso no banco SQLite');
            alert('Abastecimento registrado no banco de dados SQLite!');
            clearForm();
        } else {
            console.error('Falha ao salvar no banco de dados');
            alert('Erro ao salvar no banco de dados. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao salvar abastecimento:', error);
        alert('Erro inesperado ao salvar no banco de dados: ' + error.message);
    }
}

// Função para limpar o formulário após salvar
function clearForm() {
    // Manter o nome do poço, mas limpar os outros campos
    const well = document.getElementById('well').value;

    document.getElementById('supplyType').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';

    // Remover a classe active dos botões
    document.getElementById('aguaBtn').classList.remove('active');
    document.getElementById('combustivelBtn').classList.remove('active');
}

// Função para carregar dados da equipe no campo do poço
function loadTeamData() {
    const teamData = JSON.parse(localStorage.getItem('teamData'));
    if (teamData && teamData.well) {
        document.getElementById('well').value = teamData.well;
    }
}

// Função para testar o banco de dados (pode ser chamada no console)
function testDatabase() {
    console.log('=== TESTE DO BANCO DE DADOS ===');

    if (!checkDatabaseStatus()) {
        console.error('Banco de dados não está disponível');
        return false;
    }

    // Teste de inserção
    const testData = {
        local: 'TESTE',
        data: new Date().toISOString().slice(0, 10),
        litros: '100',
        valor: '50.00',
        kilometragem: '1000',
        timestamp: new Date().toISOString()
    };

    console.log('Testando inserção com dados:', testData);

    try {
        const success = window.db.insert('abastecimento', testData);
        if (success) {
            console.log('✅ Teste de inserção: SUCESSO');

            // Teste de consulta
            const records = window.db.getAll('abastecimento');
            console.log('✅ Teste de consulta: SUCESSO');
            console.log('Registros encontrados:', records.length);
            console.log('Último registro:', records[0]);

            return true;
        } else {
            console.error('❌ Teste de inserção: FALHOU');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}

// Disponibilizar função de teste globalmente
window.testDatabase = testDatabase;

// Também disponibilizar outras funções úteis para debug
window.checkDatabaseStatus = checkDatabaseStatus;
window.saveSupply = saveSupply;

// Função de inicialização
function initializePage() {
    // Preencher campo de data automaticamente
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }

    // Inicializar banco de dados SQLite
    if (window.db && window.db.init) {
        window.db.init().then((success) => {
            if (success) {
                console.log('Banco de dados SQLite inicializado com sucesso');
                loadTeamData();
            } else {
                console.error('Falha ao inicializar banco de dados SQLite');
                loadTeamData();
            }
        }).catch((error) => {
            console.error('Erro ao inicializar banco de dados:', error);
            loadTeamData();
        });
    } else {
        console.warn('Módulo de banco de dados não encontrado');
        loadTeamData();
    }
}

// Carregar dados quando a página for carregada
document.addEventListener('DOMContentLoaded', initializePage);

// Também disponibilizar a função de inicialização globalmente
window.initializePage = initializePage;

// Log de confirmação de que as funções estão disponíveis
console.log('✅ Funções de abastecimento carregadas:');
console.log('- testDatabase:', typeof window.testDatabase);
console.log('- checkDatabaseStatus:', typeof window.checkDatabaseStatus);
console.log('- saveSupply:', typeof window.saveSupply);
console.log('- initializePage:', typeof window.initializePage);
