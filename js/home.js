// Função para alternar o menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para carregar os registros na página inicial
document.addEventListener('DOMContentLoaded', function () {
    // Carregar últimos registros
    loadRecords();
});

// Função para carregar os registros
function loadRecords() {
    // Elementos do DOM
    const logList = document.getElementById('logList');
    const ultimoRegistro = document.getElementById('ultimoRegistro');

    if (!logList) return;

    // Limpar listas
    logList.innerHTML = '';
    if (ultimoRegistro) ultimoRegistro.innerHTML = '';

    // Carregar dados da equipe
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));

    // Mostrar informações da equipe (se disponível)
    if (ultimoRegistro && equipe) {
        const dataFormatada = equipe.data ? formatDate(equipe.data) : '';
        ultimoRegistro.innerHTML = `
            <div class="card">
                <div class="card-title">Última Equipe</div>
                <div class="card-body">
                    <p><strong>Operador:</strong> ${equipe.operador || equipe.operator || '-'}</p>
                    <p><strong>Auxiliar:</strong> ${equipe.auxiliar || equipe.assistant || '-'}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                    <p><strong>Poço:</strong> ${equipe.poco || equipe.well || '-'}</p>
                </div>
            </div>
        `;
    } else if (ultimoRegistro) {
        ultimoRegistro.innerHTML = `
            <div class="card">
                <div class="card-title">Equipe</div>
                <div class="card-body">
                    <p>Nenhum registro de equipe encontrado.</p>
                    <button onclick="window.location.href='equipe.html'">Registrar Equipe</button>
                </div>
            </div>
        `;
    }

    // Carregar dados de operações
    const operacoes = JSON.parse(localStorage.getItem('ucaq_operacao'));

    if (operacoes) {
        // Converter para array se for um objeto único
        const operacoesArray = Array.isArray(operacoes) ? operacoes : [operacoes];

        if (operacoesArray.length > 0) {
            operacoesArray.forEach(operacao => {
                const logItem = document.createElement('div');
                logItem.className = 'log-item';
                logItem.innerHTML = `
                    <div class="log-header">
                        <span class="log-title">Operação em ${operacao.poco || operacao.well || '-'}</span>
                        <span class="log-date">${operacao.inicio || operacao.startTime || '-'} - ${operacao.fim || operacao.endTime || '-'}</span>
                    </div>
                    <div class="log-body">
                        <p><strong>Atividade:</strong> ${operacao.atividade || operacao.activity || '-'}</p>
                        ${operacao.volume ? `<p><strong>Volume:</strong> ${operacao.volume} bbl</p>` : ''}
                        ${operacao.temperatura || operacao.temperature ? `<p><strong>Temperatura:</strong> ${operacao.temperatura || operacao.temperature} °C</p>` : ''}
                        ${operacao.pressao || operacao.pressure ? `<p><strong>Pressão:</strong> ${operacao.pressao || operacao.pressure} psi</p>` : ''}
                    </div>
                    <div class="log-actions">
                        <button onclick="window.location.href='operacao.html'">Editar</button>
                        <button onclick="showDetails('operacao', ${JSON.stringify(operacao).replace(/"/g, '&quot;')})">Detalhes</button>
                    </div>
                `;
                logList.appendChild(logItem);
            });
        } else {
            showEmptyLog(logList);
        }
    } else {
        showEmptyLog(logList);
    }
}

// Mostrar mensagem de log vazio
function showEmptyLog(logList) {
    const emptyLog = document.createElement('div');
    emptyLog.className = 'empty-log';
    emptyLog.innerHTML = `
        <p>Nenhuma operação registrada.</p>
        <button onclick="window.location.href='operacao.html'">Registrar Operação</button>
    `;
    logList.appendChild(emptyLog);
}

// Função para mostrar detalhes de uma operação
function showDetails(type, data) {
    // Salvar os dados temporariamente para exibição
    localStorage.setItem('ucaq_temp_details', JSON.stringify(data));

    // Redirecionar para a página de detalhes
    window.location.href = 'details.html?type=' + type;
}

// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return '';

    // Se já estiver no formato brasileiro DD/MM/YYYY, retorna como está
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;

    // Se estiver no formato YYYY-MM-DD, converte
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split('-');
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    // Tenta converter se for uma data válida
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
}
