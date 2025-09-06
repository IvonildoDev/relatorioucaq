// Função para carregar páginas de forma dinâmica
function loadPage(pageId) {
    fetch(`pages/${pageId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Página ${pageId} não encontrada`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('content').innerHTML = html;

            // Inicializa os comportamentos específicos de cada página após carregar
            if (typeof window[`init${pageId.charAt(0).toUpperCase() + pageId.slice(1)}Page`] === 'function') {
                window[`init${pageId.charAt(0).toUpperCase() + pageId.slice(1)}Page`]();
            }
        })
        .catch(error => {
            console.error('Erro ao carregar a página:', error);
            document.getElementById('content').innerHTML = `
                <div class="error-message">
                    <h2>Erro ao carregar a página</h2>
                    <p>${error.message}</p>
                </div>
            `;
        });
}

// Função para alternar o menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para mostrar uma tela específica
window.showScreen = function (screenId) {
    loadPage(screenId);

    // Fecha o menu lateral em dispositivos móveis
    const drawer = document.getElementById('drawer');
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    }
}

// Funções para salvar dados no localStorage
function salvarEquipe() {
    const equipe = {
        operador: document.getElementById('equipeOperador').value,
        auxiliar: document.getElementById('equipeAuxiliar').value,
        data: document.getElementById('equipeData').value,
        poco: document.getElementById('equipePoco').value
    };

    localStorage.setItem('ucaq_equipe', JSON.stringify(equipe));

    document.getElementById('equipeSalvo').innerHTML = `
        <div class="success-message">
            <p>✅ Dados da equipe salvos com sucesso!</p>
        </div>
    `;
}

function salvarDeslocamento() {
    const desloc = {
        poco: document.getElementById('deslocPoco').value,
        origem: document.getElementById('deslocOrigem').value,
        destino: document.getElementById('deslocDestino').value,
        inicio: document.getElementById('deslocInicio').value,
        fim: document.getElementById('deslocFim').value,
        kmInicio: document.getElementById('deslocKmInicio').value,
        kmFim: document.getElementById('deslocKmFim').value
    };

    localStorage.setItem('ucaq_deslocamento', JSON.stringify(desloc));

    document.getElementById('deslocamentoSalvo').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de deslocamento salvos com sucesso!</p>
        </div>
    `;
}

function salvarOperacao() {
    const operacao = {
        poco: document.getElementById('operacaoPoco').value,
        atividade: document.getElementById('operacaoAtividade').value,
        inicio: document.getElementById('operacaoInicio').value,
        fim: document.getElementById('operacaoFim').value,
        volume: document.getElementById('operacaoVolume').value,
        temperatura: document.getElementById('operacaoTemperatura').value,
        pressao: document.getElementById('operacaoPressao').value,
        observacao: document.getElementById('operacaoObservacao').value
    };

    localStorage.setItem('ucaq_operacao', JSON.stringify(operacao));

    document.getElementById('operacaoSalva').innerHTML = `
        <div class="success-message">
            <p>✅ Dados da operação salvos com sucesso!</p>
        </div>
    `;
}

function salvarAguardo() {
    const aguardo = {
        poco: document.getElementById('aguardoPoco').value,
        motivo: document.getElementById('aguardoMotivo').value,
        inicio: document.getElementById('aguardoInicio').value,
        fim: document.getElementById('aguardoFim').value
    };

    localStorage.setItem('ucaq_aguardo', JSON.stringify(aguardo));

    document.getElementById('aguardoSalvo').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de aguardo salvos com sucesso!</p>
        </div>
    `;
}

function salvarMobilizacao() {
    const mobilizacao = {
        poco: document.getElementById('mobilizacaoPoco').value,
        atividade: document.getElementById('mobilizacaoAtividade').value,
        inicio: document.getElementById('mobilizacaoInicio').value,
        fim: document.getElementById('mobilizacaoFim').value
    };

    localStorage.setItem('ucaq_mobilizacao', JSON.stringify(mobilizacao));

    document.getElementById('mobilizacaoSalva').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de mobilização salvos com sucesso!</p>
        </div>
    `;
}

function salvarDesmobilizacao() {
    const desmobilizacao = {
        poco: document.getElementById('desmobilizacaoPoco').value,
        atividade: document.getElementById('desmobilizacaoAtividade').value,
        inicio: document.getElementById('desmobilizacaoInicio').value,
        fim: document.getElementById('desmobilizacaoFim').value
    };

    localStorage.setItem('ucaq_desmobilizacao', JSON.stringify(desmobilizacao));

    document.getElementById('desmobilizacaoSalva').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de desmobilização salvos com sucesso!</p>
        </div>
    `;
}

function salvarAbastecimento() {
    const abastecimento = {
        poco: document.getElementById('abastecimentoPoco').value,
        tipo: document.getElementById('abastecimentoTipo').value,
        inicio: document.getElementById('abastecimentoInicio').value,
        fim: document.getElementById('abastecimentoFim').value
    };

    localStorage.setItem('ucaq_abastecimento', JSON.stringify(abastecimento));

    document.getElementById('abastecimentoSalvo').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de abastecimento salvos com sucesso!</p>
        </div>
    `;
}

function salvarRepouso() {
    const repouso = {
        poco: document.getElementById('repousoPoco').value,
        motivo: document.getElementById('repousoMotivo').value,
        inicio: document.getElementById('repousoInicio').value,
        fim: document.getElementById('repousoFim').value
    };

    localStorage.setItem('ucaq_repouso', JSON.stringify(repouso));

    document.getElementById('repousoSalvo').innerHTML = `
        <div class="success-message">
            <p>✅ Dados de repouso salvos com sucesso!</p>
        </div>
    `;
}

// Funções de inicialização de cada página
function initHomePage() {
    renderLogs();
}

function initRelatorioPage() {
    renderRelatorio();

    // Configurar o botão de limpar relatório
    document.getElementById('btnLimparRelatorio').addEventListener('click', function () {
        if (confirm('Tem certeza que deseja limpar todos os dados do relatório?')) {
            localStorage.removeItem('ucaq_equipe');
            localStorage.removeItem('ucaq_deslocamento');
            localStorage.removeItem('ucaq_operacao');
            localStorage.removeItem('ucaq_aguardo');
            localStorage.removeItem('ucaq_mobilizacao');
            localStorage.removeItem('ucaq_desmobilizacao');
            localStorage.removeItem('ucaq_abastecimento');
            localStorage.removeItem('ucaq_repouso');

            alert('Relatório limpo com sucesso!');
            renderRelatorio();
        }
    });
}

// Função para renderizar o relatório
function renderRelatorio() {
    // Carregar dados
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));
    const desloc = JSON.parse(localStorage.getItem('ucaq_deslocamento'));
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao'));
    const aguardo = JSON.parse(localStorage.getItem('ucaq_aguardo'));
    const mobilizacao = JSON.parse(localStorage.getItem('ucaq_mobilizacao'));
    const desmobilizacao = JSON.parse(localStorage.getItem('ucaq_desmobilizacao'));
    const abastecimento = JSON.parse(localStorage.getItem('ucaq_abastecimento'));
    const repouso = JSON.parse(localStorage.getItem('ucaq_repouso'));

    // Estilo inline para os cards (garante formatação no PDF)
    const cardStyle = "background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-bottom:12px;box-sizing:border-box;font-size:1.05em;line-height:1.6;box-shadow:0 1px 4px #0001;";

    let html = '';
    html += `<div style='margin-top:10px;'>`;

    // Card Equipe
    if (equipe) {
        html += `<div style='${cardStyle}'>
            <strong>Equipe</strong><br>
            <strong>Operador:</strong> ${equipe.operador}<br>
            <strong>Auxiliar:</strong> ${equipe.auxiliar}<br>
            <strong>Data:</strong> ${equipe.data ? equipe.data.split('-').reverse().join('/') : ''}<br>
            <strong>Poço:</strong> ${equipe.poco}
        </div>`;
    }

    // Card Deslocamento
    if (desloc) {
        html += `<div style='${cardStyle}'>
            <strong>Deslocamento</strong><br>
            <strong>Poço:</strong> ${desloc.poco}<br>
            <strong>Origem:</strong> ${desloc.origem}<br>
            <strong>Destino:</strong> ${desloc.destino}<br>
            <strong>Hora Inicial:</strong> ${desloc.inicio}<br>
            <strong>Hora Final:</strong> ${desloc.fim}<br>
            <strong>KM Inicial:</strong> ${desloc.kmInicio}<br>
            <strong>KM Final:</strong> ${desloc.kmFim}
        </div>`;
    }

    // Card Operação
    if (operacao) {
        html += `<div style='${cardStyle}'>
            <strong>Operação</strong><br>
            <strong>Poço:</strong> ${operacao.poco}<br>
            <strong>Atividade:</strong> ${operacao.atividade}<br>
            <strong>Hora Inicial:</strong> ${operacao.inicio}<br>
            <strong>Hora Final:</strong> ${operacao.fim}<br>
            ${operacao.volume ? `<strong>Volume:</strong> ${operacao.volume} bbl<br>` : ''}
            ${operacao.temperatura ? `<strong>Temperatura:</strong> ${operacao.temperatura} °C<br>` : ''}
            ${operacao.pressao ? `<strong>Pressão:</strong> ${operacao.pressao} psi<br>` : ''}
            ${operacao.observacao ? `<strong>Observação:</strong> ${operacao.observacao}` : ''}
        </div>`;
    }

    // Card Aguardo
    if (aguardo) {
        html += `<div style='${cardStyle}'>
            <strong>Aguardo</strong><br>
            <strong>Poço:</strong> ${aguardo.poco}<br>
            <strong>Motivo:</strong> ${aguardo.motivo}<br>
            <strong>Hora Inicial:</strong> ${aguardo.inicio}<br>
            <strong>Hora Final:</strong> ${aguardo.fim}
        </div>`;
    }

    // Card Mobilização
    if (mobilizacao) {
        html += `<div style='${cardStyle}'>
            <strong>Mobilização</strong><br>
            <strong>Poço:</strong> ${mobilizacao.poco}<br>
            <strong>Atividade:</strong> ${mobilizacao.atividade}<br>
            <strong>Hora Inicial:</strong> ${mobilizacao.inicio}<br>
            <strong>Hora Final:</strong> ${mobilizacao.fim}
        </div>`;
    }

    // Card Desmobilização
    if (desmobilizacao) {
        html += `<div style='${cardStyle}'>
            <strong>Desmobilização</strong><br>
            <strong>Poço:</strong> ${desmobilizacao.poco}<br>
            <strong>Atividade:</strong> ${desmobilizacao.atividade}<br>
            <strong>Hora Inicial:</strong> ${desmobilizacao.inicio}<br>
            <strong>Hora Final:</strong> ${desmobilizacao.fim}
        </div>`;
    }

    // Card Abastecimento
    if (abastecimento) {
        html += `<div style='${cardStyle}'>
            <strong>Abastecimento</strong><br>
            <strong>Poço:</strong> ${abastecimento.poco}<br>
            <strong>Tipo:</strong> ${abastecimento.tipo}<br>
            <strong>Hora Inicial:</strong> ${abastecimento.inicio}<br>
            <strong>Hora Final:</strong> ${abastecimento.fim}
        </div>`;
    }

    // Card Repouso
    if (repouso) {
        html += `<div style='${cardStyle}'>
            <strong>Repouso/Alimentação</strong><br>
            <strong>Poço:</strong> ${repouso.poco}<br>
            <strong>Motivo:</strong> ${repouso.motivo}<br>
            <strong>Hora Inicial:</strong> ${repouso.inicio}<br>
            <strong>Hora Final:</strong> ${repouso.fim}
        </div>`;
    }

    html += `</div>`;

    if (!equipe && !desloc && !operacao && !aguardo && !mobilizacao && !desmobilizacao && !abastecimento && !repouso) {
        html = `<div style="text-align:center;padding:20px;color:#666;">
            <i class="fa-solid fa-clipboard-list" style="font-size:3rem;color:#ddd;margin-bottom:15px;"></i>
            <p>Nenhum dado registrado ainda.</p>
            <p>Preencha os formulários nas outras telas para visualizar o relatório completo.</p>
        </div>`;
    }

    document.getElementById('relatorioConteudo').innerHTML = html;
}

// Função para renderizar os registros na home
function renderLogs() {
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao'));

    if (equipe) {
        const dataFormatada = equipe.data ? equipe.data.split('-').reverse().join('/') : '';
        document.getElementById('ultimoRegistroCard').innerHTML = `
            <div class="card-info">
                <div class="card-title">Última Equipe</div>
                <div class="card-body">
                    <strong>Operador:</strong> ${equipe.operador}<br>
                    <strong>Auxiliar:</strong> ${equipe.auxiliar}<br>
                    <strong>Data:</strong> ${dataFormatada}<br>
                    <strong>Poço:</strong> ${equipe.poco}
                </div>
            </div>
        `;
    } else {
        document.getElementById('ultimoRegistroCard').innerHTML = `
            <div class="card-info">
                <div class="card-title">Equipe</div>
                <div class="card-body">
                    Nenhum registro de equipe encontrado.
                </div>
            </div>
        `;
    }

    const logList = document.getElementById('logList');
    logList.innerHTML = '';

    if (operacao) {
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `
            <div class="log-header">
                <span class="log-title">Operação em ${operacao.poco}</span>
                <span class="log-date">${operacao.inicio} - ${operacao.fim}</span>
            </div>
            <div class="log-body">
                <strong>Atividade:</strong> ${operacao.atividade}<br>
                ${operacao.volume ? `<strong>Volume:</strong> ${operacao.volume} bbl<br>` : ''}
                ${operacao.temperatura ? `<strong>Temperatura:</strong> ${operacao.temperatura} °C<br>` : ''}
                ${operacao.pressao ? `<strong>Pressão:</strong> ${operacao.pressao} psi<br>` : ''}
            </div>
            <div class="log-actions">
                <button onclick="showScreen('operacoes')">Editar</button>
                <button onclick="showDetails('operacao')">Detalhes</button>
            </div>
        `;
        logList.appendChild(logItem);
    } else {
        const emptyLog = document.createElement('div');
        emptyLog.className = 'empty-log';
        emptyLog.innerHTML = `
            <p>Nenhuma operação registrada.</p>
            <button onclick="showScreen('operacoes')">Registrar Operação</button>
        `;
        logList.appendChild(emptyLog);
    }
}

// Função para mostrar detalhes de um registro
function showDetails(type) {
    const data = JSON.parse(localStorage.getItem(`ucaq_${type}`));
    let html = '';

    if (data) {
        const cardStyle = "background:#f5f5f5;padding:15px;border-radius:8px;margin-bottom:20px;";

        if (type === 'operacao') {
            html = `
                <div style="${cardStyle}">
                    <h2>Detalhes da Operação</h2>
                    <p><strong>Poço:</strong> ${data.poco}</p>
                    <p><strong>Atividade:</strong> ${data.atividade}</p>
                    <p><strong>Hora Inicial:</strong> ${data.inicio}</p>
                    <p><strong>Hora Final:</strong> ${data.fim}</p>
                    ${data.volume ? `<p><strong>Volume:</strong> ${data.volume} bbl</p>` : ''}
                    ${data.temperatura ? `<p><strong>Temperatura:</strong> ${data.temperatura} °C</p>` : ''}
                    ${data.pressao ? `<p><strong>Pressão:</strong> ${data.pressao} psi</p>` : ''}
                    ${data.observacao ? `<p><strong>Observação:</strong> ${data.observacao}</p>` : ''}
                </div>
            `;
        }
    } else {
        html = '<p>Nenhum dado encontrado para este registro.</p>';
    }

    document.getElementById('detailsContent').innerHTML = html;
    showScreen('details');
}

// Carregar a página inicial quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function () {
    // Carregar a página inicial
    showScreen('home');
});
