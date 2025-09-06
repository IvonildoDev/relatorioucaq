// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para salvar os dados do deslocamento no localStorage
function saveDisplacement() {
    // Capturar os valores dos campos
    const well = document.getElementById('well').value.trim();
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim();
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const odometerStart = document.getElementById('odometerStart').value;
    const odometerEnd = document.getElementById('odometerEnd').value;

    // Validar se todos os campos estão preenchidos
    if (!well || !origin || !destination || !startTime || !endTime || !odometerStart || !odometerEnd) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validar se o odômetro final é maior que o inicial
    if (Number(odometerEnd) <= Number(odometerStart)) {
        alert('O KM final deve ser maior que o KM inicial.');
        return;
    }

    // Calcular a distância percorrida
    const distance = Number(odometerEnd) - Number(odometerStart);

    // Criar objeto com os dados do deslocamento
    const displacementData = {
        well,
        origin,
        destination,
        startTime,
        endTime,
        odometerStart,
        odometerEnd,
        distance,
        timestamp: new Date().toISOString()
    };

    // Recuperar dados existentes ou inicializar array vazio
    let displacements = JSON.parse(localStorage.getItem('displacements')) || [];

    // Adicionar novo deslocamento
    displacements.push(displacementData);

    // Salvar no localStorage
    localStorage.setItem('displacements', JSON.stringify(displacements));

    // Informar ao usuário que os dados foram salvos
    alert('Deslocamento registrado com sucesso!');

    // Limpar os campos do formulário
    clearForm();
}

// Função para limpar o formulário após salvar
function clearForm() {
    // Manter o nome do poço, mas limpar os outros campos
    const well = document.getElementById('well').value;

    document.getElementById('origin').value = '';
    document.getElementById('destination').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('odometerStart').value = '';
    document.getElementById('odometerEnd').value = '';
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
