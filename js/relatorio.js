// Função para alternar a visibilidade do menu lateral
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    drawer.classList.toggle('open');
}

// Função para formatar data no formato brasileiro
function formatDate(dateString) {
    try {
        // Se a entrada já está no formato DD/MM/YYYY, apenas retorna
        if (typeof dateString === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
            return dateString;
        }

        // Tenta converter para objeto Date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // Se não for uma data válida, retorna a string original
            return dateString;
        }

        // Ajusta o problema do fuso horário adicionando o offset local
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

        // Formata no padrão brasileiro DD/MM/YYYY
        const day = String(adjustedDate.getDate()).padStart(2, '0');
        const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
        const year = adjustedDate.getFullYear();

        return `${day}/${month}/${year}`;
    } catch (e) {
        // Se houver erro, retorna a string original
        return dateString;
    }
}

// Função para carregar dados do banco SQLite
async function loadSQLiteData(filterDate) {
    const sqliteData = {
        abastecimentos: [],
        equipes: [],
        deslocamentos: [],
        operacoes: [],
        aguardos: [],
        mobilizacoes: [],
        desmobilizacoes: [],
        alimentacoes: []
    };

    if (window.db && window.db.getAll) {
        try {
            // Carregar dados de abastecimento
            const abastecimentos = window.db.getAll('abastecimento') || [];
            sqliteData.abastecimentos = abastecimentos.filter(item =>
                item.data && item.data.split('T')[0] === filterDate
            );

            // Carregar dados de equipe
            const equipes = window.db.getAll('equipe') || [];
            sqliteData.equipes = equipes.filter(item =>
                item.data && item.data.split('T')[0] === filterDate
            );

            // Carregar dados de deslocamento
            const deslocamentos = window.db.getAll('deslocamento') || [];
            sqliteData.deslocamentos = deslocamentos.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            // Carregar dados de operação
            const operacoes = window.db.getAll('operacao') || [];
            sqliteData.operacoes = operacoes.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            // Carregar dados de aguardo
            const aguardos = window.db.getAll('aguardo') || [];
            sqliteData.aguardos = aguardos.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            // Carregar dados de mobilização
            const mobilizacoes = window.db.getAll('mobilizacao') || [];
            sqliteData.mobilizacoes = mobilizacoes.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            // Carregar dados de desmobilização
            const desmobilizacoes = window.db.getAll('desmobilizacao') || [];
            sqliteData.desmobilizacoes = desmobilizacoes.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            // Carregar dados de alimentação
            const alimentacoes = window.db.getAll('alimentacao') || [];
            sqliteData.alimentacoes = alimentacoes.filter(item =>
                item.timestamp && item.timestamp.split('T')[0] === filterDate
            );

            console.log('Dados SQLite carregados:', sqliteData);
        } catch (error) {
            console.error('Erro ao carregar dados do SQLite:', error);
        }
    }

    return sqliteData;
}

// Função para gerar um relatório baseado em uma data específica
async function generateReport() {
    // Recuperar manutenções do localStorage
    const manutencoes = JSON.parse(localStorage.getItem('manutencoes')) || [];
    const dateFilter = document.getElementById('dataFiltro').value;
    const reportList = document.getElementById('reportList');

    // Limpar relatório anterior
    reportList.innerHTML = '';

    if (!dateFilter) {
        reportList.innerHTML = '<p class="alert alert-warning">Selecione uma data para gerar o relatório.</p>';
        return;
    }

    // Criar data para filtro (apenas a parte da data, sem hora)
    const filterDate = dateFilter.split('T')[0];

    // Carregar dados do SQLite
    const sqliteData = await loadSQLiteData(filterDate);

    // Recuperar dados do localStorage - usamos tanto os arrays quanto os itens individuais
    const teamData = JSON.parse(localStorage.getItem('teamData')) || {};
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe')) || null;

    const displacements = JSON.parse(localStorage.getItem('displacements')) || [];
    const deslocamento = JSON.parse(localStorage.getItem('ucaq_deslocamento')) || null;

    const operations = JSON.parse(localStorage.getItem('operations')) || [];
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao')) || null;

    const waitings = JSON.parse(localStorage.getItem('waitings')) || [];
    const aguardo = JSON.parse(localStorage.getItem('ucaq_aguardo')) || null;

    const mobilizations = JSON.parse(localStorage.getItem('mobilizations')) || [];
    const mobilizacao = JSON.parse(localStorage.getItem('ucaq_mobilizacao')) || null;

    const demobilizations = JSON.parse(localStorage.getItem('demobilizations')) || [];
    const desmobilizacao = JSON.parse(localStorage.getItem('ucaq_desmobilizacao')) || null;

    const supplies = JSON.parse(localStorage.getItem('supplies')) || [];
    const abastecimento = JSON.parse(localStorage.getItem('ucaq_abastecimento')) || null;

    const meals = JSON.parse(localStorage.getItem('meals')) || [];
    const alimentacao = JSON.parse(localStorage.getItem('ucaq_alimentacao')) || null;

    // Filtrar itens pela data
    const filteredDisplacements = displacements.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredOperations = operations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredWaitings = waitings.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredMobilizations = mobilizations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredDemobilizations = demobilizations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredSupplies = supplies.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredMeals = meals.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);

    // Filtrar manutenções pela data
    const filteredManutencoes = manutencoes.filter(item => item.data && item.data === filterDate);

    // Verificar se existem dados para a data selecionada (incluindo os itens individuais e SQLite)
    const hasData = (
        filteredDisplacements.length > 0 ||
        filteredOperations.length > 0 ||
        filteredWaitings.length > 0 ||
        filteredMobilizations.length > 0 ||
        filteredDemobilizations.length > 0 ||
        filteredSupplies.length > 0 ||
        filteredMeals.length > 0 ||
        filteredManutencoes.length > 0 ||
        sqliteData.abastecimentos.length > 0 ||
        sqliteData.equipes.length > 0 ||
        sqliteData.deslocamentos.length > 0 ||
        sqliteData.operacoes.length > 0 ||
        sqliteData.aguardos.length > 0 ||
        sqliteData.mobilizacoes.length > 0 ||
        sqliteData.desmobilizacoes.length > 0 ||
        sqliteData.alimentacoes.length > 0 ||
        equipe !== null ||
        deslocamento !== null ||
        operacao !== null ||
        aguardo !== null ||
        mobilizacao !== null ||
        desmobilizacao !== null ||
        abastecimento !== null ||
        alimentacao !== null
    );

    if (!hasData) {
        reportList.innerHTML = '<p class="alert alert-info">Não há dados registrados para a data selecionada.</p>';
        return;
    }

    // Criar uma estrutura para agrupar todos os itens por tipo
    const allItems = [];

    // Adicionar manutenções
    filteredManutencoes.forEach((item, index) => {
        allItems.push({
            type: 'manutencao',
            data: item,
            startTime: item.horaInicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-manutencao">
                    <div class="report-card-title">
                        Manutenção ${index + 1}
                        <span>${item.horaInicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Tipo:</strong> ${item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</p>
                        <p><strong>Data:</strong> ${formatDate(item.data)}</p>
                        <p><strong>Horário:</strong> ${item.horaInicio} - ${item.horaFim}</p>
                        ${item.observacao ? `<p><strong>Observação:</strong> ${item.observacao}</p>` : ''}
                    </div>
                </div>`;
            }
        });
    });

    // Adicionar equipe (se existir)
    if (teamData && teamData.date && teamData.date.split('T')[0] === filterDate) {
        allItems.push({
            type: 'equipe',
            source: 'teamData',
            data: teamData,
            startTime: '00:00', // Default para ordenação, como é equipe aparecerá no início
            renderCard: () => {
                return `
                <div class="report-card card-equipe">
                    <div class="report-card-title">Equipe do Dia</div>
                    <div class="report-card-body">
                        <p><strong>Operador:</strong> ${teamData.operator || 'Não informado'}</p>
                        <p><strong>Auxiliar:</strong> ${teamData.assistant || 'Não informado'}</p>
                        <p><strong>Poço:</strong> ${teamData.well || 'Não informado'}</p>
                        <p><strong>Data:</strong> ${formatDate(teamData.date)}</p>
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('equipe', 'teamData', '0')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    }

    if (equipe) {
        allItems.push({
            type: 'equipe',
            source: 'ucaq_equipe',
            data: equipe,
            startTime: '00:00', // Default para ordenação, como é equipe aparecerá no início
            renderCard: () => {
                return `
                <div class="report-card card-equipe">
                    <div class="report-card-title">Equipe do Dia</div>
                    <div class="report-card-body">
                        <p><strong>Operador:</strong> ${equipe.operador || 'Não informado'}</p>
                        <p><strong>Auxiliar:</strong> ${equipe.auxiliar || 'Não informado'}</p>
                        <p><strong>Poço:</strong> ${equipe.poco || 'Não informado'}</p>
                        <p><strong>Data:</strong> ${formatDate(equipe.data || new Date())}</p>
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('equipe', 'ucaq_equipe', '0')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar deslocamentos
    filteredDisplacements.forEach((item, index) => {
        allItems.push({
            type: 'deslocamento',
            source: 'displacements',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                const kmDiff = item.odometerEnd - item.odometerStart;
                return `
                <div class="report-card card-deslocamento">
                    <div class="report-card-title">
                        Deslocamento ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Origem:</strong> ${item.origin}</p>
                        <p><strong>Destino:</strong> ${item.destination}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>KM:</strong> ${item.odometerStart} - ${item.odometerEnd}</p>
                        <p><strong>Distância:</strong> ${kmDiff.toFixed(1)} km</p>
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('deslocamento', 'displacements', '${index}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    });

    if (deslocamento) {
        allItems.push({
            type: 'deslocamento',
            source: 'ucaq_deslocamento',
            data: deslocamento,
            startTime: deslocamento.inicio || '00:00',
            renderCard: () => {
                const kmDiff = (deslocamento.kmFim && deslocamento.kmInicio)
                    ? deslocamento.kmFim - deslocamento.kmInicio
                    : 0;

                return `
                <div class="report-card card-deslocamento">
                    <div class="report-card-title">
                        Deslocamento Individual
                        <span>${deslocamento.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Origem:</strong> ${deslocamento.origem || 'Não informado'}</p>
                        <p><strong>Destino:</strong> ${deslocamento.destino || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${deslocamento.inicio || ''} - ${deslocamento.fim || ''}</p>
                        ${deslocamento.kmInicio ? `<p><strong>KM:</strong> ${deslocamento.kmInicio} - ${deslocamento.kmFim || deslocamento.kmInicio}</p>` : ''}
                        ${kmDiff ? `<p><strong>Distância:</strong> ${kmDiff.toFixed(1)} km</p>` : ''}
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('deslocamento', 'ucaq_deslocamento', '0')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar operações
    filteredOperations.forEach((item, index) => {
        allItems.push({
            type: 'operacao',
            source: 'operations',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-operacao">
                    <div class="report-card-title">
                        Operação ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        ${item.pocoId ? `<p><strong>ID do Poço:</strong> ${item.pocoId}</p>` : ''}
                        <p><strong>Poço:</strong> ${item.poco || 'Não informado'}</p>
                        <p><strong>Serviço:</strong> ${item.servico}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        ${item.volume ? `<p><strong>Volume:</strong> ${item.volume} bbl</p>` : ''}
                        ${item.temperature ? `<p><strong>Temperatura:</strong> ${item.temperature} °C</p>` : ''}
                        ${item.pressure ? `<p><strong>Pressão:</strong> ${item.pressure} psi</p>` : ''}
                        ${item.observation ? `<p><strong>Observação:</strong> ${item.observation}</p>` : ''}
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('operacao', 'operations', '${index}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    });

    if (operacao) {
        allItems.push({
            type: 'operacao',
            source: 'ucaq_operacao',
            data: operacao,
            startTime: operacao.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-operacao">
                    <div class="report-card-title">
                        Operação Individual
                        <span>${operacao.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        ${operacao.idPoco ? `<p><strong>ID do Poço:</strong> ${operacao.idPoco}</p>` : ''}
                        <p><strong>Poço:</strong> ${operacao.poco || 'Não informado'}</p>
                        <p><strong>Atividade:</strong> ${operacao.atividade || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${operacao.inicio || ''} - ${operacao.fim || ''}</p>
                        ${operacao.volume ? `<p><strong>Volume:</strong> ${operacao.volume} bbl</p>` : ''}
                        ${operacao.temperatura ? `<p><strong>Temperatura:</strong> ${operacao.temperatura} °C</p>` : ''}
                        ${operacao.pressao ? `<p><strong>Pressão:</strong> ${operacao.pressao} psi</p>` : ''}
                        ${operacao.status ? `<p><strong>Status:</strong> ${operacao.status}</p>` : ''}
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('operacao', 'ucaq_operacao', '0')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar aguardos
    filteredWaitings.forEach((item, index) => {
        allItems.push({
            type: 'aguardo',
            source: 'waitings',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-aguardo">
                    <div class="report-card-title">
                        Aguardo ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Motivo:</strong> ${item.reason}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>Duração:</strong> ${item.duration}</p>
                    </div>
                </div>`;
            }
        });
    });

    if (aguardo) {
        allItems.push({
            type: 'aguardo',
            source: 'ucaq_aguardo',
            data: aguardo,
            startTime: aguardo.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-aguardo">
                    <div class="report-card-title">
                        Aguardo Individual
                        <span>${aguardo.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Poço:</strong> ${aguardo.poco || 'Não informado'}</p>
                        <p><strong>Motivo:</strong> ${aguardo.motivo || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${aguardo.inicio || ''} - ${aguardo.fim || ''}</p>
                        ${aguardo.tempoAguardando ? `<p><strong>Duração:</strong> ${aguardo.tempoAguardando}</p>` : ''}
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar mobilizações
    filteredMobilizations.forEach((item, index) => {
        allItems.push({
            type: 'mobilizacao',
            source: 'mobilizations',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-mobilizacao">
                    <div class="report-card-title">
                        Mobilização ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Atividade:</strong> ${item.activity}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>Duração:</strong> ${item.duration}</p>
                    </div>
                </div>`;
            }
        });
    });

    if (mobilizacao) {
        allItems.push({
            type: 'mobilizacao',
            source: 'ucaq_mobilizacao',
            data: mobilizacao,
            startTime: mobilizacao.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-mobilizacao">
                    <div class="report-card-title">
                        Mobilização Individual
                        <span>${mobilizacao.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Poço:</strong> ${mobilizacao.poco || 'Não informado'}</p>
                        <p><strong>Atividade:</strong> ${mobilizacao.atividade || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${mobilizacao.inicio || ''} - ${mobilizacao.fim || ''}</p>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar desmobilizações
    filteredDemobilizations.forEach((item, index) => {
        allItems.push({
            type: 'desmobilizacao',
            source: 'demobilizations',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-desmobilizacao">
                    <div class="report-card-title">
                        Desmobilização ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Atividade:</strong> ${item.activity}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>Duração:</strong> ${item.duration}</p>
                    </div>
                </div>`;
            }
        });
    });

    if (desmobilizacao) {
        allItems.push({
            type: 'desmobilizacao',
            source: 'ucaq_desmobilizacao',
            data: desmobilizacao,
            startTime: desmobilizacao.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-desmobilizacao">
                    <div class="report-card-title">
                        Desmobilização Individual
                        <span>${desmobilizacao.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Poço:</strong> ${desmobilizacao.poco || 'Não informado'}</p>
                        <p><strong>Atividade:</strong> ${desmobilizacao.atividade || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${desmobilizacao.inicio || ''} - ${desmobilizacao.fim || ''}</p>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar abastecimentos do localStorage
    filteredSupplies.forEach((item, index) => {
        allItems.push({
            type: 'abastecimento',
            source: 'supplies',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-abastecimento">
                    <div class="report-card-title">
                        Abastecimento ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Tipo:</strong> ${item.supplyType}</p>
                        <p><strong>Quantidade:</strong> ${item.quantity} litros</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>Duração:</strong> ${item.duration}</p>
                    </div>
                </div>`;
            }
        });
    });

    if (abastecimento) {
        allItems.push({
            type: 'abastecimento',
            source: 'ucaq_abastecimento',
            data: abastecimento,
            startTime: abastecimento.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-abastecimento">
                    <div class="report-card-title">
                        Abastecimento Individual
                        <span>${abastecimento.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Poço:</strong> ${abastecimento.poco || 'Não informado'}</p>
                        <p><strong>Tipo:</strong> ${abastecimento.tipo || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${abastecimento.inicio || ''} - ${abastecimento.fim || ''}</p>
                    </div>
                </div>`;
            }
        });
    }

    // Adicionar abastecimentos do SQLite
    sqliteData.abastecimentos.forEach((item, index) => {
        allItems.push({
            type: 'abastecimento',
            source: 'sqlite',
            data: item,
            startTime: item.inicio || '00:00', // Usar o horário de início se disponível
            renderCard: () => {
                return `
                <div class="report-card card-abastecimento">
                    <div class="report-card-title">
                        Abastecimento ${index + 1}
                        <span>${item.inicio || formatDate(item.data)}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Local:</strong> ${item.local || 'Não informado'}</p>
                        <p><strong>Data:</strong> ${formatDate(item.data)}</p>
                        ${item.tipo ? `<p><strong>Tipo:</strong> ${item.tipo}</p>` : ''}
                        ${item.inicio && item.fim ? `<p><strong>Horário:</strong> ${item.inicio} - ${item.fim}</p>` : ''}
                        ${item.litros ? `<p><strong>Litros:</strong> ${item.litros}</p>` : ''}
                        ${item.valor ? `<p><strong>Valor:</strong> R$ ${item.valor}</p>` : ''}
                        ${item.kilometragem ? `<p><strong>Quilometragem:</strong> ${item.kilometragem} km</p>` : ''}
                        <p><strong>Registrado em:</strong> ${new Date(item.timestamp).toLocaleString('pt-BR')}</p>
                        <button class="btn btn-danger btn-sm delete-btn" onclick="deleteReportItem('abastecimento', 'sqlite', '${item.id}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>`;
            }
        });
    });

    // Adicionar alimentação
    filteredMeals.forEach((item, index) => {
        allItems.push({
            type: 'alimentacao',
            source: 'meals',
            data: item,
            startTime: item.startTime || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-alimentacao">
                    <div class="report-card-title">
                        Alimentação ${index + 1}
                        <span>${item.startTime || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Motivo:</strong> ${item.reason}</p>
                        <p><strong>Horário:</strong> ${item.startTime} - ${item.endTime}</p>
                        <p><strong>Duração:</strong> ${item.duration}</p>
                    </div>
                </div>`;
            }
        });
    });

    if (alimentacao) {
        allItems.push({
            type: 'alimentacao',
            source: 'ucaq_alimentacao',
            data: alimentacao,
            startTime: alimentacao.inicio || '00:00',
            renderCard: () => {
                return `
                <div class="report-card card-alimentacao">
                    <div class="report-card-title">
                        Alimentação Individual
                        <span>${alimentacao.inicio || ''}</span>
                    </div>
                    <div class="report-card-body">
                        <p><strong>Poço:</strong> ${alimentacao.poco || 'Não informado'}</p>
                        <p><strong>Motivo:</strong> ${alimentacao.motivo || 'Não informado'}</p>
                        <p><strong>Horário:</strong> ${alimentacao.inicio || ''} - ${alimentacao.fim || ''}</p>
                    </div>
                </div>`;
            }
        });
    }

    // Função para converter horário (HH:MM) em minutos para ordenação
    function timeToMinutes(timeStr) {
        if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
            return 0; // Valor padrão para itens sem horário válido
        }

        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Ordenar todos os itens por horário de início
    allItems.sort((a, b) => {
        // Manter equipe sempre no início
        if (a.type === 'equipe') return -1;
        if (b.type === 'equipe') return 1;

        // Ordenar os demais itens por horário
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    // Agrupar itens por tipo (para seções)
    const itemsByType = {};
    allItems.forEach(item => {
        if (!itemsByType[item.type]) {
            itemsByType[item.type] = [];
        }
        itemsByType[item.type].push(item);
    });

    // Gerar HTML do relatório agrupado por seções
    let reportHTML = '';

    // Ícones para cada tipo
    const typeIcons = {
        'equipe': 'fa-users',
        'deslocamento': 'fa-truck',
        'operacao': 'fa-gears',
        'aguardo': 'fa-hourglass-half',
        'mobilizacao': 'fa-screwdriver-wrench',
        'desmobilizacao': 'fa-hammer',
        'abastecimento': 'fa-gas-pump',
        'alimentacao': 'fa-utensils'
        , 'manutencao': 'fa-wrench'
    };

    // Títulos para cada tipo
    const typeTitles = {
        'equipe': 'Equipe',
        'deslocamento': 'Deslocamentos',
        'operacao': 'Operações',
        'aguardo': 'Aguardos',
        'mobilizacao': 'Mobilizações',
        'desmobilizacao': 'Desmobilizações',
        'abastecimento': 'Abastecimentos',
        'alimentacao': 'Alimentação'
        , 'manutencao': 'Manutenção'
    };

    // Renderizar cada seção com seus itens
    Object.keys(itemsByType).forEach(type => {
        const items = itemsByType[type];

        reportHTML += `
            <div class="report-section">
                <h3><i class="fa-solid ${typeIcons[type]}"></i> ${typeTitles[type]}</h3>
                <div class="report-cards-container">`;

        // Renderizar cada card desta seção
        items.forEach((item, itemIndex) => {
            // Obter o HTML base do cartão
            let cardHTML = item.renderCard();

            // Verificar se o cartão já tem um botão de exclusão
            if (!cardHTML.includes('delete-btn')) {
                // Encontrar onde fechar a div do card-body
                const closeBodyIndex = cardHTML.lastIndexOf('</div>');

                // Inserir o botão de exclusão antes de fechar a div
                if (closeBodyIndex !== -1) {
                    const deleteButton = `
                        <button class="btn btn-danger btn-sm delete-btn" 
                            onclick="deleteReportItem('${item.type}', '${item.source}', '${item.source === 'sqlite' ? item.data.id : itemIndex}')">
                            <i class="fas fa-trash"></i> Excluir
                        </button>`;

                    cardHTML =
                        cardHTML.substring(0, closeBodyIndex) +
                        deleteButton +
                        cardHTML.substring(closeBodyIndex);
                }
            }

            reportHTML += cardHTML;
        });

        reportHTML += `</div></div>`;
    });

    // Adicionar o relatório à página
    reportList.innerHTML = reportHTML;

    // Mostrar botões de ação
    document.getElementById('clearReportBtn').style.display = 'block';
    document.getElementById('shareWhatsapp').style.display = 'block';
}

// Função para excluir um item do relatório
function deleteReportItem(type, source, id) {
    if (confirm(`Tem certeza que deseja excluir este item?`)) {
        console.log(`Excluindo item: tipo=${type}, fonte=${source}, id=${id}`);

        if (source === 'sqlite') {
            // Excluir do banco SQLite
            if (window.db && window.db.delete) {
                try {
                    window.db.delete(type, id);
                    alert('Item excluído com sucesso!');
                    generateReport(); // Recarregar relatório
                } catch (error) {
                    console.error('Erro ao excluir item do SQLite:', error);
                    alert('Erro ao excluir item.');
                }
            }
        } else {
            // Excluir do localStorage
            let storageKey;

            // Determinar a chave do localStorage com base no tipo/fonte
            switch (source) {
                case 'teamData':
                    localStorage.removeItem('teamData');
                    break;
                case 'supplies':
                    storageKey = 'supplies';
                    break;
                case 'displacements':
                    storageKey = 'displacements';
                    break;
                case 'operations':
                    storageKey = 'operations';
                    break;
                case 'waitings':
                    storageKey = 'waitings';
                    break;
                case 'mobilizations':
                    storageKey = 'mobilizations';
                    break;
                case 'demobilizations':
                    storageKey = 'demobilizations';
                    break;
                case 'meals':
                    storageKey = 'meals';
                    break;
                case 'ucaq_equipe':
                    localStorage.removeItem('ucaq_equipe');
                    break;
                case 'ucaq_deslocamento':
                    localStorage.removeItem('ucaq_deslocamento');
                    break;
                case 'ucaq_operacao':
                    localStorage.removeItem('ucaq_operacao');
                    break;
                case 'ucaq_aguardo':
                    localStorage.removeItem('ucaq_aguardo');
                    break;
                case 'ucaq_mobilizacao':
                    localStorage.removeItem('ucaq_mobilizacao');
                    break;
                case 'ucaq_desmobilizacao':
                    localStorage.removeItem('ucaq_desmobilizacao');
                    break;
                case 'ucaq_abastecimento':
                    localStorage.removeItem('ucaq_abastecimento');
                    break;
                case 'ucaq_alimentacao':
                    localStorage.removeItem('ucaq_alimentacao');
                    break;
            }

            // Se for um array no localStorage, encontrar e remover o item
            if (storageKey) {
                const items = JSON.parse(localStorage.getItem(storageKey)) || [];
                const newItems = items.filter((item, index) => index !== parseInt(id));
                localStorage.setItem(storageKey, JSON.stringify(newItems));
            }

            alert('Item excluído com sucesso!');
            generateReport(); // Recarregar relatório
        }
    }
}

// Função para limpar o relatório
function clearReport() {
    if (confirm('Tem certeza que deseja limpar o relatório?')) {
        document.getElementById('reportList').innerHTML = '';
        document.getElementById('dataFiltro').value = '';
        document.getElementById('clearReportBtn').style.display = 'none';
        document.getElementById('shareWhatsapp').style.display = 'none';
    }
}

// Função para compartilhar o relatório no WhatsApp
async function shareWhatsapp() {
    const dateFilter = document.getElementById('dataFiltro').value;
    if (!dateFilter) {
        alert('Selecione uma data para gerar o relatório.');
        return;
    }

    // Mostrar indicador de carregamento
    const shareBtn = document.getElementById('shareWhatsapp');
    const originalText = shareBtn.innerHTML;
    shareBtn.innerHTML = '<span class="loading-spinner"></span> Gerando...';
    shareBtn.disabled = true;

    // Formatar a data para exibição
    const formattedDate = new Date(dateFilter).toLocaleDateString('pt-BR');

    // Carregar dados do SQLite
    const filterDate = dateFilter.split('T')[0];
    const sqliteData = await loadSQLiteData(filterDate);

    // Recuperar dados do localStorage - tanto arrays quanto itens individuais
    const teamData = JSON.parse(localStorage.getItem('teamData')) || {};
    const equipe = JSON.parse(localStorage.getItem('ucaq_equipe')) || null;

    const displacements = JSON.parse(localStorage.getItem('displacements')) || [];
    const deslocamento = JSON.parse(localStorage.getItem('ucaq_deslocamento')) || null;

    const operations = JSON.parse(localStorage.getItem('operations')) || [];
    const operacao = JSON.parse(localStorage.getItem('ucaq_operacao')) || null;

    const waitings = JSON.parse(localStorage.getItem('waitings')) || [];
    const aguardo = JSON.parse(localStorage.getItem('ucaq_aguardo')) || null;

    const mobilizations = JSON.parse(localStorage.getItem('mobilizations')) || [];
    const mobilizacao = JSON.parse(localStorage.getItem('ucaq_mobilizacao')) || null;

    const demobilizations = JSON.parse(localStorage.getItem('demobilizations')) || [];
    const desmobilizacao = JSON.parse(localStorage.getItem('ucaq_desmobilizacao')) || null;

    const supplies = JSON.parse(localStorage.getItem('supplies')) || [];
    const abastecimento = JSON.parse(localStorage.getItem('ucaq_abastecimento')) || null;

    const meals = JSON.parse(localStorage.getItem('meals')) || [];
    const alimentacao = JSON.parse(localStorage.getItem('ucaq_alimentacao')) || null;

    // Recuperar todos os dados da data selecionada
    const filteredDisplacements = displacements.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredOperations = operations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredWaitings = waitings.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredMobilizations = mobilizations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredDemobilizations = demobilizations.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredSupplies = supplies.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);
    const filteredMeals = meals.filter(item => item.timestamp && item.timestamp.split('T')[0] === filterDate);

    // Criar estrutura para todos os itens e ordenar cronologicamente
    const allItems = [];

    // Adicionar equipe (sempre fica no topo)
    if (teamData && teamData.date && teamData.date.split('T')[0] === filterDate) {
        allItems.push({
            type: 'equipe',
            data: teamData,
            startTime: '00:00',
            renderText: () => {
                return `*Relatório de Operação Ucaq*\n\n*Equipe*\nOperador: ${teamData.operator || 'Não informado'}\nAuxiliar: ${teamData.assistant || 'Não informado'}\nData: ${formatDate(teamData.date)}\nPoço: ${teamData.well || 'Não informado'}\n\n`;
            }
        });
    }
    if (equipe) {
        allItems.push({
            type: 'equipe',
            data: equipe,
            startTime: '00:00',
            renderText: () => {
                const date = new Date();
                const formattedCurrentDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
                return `*Relatório de Operação Ucaq*\n\n*Equipe*\nOperador: ${equipe.operador || 'Não informado'}\nAuxiliar: ${equipe.auxiliar || 'Não informado'}\nData: ${formatDate(equipe.data) || formattedCurrentDate}\nPoço: ${equipe.poco || 'Não informado'}\n\n`;
            }
        });
    }

    // Adicionar deslocamentos
    filteredDisplacements.forEach(item => {
        const kmDiff = item.odometerEnd - item.odometerStart;
        allItems.push({
            type: 'deslocamento',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Deslocamento*\nPoço: ${item.well || 'Não informado'}\nOrigem: ${item.origin}\nDestino: ${item.destination}\nHora Inicial: ${item.startTime}\nHora Final: ${item.endTime}\nKM Inicial: ${item.odometerStart}\nKM Final: ${item.odometerEnd}\nTotal Percorrido: ${kmDiff.toFixed(0)} km\n\n`;
            }
        });
    });
    if (deslocamento) {
        const kmDiff = (deslocamento.kmFim && deslocamento.kmInicio)
            ? deslocamento.kmFim - deslocamento.kmInicio
            : 0;
        allItems.push({
            type: 'deslocamento',
            data: deslocamento,
            startTime: deslocamento.inicio || '00:00',
            renderText: () => {
                return `*Deslocamento*\nPoço: ${deslocamento.poco || 'Não informado'}\nOrigem: ${deslocamento.origem || 'Não informado'}\nDestino: ${deslocamento.destino || 'Não informado'}\nHora Inicial: ${deslocamento.inicio || ''}\nHora Final: ${deslocamento.fim || ''}\nKM Inicial: ${deslocamento.kmInicio || ''}\nKM Final: ${deslocamento.kmFim || ''}\nTotal Percorrido: ${kmDiff.toFixed(0)} km\n\n`;
            }
        });
    }

    // Adicionar mobilizações
    filteredMobilizations.forEach(item => {
        allItems.push({
            type: 'mobilizacao',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Mobilização*\nPoço: ${item.well || 'Não informado'}\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\nAtividade: ${item.activity}\n\n`;
            }
        });
    });
    if (mobilizacao) {
        allItems.push({
            type: 'mobilizacao',
            data: mobilizacao,
            startTime: mobilizacao.inicio || '00:00',
            renderText: () => {
                return `*Mobilização*\nPoço: ${mobilizacao.poco || 'Não informado'}\nHora Início: ${mobilizacao.inicio || ''}\nHora Fim: ${mobilizacao.fim || ''}\nAtividade: ${mobilizacao.atividade || 'Não informado'}\n\n`;
            }
        });
    }

    // Adicionar operações
    filteredOperations.forEach(item => {
        allItems.push({
            type: 'operacao',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Operação*\nID do Poço: ${item.pocoId || ''}\nPoço: ${item.poco || 'Não informado'}\nAtividade: ${item.servico}\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\nVolume: ${item.volume || ''} bbl\nTemperatura: ${item.temperature || ''} °C\nPressão: ${item.pressure || ''} psi\nObservação: ${item.observation || ''}\n\n`;
            }
        });
    });
    if (operacao) {
        allItems.push({
            type: 'operacao',
            data: operacao,
            startTime: operacao.inicio || '00:00',
            renderText: () => {
                return `*Operação*\nID do Poço: ${operacao.idPoco || ''}\nPoço: ${operacao.poco || 'Não informado'}\nAtividade: ${operacao.atividade || 'Não informado'}\nHora Início: ${operacao.inicio || ''}\nHora Fim: ${operacao.fim || ''}\nVolume: ${operacao.volume || ''} bbl\nTemperatura: ${operacao.temperatura || ''} °C\nPressão: ${operacao.pressao || ''} psi\nObservação: ${operacao.observacao || ''}\n\n`;
            }
        });
    }

    // Adicionar desmobilizações
    filteredDemobilizations.forEach(item => {
        allItems.push({
            type: 'desmobilizacao',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Desmobilização*\nPoço: ${item.well || 'Não informado'}\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\nAtividade: ${item.activity}\n\n`;
            }
        });
    });
    if (desmobilizacao) {
        allItems.push({
            type: 'desmobilizacao',
            data: desmobilizacao,
            startTime: desmobilizacao.inicio || '00:00',
            renderText: () => {
                return `*Desmobilização*\nPoço: ${desmobilizacao.poco || 'Não informado'}\nHora Início: ${desmobilizacao.inicio || ''}\nHora Fim: ${desmobilizacao.fim || ''}\nAtividade: ${desmobilizacao.atividade || 'Não informado'}\n\n`;
            }
        });
    }

    // Adicionar aguardos e repouso
    filteredWaitings.forEach(item => {
        allItems.push({
            type: 'aguardo',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                const title = item.reason.toLowerCase().includes('almoço') ||
                    item.reason.toLowerCase().includes('refeicao') ||
                    item.reason.toLowerCase().includes('refeição') ?
                    'Repouso' : 'Aguardo';
                return `*${title}*\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\nDuração: ${item.duration || 'Não informado'}\nAtividade: ${item.reason}\n\n`;
            }
        });
    });
    if (aguardo) {
        allItems.push({
            type: 'aguardo',
            data: aguardo,
            startTime: aguardo.inicio || '00:00',
            renderText: () => {
                const title = aguardo.motivo.toLowerCase().includes('almoço') ||
                    aguardo.motivo.toLowerCase().includes('refeicao') ||
                    aguardo.motivo.toLowerCase().includes('refeição') ?
                    'Repouso' : 'Aguardo';
                return `*${title}*\nHora Início: ${aguardo.inicio || ''}\nHora Fim: ${aguardo.fim || ''}\nDuração: ${aguardo.tempoAguardando || 'Não informado'}\nAtividade: ${aguardo.motivo || 'Não informado'}\n\n`;
            }
        });
    }

    // Adicionar abastecimentos do localStorage
    filteredSupplies.forEach(item => {
        allItems.push({
            type: 'abastecimento',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Abastecimento*\nPoço: ${item.well || 'Não informado'}\nTipo: ${item.supplyType}\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\n\n`;
            }
        });
    });
    if (abastecimento) {
        allItems.push({
            type: 'abastecimento',
            data: abastecimento,
            startTime: abastecimento.inicio || '00:00',
            renderText: () => {
                return `*Abastecimento*\nPoço: ${abastecimento.poco || 'Não informado'}\nTipo: ${abastecimento.tipo || 'Não informado'}\nHora Início: ${abastecimento.inicio || ''}\nHora Fim: ${abastecimento.fim || ''}\n\n`;
            }
        });
    }

    // Adicionar abastecimentos do SQLite
    sqliteData.abastecimentos.forEach(item => {
        allItems.push({
            type: 'abastecimento',
            data: item,
            startTime: item.inicio || '00:00',
            renderText: () => {
                return `*Abastecimento*\nLocal: ${item.local || 'Não informado'}\nData: ${formatDate(item.data)}\n${item.tipo ? `Tipo: ${item.tipo}\n` : ''}${item.inicio && item.fim ? `Horário: ${item.inicio} - ${item.fim}\n` : ''}${item.litros ? `Litros: ${item.litros}\n` : ''}${item.valor ? `Valor: R$ ${item.valor}\n` : ''}${item.kilometragem ? `Quilometragem: ${item.kilometragem} km\n` : ''}\n`;
            }
        });
    });

    // Adicionar alimentação
    filteredMeals.forEach(item => {
        allItems.push({
            type: 'alimentacao',
            data: item,
            startTime: item.startTime || '00:00',
            renderText: () => {
                return `*Repouso*\nHora Início: ${item.startTime}\nHora Fim: ${item.endTime}\nAtividade: ${item.reason}\n\n`;
            }
        });
    });
    if (alimentacao) {
        allItems.push({
            type: 'alimentacao',
            data: alimentacao,
            startTime: alimentacao.inicio || '00:00',
            renderText: () => {
                return `*Repouso*\nHora Início: ${alimentacao.inicio || ''}\nHora Fim: ${alimentacao.fim || ''}\nAtividade: ${alimentacao.motivo || 'Não informado'}\n\n`;
            }
        });
    }

    // Função para converter horário (HH:MM) em minutos para ordenação
    function timeToMinutes(timeStr) {
        if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
            return 0; // Valor padrão para itens sem horário válido
        }

        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Ordenar todos os itens por horário de início
    allItems.sort((a, b) => {
        // Manter equipe sempre no início
        if (a.type === 'equipe') return -1;
        if (b.type === 'equipe') return 1;

        // Ordenar os demais itens por horário
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    // Gerar o texto do relatório em ordem cronológica
    let text = '';

    // Primeiro, verificar se há algum item de equipe
    const equipeItem = allItems.find(item => item.type === 'equipe');
    if (equipeItem) {
        text = equipeItem.renderText(); // Iniciar com a equipe

        // Remover o item de equipe para não duplicar
        const itemsWithoutEquipe = allItems.filter(item => item.type !== 'equipe');

        // Adicionar os demais itens em ordem cronológica
        itemsWithoutEquipe.forEach(item => {
            text += item.renderText();
        });
    } else {
        // Se não há equipe, iniciar com um cabeçalho padrão
        text = `*Relatório de Operação Ucaq*\n\nData: ${formattedDate}\n\n`;

        // Adicionar todos os itens em ordem cronológica
        allItems.forEach(item => {
            text += item.renderText();
        });
    }

    // Atraso simulado para mostrar o indicador de carregamento
    setTimeout(() => {
        // Restaurar o botão
        shareBtn.innerHTML = originalText;
        shareBtn.disabled = false;

        // Codificar o texto para URL
        const encodedText = encodeURIComponent(text);

        // Abrir o WhatsApp com o texto
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
    }, 800);
}

// Inicializar a página
document.addEventListener('DOMContentLoaded', async function () {
    // Inicializar banco de dados SQLite
    if (window.db && window.db.init) {
        try {
            const success = await window.db.init();
            if (success) {
                console.log('Banco de dados SQLite inicializado no relatório');
            } else {
                console.warn('Falha ao inicializar banco de dados SQLite no relatório');
            }
        } catch (error) {
            console.error('Erro ao inicializar banco de dados no relatório:', error);
        }
    }

    // Controle de visibilidade do cabeçalho mobile
    const mobileHeader = document.getElementById('mobileHeader');
    if (mobileHeader) {
        if (window.innerWidth <= 768) {
            mobileHeader.style.display = 'flex';
        } else {
            mobileHeader.style.display = 'none';
        }

        // Atualizar visibilidade do cabeçalho ao redimensionar
        window.addEventListener('resize', function () {
            if (window.innerWidth <= 768) {
                mobileHeader.style.display = 'flex';
            } else {
                mobileHeader.style.display = 'none';
            }
        });
    }

    // Definir a data atual no filtro
    // Usa a data local do usuário para evitar problemas de fuso horário
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const formattedToday = `${year}-${month}-${day}`;

    const dataFiltro = document.getElementById('dataFiltro');
    if (dataFiltro) {
        dataFiltro.value = formattedToday;
    }

    // Adicionar event listeners aos botões
    const btnPesquisar = document.getElementById('btnPesquisar');
    if (btnPesquisar) {
        btnPesquisar.addEventListener('click', generateReport);
    }

    const clearReportBtn = document.getElementById('clearReportBtn');
    if (clearReportBtn) {
        clearReportBtn.addEventListener('click', clearReport);
    }

    const shareWhatsappBtn = document.getElementById('shareWhatsapp');
    if (shareWhatsappBtn) {
        shareWhatsappBtn.addEventListener('click', shareWhatsapp);
    }

    // Gerar relatório com a data atual
    await generateReport();
});
