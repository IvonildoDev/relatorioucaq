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
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    // Só fecha o drawer se for mobile
    if (window.innerWidth < 900) toggleDrawer();
    if (screenId === 'home') renderLogs();
}

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
    showScreen('home');
    document.querySelectorAll('.form-group input').forEach(input => input.value = '');
}

// Initial render
renderLogs();
