// Este arquivo é responsável por garantir a integração entre o main.js e o relatório.js
// Quando um novo item é adicionado, ele deve ser salvo tanto no localStorage individual quanto no array correspondente

// Função para salvar um item em ambos os formatos
function salvarItemEmAmbosFormatos(itemIndividual, arrayKey, item) {
    // Obter o array atual
    let array = JSON.parse(localStorage.getItem(arrayKey)) || [];

    // Adicionar timestamp ao item para filtragem por data
    item.timestamp = new Date().toISOString();

    // Adicionar o item ao array
    array.push(item);

    // Salvar o array atualizado
    localStorage.setItem(arrayKey, JSON.stringify(array));
}

// Interceptar os eventos de salvamento

// 1. Interceptar o salvamento de equipe
const originalSalvarEquipe = window.salvarEquipe;
window.salvarEquipe = function () {
    // Chamar a função original
    originalSalvarEquipe.apply(this, arguments);

    // Obter dados da equipe
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe'));
    if (equipe) {
        // Converter para o formato de array
        const teamData = {
            operator: equipe.operador,
            assistant: equipe.auxiliar,
            well: equipe.poco,
            date: new Date().toISOString()
        };

        // Salvar no formato de array
        localStorage.setItem('teamData', JSON.stringify(teamData));
    }
};

// 2. Interceptar o salvamento de deslocamento
const originalSalvarDeslocamento = window.salvarDeslocamento;
window.salvarDeslocamento = function () {
    // Chamar a função original
    originalSalvarDeslocamento.apply(this, arguments);

    // Obter dados do deslocamento
    const deslocamento = JSON.parse(localStorage.getItem('ucaq_deslocamento'));
    if (deslocamento) {
        // Converter para o formato de array
        const item = {
            origin: deslocamento.origem,
            destination: deslocamento.destino,
            startTime: deslocamento.inicio,
            endTime: deslocamento.fim,
            odometerStart: parseFloat(deslocamento.kmInicio) || 0,
            odometerEnd: parseFloat(deslocamento.kmFim) || 0,
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_deslocamento', 'displacements', item);
    }
};

// 3. Interceptar o salvamento de operação
const originalSalvarOperacao = window.salvarOperacao;
window.salvarOperacao = function () {
    // Chamar a função original
    originalSalvarOperacao.apply(this, arguments);

    // Obter dados da operação
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao'));
    if (operacao) {
        // Converter para o formato de array
        const item = {
            servico: operacao.atividade,
            startTime: operacao.inicio,
            endTime: operacao.fim,
            volume: operacao.volume,
            temperature: operacao.temperatura,
            pressure: operacao.pressao,
            observation: operacao.status,
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_operacao', 'operations', item);
    }
};

// 4. Interceptar o salvamento de aguardo
const originalSalvarAguardo = window.salvarAguardo;
window.salvarAguardo = function () {
    // Chamar a função original
    originalSalvarAguardo.apply(this, arguments);

    // Obter dados do aguardo
    const aguardo = JSON.parse(localStorage.getItem('ucaq_aguardo'));
    if (aguardo) {
        // Converter para o formato de array
        const item = {
            reason: aguardo.motivo,
            startTime: aguardo.inicio,
            endTime: aguardo.fim,
            duration: aguardo.tempoAguardando || "N/A",
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_aguardo', 'waitings', item);
    }
};

// 5. Interceptar o salvamento de mobilização
const originalSalvarMobilizacao = window.salvarMobilizacao;
window.salvarMobilizacao = function () {
    // Chamar a função original
    originalSalvarMobilizacao.apply(this, arguments);

    // Obter dados da mobilização
    const mobilizacao = JSON.parse(localStorage.getItem('ucaq_mobilizacao'));
    if (mobilizacao) {
        // Converter para o formato de array
        const item = {
            activity: mobilizacao.atividade,
            startTime: mobilizacao.inicio,
            endTime: mobilizacao.fim,
            duration: calcularDuracao(mobilizacao.inicio, mobilizacao.fim),
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_mobilizacao', 'mobilizations', item);
    }
};

// 6. Interceptar o salvamento de desmobilização
const originalSalvarDesmobilizacao = window.salvarDesmobilizacao;
window.salvarDesmobilizacao = function () {
    // Chamar a função original
    originalSalvarDesmobilizacao.apply(this, arguments);

    // Obter dados da desmobilização
    const desmobilizacao = JSON.parse(localStorage.getItem('ucaq_desmobilizacao'));
    if (desmobilizacao) {
        // Converter para o formato de array
        const item = {
            activity: desmobilizacao.atividade,
            startTime: desmobilizacao.inicio,
            endTime: desmobilizacao.fim,
            duration: calcularDuracao(desmobilizacao.inicio, desmobilizacao.fim),
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_desmobilizacao', 'demobilizations', item);
    }
};

// 7. Interceptar o salvamento de abastecimento
const originalSalvarAbastecimento = window.salvarAbastecimento;
window.salvarAbastecimento = function () {
    // Chamar a função original
    originalSalvarAbastecimento.apply(this, arguments);

    // Obter dados do abastecimento
    const abastecimento = JSON.parse(localStorage.getItem('ucaq_abastecimento'));
    if (abastecimento) {
        // Converter para o formato de array
        const item = {
            supplyType: abastecimento.tipo,
            quantity: 0, // O formato original não tinha quantidade
            startTime: abastecimento.inicio,
            endTime: abastecimento.fim,
            duration: calcularDuracao(abastecimento.inicio, abastecimento.fim),
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_abastecimento', 'supplies', item);
    }
};

// 8. Interceptar o salvamento de alimentação
const originalSalvarAlimentacao = window.salvarAlimentacao;
window.salvarAlimentacao = function () {
    // Chamar a função original
    if (originalSalvarAlimentacao) {
        originalSalvarAlimentacao.apply(this, arguments);
    }

    // Obter dados da alimentação
    const alimentacao = JSON.parse(localStorage.getItem('ucaq_alimentacao'));
    if (alimentacao) {
        // Converter para o formato de array
        const item = {
            reason: alimentacao.motivo,
            startTime: alimentacao.inicio,
            endTime: alimentacao.fim,
            duration: calcularDuracao(alimentacao.inicio, alimentacao.fim),
            timestamp: new Date().toISOString()
        };

        // Salvar no array
        salvarItemEmAmbosFormatos('ucaq_alimentacao', 'meals', item);
    }
};

// Função auxiliar para calcular duração
function calcularDuracao(inicio, fim) {
    if (!inicio || !fim) return "N/A";

    try {
        if (/^\d{2}:\d{2}$/.test(inicio) && /^\d{2}:\d{2}$/.test(fim)) {
            const [h1, m1] = inicio.split(':').map(Number);
            const [h2, m2] = fim.split(':').map(Number);
            let min = (h2 * 60 + m2) - (h1 * 60 + m1);
            if (min < 0) min += 24 * 60;
            const horas = Math.floor(min / 60);
            const minutos = min % 60;
            return `${horas}h ${minutos}min`;
        }
    } catch (e) {
        console.error("Erro ao calcular duração:", e);
    }

    return "N/A";
}

// Inicializar após o carregamento do documento
document.addEventListener('DOMContentLoaded', function () {
    console.log("Integração entre main.js e relatorio.js inicializada");
});
