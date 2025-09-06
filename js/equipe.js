// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para salvar os dados da equipe no localStorage
function saveTeam() {
    // Capturar os valores dos campos
    const operator = document.getElementById('operator').value.trim();
    const assistant = document.getElementById('assistant').value.trim();
    const date = document.getElementById('date').value;
    const well = document.getElementById('well').value.trim();

    // Validar se todos os campos estão preenchidos
    if (!operator || !assistant || !date || !well) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Criar objeto com os dados da equipe
    const teamData = {
        operator,
        assistant,
        date,
        well,
        timestamp: new Date().toISOString()
    };

    // Salvar no localStorage
    localStorage.setItem('teamData', JSON.stringify(teamData));

    // Informar ao usuário que os dados foram salvos
    alert('Dados da equipe salvos com sucesso!');

    // Opcional: redirecionar para a próxima página
    // window.location.href = 'deslocamento.html';
}

// Carregar dados salvos anteriormente quando a página for carregada
document.addEventListener('DOMContentLoaded', function () {
    // Verificar se existem dados salvos
    const savedTeamData = localStorage.getItem('teamData');
    if (savedTeamData) {
        const teamData = JSON.parse(savedTeamData);

        // Preencher os campos com os dados salvos
        document.getElementById('operator').value = teamData.operator || '';
        document.getElementById('assistant').value = teamData.assistant || '';
        document.getElementById('date').value = teamData.date || '';
        document.getElementById('well').value = teamData.well || '';
    } else {
        // Se não houver dados salvos, preencher a data atual
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    }
});
