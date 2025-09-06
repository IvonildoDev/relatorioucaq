// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Carregar os detalhes quando a página for carregada
document.addEventListener('DOMContentLoaded', function () {
    // Obter o tipo de detalhes da URL
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') || 'operacao';

    // Obter os dados temporários do localStorage
    const detailsData = JSON.parse(localStorage.getItem('ucaq_temp_details') || '{}');

    // Exibir os detalhes
    displayDetails(type, detailsData);
});

// Função para exibir os detalhes do registro
function displayDetails(type, data) {
    const detailsContent = document.getElementById('detailsContent');

    if (!detailsContent || !data) {
        return;
    }

    let html = '';

    switch (type) {
        case 'operacao':
            html = `
                <div class="card-title">Detalhes da Operação</div>
                <div class="card-body">
                    <p><strong>Poço:</strong> ${data.poco || data.well || '-'}</p>
                    <p><strong>Atividade:</strong> ${data.atividade || data.activity || '-'}</p>
                    <p><strong>Início:</strong> ${data.inicio || data.startTime || '-'}</p>
                    <p><strong>Fim:</strong> ${data.fim || data.endTime || '-'}</p>
                    ${data.volume ? `<p><strong>Volume:</strong> ${data.volume} bbl</p>` : ''}
                    ${data.temperatura || data.temperature ? `<p><strong>Temperatura:</strong> ${data.temperatura || data.temperature} °C</p>` : ''}
                    ${data.pressao || data.pressure ? `<p><strong>Pressão:</strong> ${data.pressao || data.pressure} psi</p>` : ''}
                    ${data.observacoes || data.observations ? `<p><strong>Observações:</strong> ${data.observacoes || data.observations}</p>` : ''}
                </div>
            `;
            break;

        case 'deslocamento':
            html = `
                <div class="card-title">Detalhes do Deslocamento</div>
                <div class="card-body">
                    <p><strong>Origem:</strong> ${data.origem || data.origin || '-'}</p>
                    <p><strong>Destino:</strong> ${data.destino || data.destination || '-'}</p>
                    <p><strong>Início:</strong> ${data.inicio || data.startTime || '-'}</p>
                    <p><strong>Fim:</strong> ${data.fim || data.endTime || '-'}</p>
                    <p><strong>Km Inicial:</strong> ${data.kmInicial || data.initialKm || '-'}</p>
                    <p><strong>Km Final:</strong> ${data.kmFinal || data.finalKm || '-'}</p>
                    ${data.observacoes || data.observations ? `<p><strong>Observações:</strong> ${data.observacoes || data.observations}</p>` : ''}
                </div>
            `;
            break;

        default:
            html = `
                <div class="card-title">Detalhes do Registro</div>
                <div class="card-body">
                    <p>Nenhum detalhe disponível para este tipo de registro.</p>
                </div>
            `;
    }

    detailsContent.innerHTML = html;
}
