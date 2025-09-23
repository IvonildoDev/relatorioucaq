// Função para salvar manutenção no localStorage
function saveManutencao() {
    const tipo = document.getElementById('tipoManutencao').value;
    const data = document.getElementById('dataManutencao').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const observacao = document.getElementById('observacaoManutencao').value;

    if (!tipo || !data || !horaInicio || !horaFim) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const manutencoes = JSON.parse(localStorage.getItem('manutencoes')) || [];
    manutencoes.push({
        tipo,
        data,
        horaInicio,
        horaFim,
        observacao,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('manutencoes', JSON.stringify(manutencoes));
    alert('Manutenção registrada com sucesso!');
    document.getElementById('tipoManutencao').value = '';
    document.getElementById('dataManutencao').value = '';
    document.getElementById('horaInicio').value = '';
    document.getElementById('horaFim').value = '';
    document.getElementById('observacaoManutencao').value = '';
}
window.saveManutencao = saveManutencao;
