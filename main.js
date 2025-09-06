// --- Funções Aguardo ---
function salvarAguardo() {
    const poco = document.getElementById('aguardoPoco').value.trim();
    const motivo = document.getElementById('aguardoMotivo').value.trim();
    const inicio = document.getElementById('aguardoInicio').value.trim();
    const fim = document.getElementById('aguardoFim').value.trim();
    if (!poco || !motivo || !inicio || !fim) {
        alert('Preencha todos os campos do aguardo!');
        return;
    }
    let tempoAguardando = '';
    if (/^\d{2}:\d{2}$/.test(inicio) && /^\d{2}:\d{2}$/.test(fim)) {
        const [h1, m1] = inicio.split(':').map(Number);
        const [h2, m2] = fim.split(':').map(Number);
        let min = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (min < 0) min += 24 * 60;
        const horas = Math.floor(min / 60);
        const minutos = min % 60;
        tempoAguardando = `${horas}h ${minutos}min`;
    }
    const aguardo = {
        poco,
        motivo,
        inicio,
        fim,
        tempoAguardando,
        timestamp: new Date().toISOString()
    };

    // Tenta salvar no SQLite e no localStorage
    saveData('aguardo', 'ucaq_aguardo', aguardo).then(() => {
        renderAguardoSalvo();
        alert('Aguardo salvo com sucesso!');
        document.getElementById('aguardoPoco').value = '';
        document.getElementById('aguardoMotivo').value = '';
        document.getElementById('aguardoInicio').value = '';
        document.getElementById('aguardoFim').value = '';
    }).catch(error => {
        console.error('Erro ao salvar aguardo:', error);
        alert('Ocorreu um erro ao salvar. Tente novamente.');
    });
}
function renderAguardoSalvo() {
    const div = document.getElementById('aguardoSalvo');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const a = JSON.parse(localStorage.getItem('ucaq_aguardo'));
    if (a) {
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposAguardo()">
                <strong>Poço:</strong> ${a.poco}<br>
                <strong>Motivo:</strong> ${a.motivo}<br>
                <strong>Hora Início:</strong> ${a.inicio}<br>
                <strong>Hora Fim:</strong> ${a.fim}<br>
                <strong>Tempo Aguardando:</strong> ${a.tempoAguardando || '-'}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposAguardo() {
    const a = JSON.parse(localStorage.getItem('ucaq_aguardo'));
    if (a) {
        document.getElementById('aguardoPoco').value = a.poco;
        document.getElementById('aguardoMotivo').value = a.motivo;
        document.getElementById('aguardoInicio').value = a.inicio;
        document.getElementById('aguardoFim').value = a.fim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('aguardoSalvo')) {
        renderAguardoSalvo();
    }
});

// --- Funções Mobilização ---
function salvarMobilizacao() {
    const poco = document.getElementById('mobilizacaoPoco').value.trim();
    const atividade = document.getElementById('mobilizacaoAtividade').value.trim();
    const inicio = document.getElementById('mobilizacaoInicio').value.trim();
    const fim = document.getElementById('mobilizacaoFim').value.trim();
    if (!poco || !atividade || !inicio || !fim) {
        alert('Preencha todos os campos da mobilização!');
        return;
    }
    const mobilizacao = { poco, atividade, inicio, fim };
    localStorage.setItem('ucaq_mobilizacao', JSON.stringify(mobilizacao));
    renderMobilizacaoSalva();
    alert('Mobilização salva com sucesso!');
    document.getElementById('mobilizacaoPoco').value = '';
    document.getElementById('mobilizacaoAtividade').value = '';
    document.getElementById('mobilizacaoInicio').value = '';
    document.getElementById('mobilizacaoFim').value = '';
}
function renderMobilizacaoSalva() {
    const div = document.getElementById('mobilizacaoSalva');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const m = JSON.parse(localStorage.getItem('ucaq_mobilizacao'));
    if (m) {
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposMobilizacao()">
                <strong>Poço:</strong> ${m.poco}<br>
                <strong>Atividade:</strong> ${m.atividade}<br>
                <strong>Hora Início:</strong> ${m.inicio}<br>
                <strong>Hora Fim:</strong> ${m.fim}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposMobilizacao() {
    const m = JSON.parse(localStorage.getItem('ucaq_mobilizacao'));
    if (m) {
        document.getElementById('mobilizacaoPoco').value = m.poco;
        document.getElementById('mobilizacaoAtividade').value = m.atividade;
        document.getElementById('mobilizacaoInicio').value = m.inicio;
        document.getElementById('mobilizacaoFim').value = m.fim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('mobilizacaoSalva')) {
        renderMobilizacaoSalva();
    }
});

// --- Funções Desmobilização ---
function salvarDesmobilizacao() {
    const poco = document.getElementById('desmobilizacaoPoco').value.trim();
    const atividade = document.getElementById('desmobilizacaoAtividade').value.trim();
    const inicio = document.getElementById('desmobilizacaoInicio').value.trim();
    const fim = document.getElementById('desmobilizacaoFim').value.trim();
    if (!poco || !atividade || !inicio || !fim) {
        alert('Preencha todos os campos da desmobilização!');
        return;
    }
    const desmobilizacao = { poco, atividade, inicio, fim };
    localStorage.setItem('ucaq_desmobilizacao', JSON.stringify(desmobilizacao));
    renderDesmobilizacaoSalva();
    alert('Desmobilização salva com sucesso!');
    document.getElementById('desmobilizacaoPoco').value = '';
    document.getElementById('desmobilizacaoAtividade').value = '';
    document.getElementById('desmobilizacaoInicio').value = '';
    document.getElementById('desmobilizacaoFim').value = '';
}
function renderDesmobilizacaoSalva() {
    const div = document.getElementById('desmobilizacaoSalva');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const d = JSON.parse(localStorage.getItem('ucaq_desmobilizacao'));
    if (d) {
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposDesmobilizacao()">
                <strong>Poço:</strong> ${d.poco}<br>
                <strong>Atividade:</strong> ${d.atividade}<br>
                <strong>Hora Início:</strong> ${d.inicio}<br>
                <strong>Hora Fim:</strong> ${d.fim}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposDesmobilizacao() {
    const d = JSON.parse(localStorage.getItem('ucaq_desmobilizacao'));
    if (d) {
        document.getElementById('desmobilizacaoPoco').value = d.poco;
        document.getElementById('desmobilizacaoAtividade').value = d.atividade;
        document.getElementById('desmobilizacaoInicio').value = d.inicio;
        document.getElementById('desmobilizacaoFim').value = d.fim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('desmobilizacaoSalva')) {
        renderDesmobilizacaoSalva();
    }
});

// --- Funções Abastecimento ---
function salvarAbastecimento() {
    const poco = document.getElementById('abastecimentoPoco').value.trim();
    const tipo = document.getElementById('abastecimentoTipo').value.trim();
    const inicio = document.getElementById('abastecimentoInicio').value.trim();
    const fim = document.getElementById('abastecimentoFim').value.trim();
    if (!poco || !tipo || !inicio || !fim) {
        alert('Preencha todos os campos do abastecimento!');
        return;
    }
    const abastecimento = { poco, tipo, inicio, fim };
    localStorage.setItem('ucaq_abastecimento', JSON.stringify(abastecimento));
    renderAbastecimentoSalvo();
    alert('Abastecimento salvo com sucesso!');
    document.getElementById('abastecimentoPoco').value = '';
    document.getElementById('abastecimentoTipo').value = '';
    document.getElementById('abastecimentoInicio').value = '';
    document.getElementById('abastecimentoFim').value = '';
}
function renderAbastecimentoSalvo() {
    const div = document.getElementById('abastecimentoSalvo');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const a = JSON.parse(localStorage.getItem('ucaq_abastecimento'));
    if (a) {
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposAbastecimento()">
                <strong>Poço:</strong> ${a.poco}<br>
                <strong>Tipo:</strong> ${a.tipo}<br>
                <strong>Hora Início:</strong> ${a.inicio}<br>
                <strong>Hora Fim:</strong> ${a.fim}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposAbastecimento() {
    const a = JSON.parse(localStorage.getItem('ucaq_abastecimento'));
    if (a) {
        document.getElementById('abastecimentoPoco').value = a.poco;
        document.getElementById('abastecimentoTipo').value = a.tipo;
        document.getElementById('abastecimentoInicio').value = a.inicio;
        document.getElementById('abastecimentoFim').value = a.fim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('abastecimentoSalvo')) {
        renderAbastecimentoSalvo();
    }
});

// --- Funções Repouso ---
function salvarRepouso() {
    const poco = document.getElementById('repousoPoco').value.trim();
    const motivo = document.getElementById('repousoMotivo').value.trim();
    const inicio = document.getElementById('repousoInicio').value.trim();
    const fim = document.getElementById('repousoFim').value.trim();
    if (!poco || !motivo || !inicio || !fim) {
        alert('Preencha todos os campos do repouso!');
        return;
    }
    const repouso = { poco, motivo, inicio, fim };
    localStorage.setItem('ucaq_repouso', JSON.stringify(repouso));
    renderRepousoSalvo();
    alert('Repouso salvo com sucesso!');
    document.getElementById('repousoPoco').value = '';
    document.getElementById('repousoInicio').value = '';
    document.getElementById('repousoFim').value = '';
}
function renderRepousoSalvo() {
    const div = document.getElementById('repousoSalvo');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const r = JSON.parse(localStorage.getItem('ucaq_repouso'));
    if (r) {
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposRepouso()">
                <strong>Poço:</strong> ${r.poco}<br>
                <strong>Motivo:</strong> ${r.motivo}<br>
                <strong>Hora Início:</strong> ${r.inicio}<br>
                <strong>Hora Fim:</strong> ${r.fim}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposRepouso() {
    const r = JSON.parse(localStorage.getItem('ucaq_repouso'));
    if (r) {
        document.getElementById('repousoPoco').value = r.poco;
        document.getElementById('repousoMotivo').value = r.motivo;
        document.getElementById('repousoInicio').value = r.inicio;
        document.getElementById('repousoFim').value = r.fim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('repousoSalvo')) {
        renderRepousoSalvo();
    }
});
// --- Funções da Home ---
function renderUltimoRegistro() {
    const div = document.getElementById('ultimoRegistroCard');
    if (!div) return;
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao'));
    if (operacao) {
        div.innerHTML = `
        <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin:14px 0 0 0;box-shadow:0 1px 4px #0001;">
            <strong>Última Operação</strong><br>
            <strong>Poço:</strong> ${operacao.poco || '-'}<br>
            <strong>Status:</strong> ${operacao.status ? operacao.status : 'Normal'}<br>
            <strong>Serviço:</strong> ${operacao.atividade || '-'}<br>
            <strong>Hora Início:</strong> ${operacao.inicio || '-'}<br>
            <strong>Hora Fim:</strong> ${operacao.fim || '-'}<br>
            <strong>Volume:</strong> ${operacao.volume ? operacao.volume + ' bbl' : '-'}<br>
            <strong>Temperatura:</strong> ${operacao.temperatura ? operacao.temperatura + ' °C' : '-'}<br>
            <strong>Pressão:</strong> ${operacao.pressao ? operacao.pressao + ' psi' : '-'}
        </div>
        `;
    } else {
        div.innerHTML = `<div style='color:#888;font-size:1em;margin:14px 0 0 0;'>Nenhuma operação salva ainda.</div>`;
    }
}
document.addEventListener('DOMContentLoaded', renderUltimoRegistro);
(function () {
    var oldShowScreen = window.showScreen;
    window.showScreen = function (screen) {
        if (typeof oldShowScreen === 'function') oldShowScreen(screen);
        if (screen === 'home') renderUltimoRegistro();
    };
})();

// --- Funções da Equipe ---
function salvarEquipe() {
    const operador = document.getElementById('equipeOperador').value.trim();
    const auxiliar = document.getElementById('equipeAuxiliar').value.trim();
    const data = document.getElementById('equipeData').value;
    const poco = document.getElementById('equipePoco').value.trim();
    if (!operador || !auxiliar || !data || !poco) {
        alert('Preencha todos os campos da equipe!');
        return;
    }
    const equipe = { operador, auxiliar, data, poco };
    localStorage.setItem('ucaq_equipe', JSON.stringify(equipe));
    renderEquipeSalva();
    alert('Equipe salva com sucesso!');
}
function renderEquipeSalva() {
    const divEquipeSalva = document.getElementById('equipeSalva');
    if (!divEquipeSalva) return; // Verifica se o elemento existe antes de prosseguir

    divEquipeSalva.innerHTML = '';
    const equipeDiv = document.getElementById('equipeLista');
    if (!equipeDiv) return; // Verifica se o elemento existe antes de prosseguir

    equipeDiv.innerHTML = '';
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));
    if (equipe) {
        equipeDiv.innerHTML = `
        <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposEquipe()">
            <strong>Operador:</strong> ${equipe.operador}<br>
            <strong>Auxiliar:</strong> ${equipe.auxiliar}<br>
            <strong>Data:</strong> ${equipe.data.split('-').reverse().join('/')}<br>
            <strong>Poço:</strong> ${equipe.poco}
            <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
        </div>
        `;
    }
}
function preencherCamposEquipe() {
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));
    if (equipe) {
        document.getElementById('equipeOperador').value = equipe.operador;
        document.getElementById('equipeAuxiliar').value = equipe.auxiliar;
        document.getElementById('equipeData').value = equipe.data;
        document.getElementById('equipePoco').value = equipe.poco;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('equipeSalva') || document.getElementById('equipeLista')) {
        renderEquipeSalva();
    }
});

// --- Funções do Deslocamento ---
function salvarDeslocamento() {
    const poco = document.getElementById('deslocPoco').value.trim();
    const origem = document.getElementById('deslocOrigem').value.trim();
    const destino = document.getElementById('deslocDestino').value.trim();
    const inicio = document.getElementById('deslocInicio').value.trim();
    const fim = document.getElementById('deslocFim').value.trim();
    const kmInicio = document.getElementById('deslocKmInicio').value.trim();
    const kmFim = document.getElementById('deslocKmFim').value.trim();
    if (!poco || !origem || !destino || !inicio || !fim || !kmInicio || !kmFim) {
        alert('Preencha todos os campos do deslocamento!');
        return;
    }
    const deslocamento = { poco, origem, destino, inicio, fim, kmInicio, kmFim };
    localStorage.setItem('ucaq_deslocamento', JSON.stringify(deslocamento));
    renderDeslocamentoSalvo();
    alert('Deslocamento salvo com sucesso!');
    document.getElementById('deslocPoco').value = '';
    document.getElementById('deslocOrigem').value = '';
    document.getElementById('deslocDestino').value = '';
    document.getElementById('deslocInicio').value = '';
    document.getElementById('deslocFim').value = '';
    document.getElementById('deslocKmInicio').value = '';
    document.getElementById('deslocKmFim').value = '';
}
function renderDeslocamentoSalvo() {
    const div = document.getElementById('deslocamentoSalvo');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const d = JSON.parse(localStorage.getItem('ucaq_deslocamento'));
    if (d) {
        let kmPercorrido = '';
        if (!isNaN(parseFloat(d.kmInicio)) && !isNaN(parseFloat(d.kmFim))) {
            kmPercorrido = (parseFloat(d.kmFim) - parseFloat(d.kmInicio)).toFixed(2) + ' km';
        }
        div.innerHTML = `
            <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposDeslocamento()">
                <strong>Poço:</strong> ${d.poco}<br>
                <strong>Origem:</strong> ${d.origem}<br>
                <strong>Destino:</strong> ${d.destino}<br>
                <strong>Hora Inicial:</strong> ${d.inicio}<br>
                <strong>Hora Final:</strong> ${d.fim}<br>
                <strong>KM Inicial:</strong> ${d.kmInicio}<br>
                <strong>KM Final:</strong> ${d.kmFim}<br>
                <strong>KM Percorrido:</strong> ${kmPercorrido}
                <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
            </div>
        `;
    }
}
function preencherCamposDeslocamento() {
    const d = JSON.parse(localStorage.getItem('ucaq_deslocamento'));
    if (d) {
        document.getElementById('deslocPoco').value = d.poco;
        document.getElementById('deslocOrigem').value = d.origem;
        document.getElementById('deslocDestino').value = d.destino;
        document.getElementById('deslocInicio').value = d.inicio;
        document.getElementById('deslocFim').value = d.fim;
        document.getElementById('deslocKmInicio').value = d.kmInicio;
        document.getElementById('deslocKmFim').value = d.kmFim;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('deslocamentoSalvo')) {
        renderDeslocamentoSalvo();
    }
});

// --- Funções da Operação ---
function salvarOperacao() {
    const poco = document.getElementById('operacaoPoco').value.trim();
    const atividade = document.getElementById('operacaoAtividade').value.trim();
    const inicio = document.getElementById('operacaoInicio').value.trim();
    const fim = document.getElementById('operacaoFim').value.trim();
    const volume = document.getElementById('operacaoVolume').value.trim();
    const temperatura = document.getElementById('operacaoTemperatura').value.trim();
    const pressao = document.getElementById('operacaoPressao').value.trim();
    const observacao = document.getElementById('operacaoObservacao').value.trim();
    if (!poco || !atividade || !inicio || !fim) {
        alert('Preencha os campos obrigatórios da operação!');
        return;
    }
    const operacao = { poco, atividade, inicio, fim, volume, temperatura, pressao, observacao, status: 'Normal' };
    localStorage.setItem('ucaq_operacao', JSON.stringify(operacao));
    renderOperacaoSalva();
    alert('Operação salva com sucesso!');
    document.getElementById('operacaoPoco').value = '';
    document.getElementById('operacaoAtividade').value = '';
    document.getElementById('operacaoInicio').value = '';
    document.getElementById('operacaoFim').value = '';
    document.getElementById('operacaoVolume').value = '';
    document.getElementById('operacaoTemperatura').value = '';
    document.getElementById('operacaoPressao').value = '';
    document.getElementById('operacaoObservacao').value = '';
}
function registrarOperacaoCancelada() {
    const poco = document.getElementById('operacaoPoco').value.trim();
    if (!poco) {
        alert('Informe o nome do poço para cancelar a operação!');
        return;
    }
    const operacaoCancelada = {
        poco: poco,
        status: 'Operação Cancelada'
    };
    localStorage.setItem('ucaq_operacao', JSON.stringify(operacaoCancelada));
    renderOperacaoSalva();
    alert('Operação cancelada registrada!');
    document.getElementById('operacaoPoco').value = '';
    document.getElementById('operacaoAtividade').value = '';
    document.getElementById('operacaoInicio').value = '';
    document.getElementById('operacaoFim').value = '';
    document.getElementById('operacaoVolume').value = '';
    document.getElementById('operacaoTemperatura').value = '';
    document.getElementById('operacaoPressao').value = '';
}
function renderOperacaoSalva() {
    const div = document.getElementById('operacaoSalva');
    if (!div) return; // Verifica se o elemento existe antes de prosseguir

    div.innerHTML = '';
    const o = JSON.parse(localStorage.getItem('ucaq_operacao'));
    if (o) {
        if (o.status === 'Operação Cancelada') {
            div.innerHTML = `
                <div class="equipe-card" style="background:#ffeaea;padding:10px 14px;border-radius:8px;margin-top:10px;">
                    <strong style='color:#e53935;'>Operação cancelada</strong><br>
                    <strong>Poço:</strong> ${o.poco}
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="equipe-card" style="background:#f5f5f5;padding:10px 14px;border-radius:8px;margin-top:10px;cursor:pointer;" onclick="preencherCamposOperacao()">
                    <strong>Poço:</strong> ${o.poco}<br>
                    <strong>Status:</strong> ${o.status ? o.status : 'Normal'}<br>
                    <strong>Atividade:</strong> ${o.atividade}<br>
                    <strong>Hora Início:</strong> ${o.inicio}<br>
                    <strong>Hora Fim:</strong> ${o.fim}<br>
                    <strong>Volume:</strong> ${o.volume ? o.volume + ' bbl' : '-'}<br>
                    <strong>Temperatura:</strong> ${o.temperatura ? o.temperatura + ' °C' : '-'}<br>
                    <strong>Pressão:</strong> ${o.pressao ? o.pressao + ' psi' : '-'}
                    <div style='font-size:0.85em;color:#1976D2;margin-top:4px;'>Clique para preencher os campos</div>
                </div>
            `;
        }
    }
}
function preencherCamposOperacao() {
    const o = JSON.parse(localStorage.getItem('ucaq_operacao'));
    if (o) {
        document.getElementById('operacaoPoco').value = o.poco;
        document.getElementById('operacaoAtividade').value = o.atividade;
        document.getElementById('operacaoInicio').value = o.inicio;
        document.getElementById('operacaoFim').value = o.fim;
        document.getElementById('operacaoVolume').value = o.volume;
        document.getElementById('operacaoTemperatura').value = o.temperatura;
        document.getElementById('operacaoPressao').value = o.pressao;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Verifica se está na página correta antes de tentar renderizar
    if (document.getElementById('operacaoSalva')) {
        renderOperacaoSalva();
    }
});

// Substituir onclick dos botões por suas funções globais
document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('#equipe .fa-user-plus')?.parentElement;
    if (btn) btn.onclick = salvarEquipe;
    var btnDesloc = document.querySelector('#deslocamento .fa-location-arrow')?.parentElement;
    if (btnDesloc) btnDesloc.onclick = salvarDeslocamento;
    var btnOperacao = document.querySelector('#operacoes .fa-plus')?.parentElement;
    if (btnOperacao) btnOperacao.onclick = salvarOperacao;
    // Aguardo, Mobilização, Desmobilização, Abastecimento, Repouso: manter lógica semelhante se necessário
});
// Função para inserir automaticamente o separador ":" ao digitar hora
function autoInsertTimeSeparator(e) {
    let v = e.target.value.replace(/[^0-9]/g, '');
    if (v.length > 2) v = v.slice(0, 4);
    if (v.length > 2) {
        v = v.slice(0, 2) + ':' + v.slice(2);
    }
    else if (v.length > 0 && v.length <= 2) {
        v = v;
    }
    e.target.value = v;
}

// Adiciona evento a todos os campos de hora
document.addEventListener('DOMContentLoaded', function () {
    const horaInputs = [
        'deslocInicio', 'deslocFim',
        'operacaoInicio', 'operacaoFim',
        'aguardoInicio', 'aguardoFim',
        'mobilizacaoInicio', 'mobilizacaoFim',
        'desmobilizacaoInicio', 'desmobilizacaoFim',
        'abastecimentoInicio', 'abastecimentoFim',
        'repousoInicio', 'repousoFim'
    ];
    horaInputs.forEach(function (id) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', autoInsertTimeSeparator);
        }
    });
});
// Menu hambúrguer mobile
function toggleDrawer() {
    var drawer = document.getElementById('drawer');
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
    } else {
        drawer.classList.add('open');
    }
}
// Initial data
const initialData = [
    {
        id: crypto.randomUUID(),
        team: 'Pedro e José',
        date: '18/07/2025',
        well: 'Pir-67',
        operations: [
            { status: 'Aguardando', activity: 'Operação de campo', startTime: '08:24', endTime: '10:13' },
            { status: 'Mobilização', activity: 'Mobilizando equipamentos', startTime: '10:13', endTime: '10:23' },
            { status: 'Operando', activity: 'Injeção na coluna', startTime: '10:23', endTime: '10:41', metrics: { volume: '5bbl', angle: '30°', pressure: '650psi' } },
            { status: 'Desmobilização', activity: 'Desmobilizando equipamentos', startTime: '10:41', endTime: '10:51' },
            { status: 'Aguardando', activity: 'Operação do Slickline', startTime: '10:51', endTime: '11:24' },
            { status: 'Deslocamento', activity: 'Pir-67 para Eppir', startTime: '11:24', endTime: '11:41', odometer: { start: '193335', end: '193341' } },
        ],
    },
    {
        id: crypto.randomUUID(),
        team: 'Pedro e José',
        date: '18/07/2025',
        well: 'Eppir',
        operations: [
            { status: 'Abastecimento', activity: 'Abastecendo de água', startTime: '11:41', endTime: '12:00' },
            { status: 'Repouso', activity: 'Equipe em almoço', startTime: '12:00', endTime: '13:00' },
            { status: 'Deslocamento', activity: 'Eppir para CSMC-12', startTime: '13:00', endTime: '14:42', odometer: { start: '193341', end: '193389' } },
        ],
    },
];

// localStorage functions
function saveData(data) {
    localStorage.setItem('operationLogs', JSON.stringify(data));
}

function loadData() {
    const data = localStorage.getItem('operationLogs');
    return data ? JSON.parse(data) : initialData;
}

// Drawer toggle
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Screen navigation

// Função global para navegação de telas
window.showScreen = function (screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    // Só fecha o drawer se for mobile
    if (window.innerWidth < 900) toggleDrawer();
    if (screenId === 'home') renderLogs();
};

// Render logs
function renderLogs() {
    const logs = loadData();
    const logList = document.getElementById('logList');
    logList.innerHTML = '';
    // Função para renderizar apenas o último registro na Home
    function renderLogList() {
        const logList = document.getElementById('logList');
        if (!window.logs || window.logs.length === 0) {
            logList.innerHTML = '<div style="text-align:center;color:#888;">Nenhum registro cadastrado ainda.</div>';
            return;
        }
        // Mostra só o último registro
        const lastIdx = window.logs.length - 1;
        const log = window.logs[lastIdx];
        logList.innerHTML = `<div class="card" onclick="showDetails(${lastIdx})">
            <strong>${log.titulo || 'Registro'}</strong><br>
            <small>${log.data || ''}</small>
        </div>`;
    }
    renderLogList();
}

// Show details
function showDetails(logId) {
    const logs = loadData();
    const log = logs.find(l => l.id === logId);
    const detailsContent = document.getElementById('detailsContent');
    detailsContent.innerHTML = `
    <p><strong>Equipe:</strong> ${log.team}</p>
    <p><strong>Data:</strong> ${log.date}</p>
    <p><strong>Poço:</strong> ${log.well}</p>
    <h3>Operações:</h3>
    ${log.operations.map(op => `
      <div class="card">
        <p><strong>Status:</strong> ${op.status}</p>
        <p><strong>Atividade:</strong> ${op.activity}</p>
        <p><strong>Horário:</strong> ${op.startTime} - ${op.endTime}</p>
        ${op.metrics ? `
          <p><strong>Métricas:</strong></p>
          <p>Volume: ${op.metrics.volume}</p>
          <p>Ângulo: ${op.metrics.angle}</p>
          <p>Pressão: ${op.metrics.pressure}</p>
        ` : ''}
        ${op.odometer ? `
          <p><strong>Odômetro:</strong> ${op.odometer.start} - ${op.odometer.end}</p>
        ` : ''}
      </div>
    `).join('')}
  `;
    showScreen('details');
}

// Add new log
function addLog() {
    const team = document.getElementById('team').value;
    const date = document.getElementById('date').value;
    const well = document.getElementById('well').value;
    const status = document.getElementById('status').value;
    const activity = document.getElementById('activity').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const volume = document.getElementById('volume').value;
    const angle = document.getElementById('angle').value;
    const pressure = document.getElementById('pressure').value;
    const odometerStart = document.getElementById('odometerStart').value;
    const odometerEnd = document.getElementById('odometerEnd').value;

    if (!team || !date || !well || !status || !activity || !startTime || !endTime) {
        alert('Preencha todos os campos obrigatórios!');
        return;
    }

    const logs = loadData();
    const newOperation = {
        status,
        activity,
        startTime,
        endTime,
        ...(volume && angle && pressure ? { metrics: { volume, angle, pressure } } : {}),
        ...(odometerStart && odometerEnd ? { odometer: { start: odometerStart, end: odometerEnd } } : {}),
    };

    const existingLog = logs.find(l => l.well === well && l.date === date);
    if (existingLog) {
        existingLog.operations.push(newOperation);
    } else {
        logs.push({
            id: crypto.randomUUID(),
            team,
            date,
            well,
            operations: [newOperation],
        });
    }


    saveData(logs);
    window.showScreen('home');
    document.querySelectorAll('.form-group input').forEach(input => input.value = '');
}

// Função global para navegação de telas
window.showScreen = function (screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    // Só fecha o drawer se for mobile
    if (window.innerWidth < 900) toggleDrawer();
    if (screenId === 'home') renderLogs();
};

// Initial render
renderLogs();
