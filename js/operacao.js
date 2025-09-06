// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para salvar os dados da operação no localStorage
function saveOperation() {
    // Capturar os valores dos campos
    const pocoId = document.getElementById('pocoId').value.trim();
    const poco = document.getElementById('poco').value.trim();
    const servico = document.getElementById('servico').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const volume = document.getElementById('volume').value.trim();
    const temperature = document.getElementById('temperature').value.trim();
    const pressure = document.getElementById('pressure').value.trim();
    const observation = document.getElementById('observation').value.trim();

    // Validar campos obrigatórios
    if (!poco || !servico || !startTime || !endTime) {
        alert('Por favor, preencha todos os campos obrigatórios: Nome do Poço, Serviço, Hora Início e Hora Fim.');
        return;
    }

    // Calcular duração da operação
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

    // Criar objeto com os dados da operação
    const operationData = {
        pocoId,
        poco,
        servico,
        startTime,
        endTime,
        volume,
        temperature,
        pressure,
        observation,
        duration,
        timestamp: new Date().toISOString()
    };

    // Recuperar dados existentes ou inicializar array vazio
    let operations = JSON.parse(localStorage.getItem('operations')) || [];

    // Adicionar nova operação
    operations.push(operationData);

    // Salvar no localStorage
    localStorage.setItem('operations', JSON.stringify(operations));

    // Informar ao usuário que os dados foram salvos
    alert('Operação registrada com sucesso!');

    // Limpar os campos do formulário, exceto o nome do poço
    clearForm();

    // Atualizar a lista de operações
    loadOperations();
}

// Função para limpar o formulário após salvar
function clearForm() {
    // Manter o nome do poço, mas limpar os outros campos
    const poco = document.getElementById('poco').value;
    const pocoId = document.getElementById('pocoId').value;

    document.getElementById('servico').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('volume').value = '';
    document.getElementById('temperature').value = '';
    document.getElementById('pressure').value = '';
    document.getElementById('observation').value = '';
}

// Função para carregar dados da equipe no campo do poço
function loadTeamData() {
    const teamData = JSON.parse(localStorage.getItem('teamData'));
    if (teamData && teamData.well) {
        document.getElementById('poco').value = teamData.well;
    }
}

// Função para carregar operações salvas
function loadOperations() {
    const operationsContainer = document.getElementById('operacoesSalvas');
    if (!operationsContainer) return;

    // Limpar container
    operationsContainer.innerHTML = '';

    // Recuperar operações do localStorage
    const operations = JSON.parse(localStorage.getItem('operations')) || [];

    // Filtrar operações do dia atual
    const today = new Date().toISOString().split('T')[0];
    const todayOperations = operations.filter(op => op.timestamp.split('T')[0] === today);

    if (todayOperations.length === 0) {
        operationsContainer.innerHTML = '<p class="alert alert-info">Nenhuma operação registrada hoje.</p>';
        return;
    }

    // Mostrar as operações em formato de cards
    todayOperations.forEach((op, index) => {
        const card = document.createElement('div');
        card.className = 'report-card card-operacao';

        card.innerHTML = `
            <div class="report-card-title">Operação ${index + 1}</div>
            <div class="report-card-body">
                <p><strong>Poço:</strong> ${op.poco}</p>
                <p><strong>Serviço:</strong> ${op.servico}</p>
                <p><strong>Horário:</strong> ${op.startTime} - ${op.endTime}</p>
                ${op.volume ? `<p><strong>Volume:</strong> ${op.volume} bbl</p>` : ''}
                ${op.temperature ? `<p><strong>Temperatura:</strong> ${op.temperature} °C</p>` : ''}
                ${op.pressure ? `<p><strong>Pressão:</strong> ${op.pressure} psi</p>` : ''}
                ${op.duration ? `<p><strong>Duração:</strong> ${op.duration}</p>` : ''}
            </div>
        `;

        // Adicionar botão para editar (preencher o formulário com esses dados)
        const editBtn = document.createElement('button');
        editBtn.className = 'btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
        editBtn.onclick = () => fillForm(op);

        const cardActions = document.createElement('div');
        cardActions.className = 'report-card-actions';
        cardActions.appendChild(editBtn);

        card.appendChild(cardActions);
        operationsContainer.appendChild(card);
    });
}

// Função para preencher o formulário com dados existentes
function fillForm(operation) {
    document.getElementById('pocoId').value = operation.pocoId || '';
    document.getElementById('poco').value = operation.poco || '';
    document.getElementById('servico').value = operation.servico || '';
    document.getElementById('startTime').value = operation.startTime || '';
    document.getElementById('endTime').value = operation.endTime || '';
    document.getElementById('volume').value = operation.volume || '';
    document.getElementById('temperature').value = operation.temperature || '';
    document.getElementById('pressure').value = operation.pressure || '';
    document.getElementById('observation').value = operation.observation || '';

    // Scroll para o formulário
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', function () {
    loadTeamData();
    loadOperations();

    // Controle de visibilidade do cabeçalho mobile
    const mobileHeader = document.getElementById('mobileHeader');
    if (mobileHeader) {
        if (window.innerWidth <= 768) {
            mobileHeader.style.display = 'flex';
        } else {
            mobileHeader.style.display = 'none';
        }

        // Atualizar visibilidade do cabeçalho ao redimensionar
        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                mobileHeader.style.display = 'flex';
            } else {
                mobileHeader.style.display = 'none';
            }
        });
    }
});
