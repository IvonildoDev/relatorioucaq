// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para salvar os dados de aguardo no localStorage
function saveWaiting() {
    // Capturar os valores dos campos
    const well = document.getElementById('well').value.trim();
    const reason = document.getElementById('reason').value.trim();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;

    // Validar se todos os campos estão preenchidos
    if (!well || !reason || !startTime || !endTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Calcular a duração do aguardo
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

    // Criar objeto com os dados do aguardo
    const waitingData = {
        well,
        reason,
        startTime,
        endTime,
        duration,
        timestamp: new Date().toISOString()
    };

    // Recuperar dados existentes ou inicializar array vazio
    let waitings = JSON.parse(localStorage.getItem('waitings')) || [];

    // Adicionar novo aguardo
    waitings.push(waitingData);

    // Salvar no localStorage
    localStorage.setItem('waitings', JSON.stringify(waitings));

    // Informar ao usuário que os dados foram salvos
    alert('Aguardo registrado com sucesso!');

    // Limpar os campos do formulário
    clearForm();
}

// Função para limpar o formulário após salvar
function clearForm() {
    // Manter o nome do poço, mas limpar os outros campos
    const well = document.getElementById('well').value;

    document.getElementById('reason').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
}

// Função para carregar dados da equipe no campo do poço
function loadTeamData() {
    const teamData = JSON.parse(localStorage.getItem('teamData'));
    if (teamData && teamData.well) {
        document.getElementById('well').value = teamData.well;
    }
}

// Carregar dados quando a página for carregada
document.addEventListener('DOMContentLoaded', function () {
    loadTeamData();
});
