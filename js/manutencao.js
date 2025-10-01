// Função para salvar manutenção no localStorage
function saveManutencao() {
    const tipo = document.getElementById('tipoManutencao').value;
    const horaInicio = document.getElementById('horaInicio').value;
    const horaFim = document.getElementById('horaFim').value;
    const observacao = document.getElementById('observacaoManutencao').value;

    // Usar a data atual automaticamente
    const hoje = new Date();
    const data = hoje.toISOString().split('T')[0];

    if (!tipo || !horaInicio || !horaFim) {
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
    document.getElementById('horaInicio').value = '';
    document.getElementById('horaFim').value = '';
    document.getElementById('observacaoManutencao').value = '';
}
window.saveManutencao = saveManutencao;
