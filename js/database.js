// Função para exportar e baixar o banco de dados como arquivo .sqlite
function downloadDatabase(filename = 'ucaq_database.sqlite') {
    if (!db) {
        alert('Banco de dados não inicializado!');
        return;
    }
    const binaryArray = db.export();
    const blob = new Blob([binaryArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
/**
 * database.js - Módulo de gerenciamento de banco de dados SQLite
 * Este módulo oferece funções para inicializar e gerenciar o banco de dados SQLite
 * usando SQL.js como implementação
 */

// Armazenará a instância do banco de dados
let db = null;
let SQL = null;

// Inicializa o banco de dados SQLite
async function initDatabase() {
    try {
        // Verifica se o SQL.js já está carregado
        if (typeof initSqlJs === 'undefined') {
            console.error('SQL.js não foi carregado corretamente.');
            return false;
        }

        // Configuração correta do caminho dos arquivos wasm
        const sqlPromise = initSqlJs({
            locateFile: file => `./wasm/${file}`
        });

        SQL = await sqlPromise;

        // Tenta carregar o banco de dados existente do localStorage
        const dbData = localStorage.getItem('ucaq_database');

        if (dbData) {
            try {
                // Converte a string base64 de volta para Uint8Array
                const binaryString = window.atob(dbData);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }

                // Carrega o banco de dados existente
                db = new SQL.Database(bytes);
                console.log('Banco de dados SQLite carregado do localStorage');

                // Verifica e atualiza a estrutura das tabelas se necessário
                updateTables();
            } catch (e) {
                console.error('Erro ao carregar banco de dados existente:', e);
                // Cria um novo banco se não conseguir carregar o existente
                db = new SQL.Database();
                createTables();
            }
        } else {
            // Cria um novo banco de dados
            db = new SQL.Database();
            console.log('Novo banco de dados SQLite criado');

            // Cria as tabelas necessárias
            createTables();
        }

        return true;
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados SQLite:', error);
        // Fallback para localStorage se SQL.js falhar
        alert('Não foi possível inicializar o banco de dados SQLite. O sistema usará localStorage como alternativa.');
        return false;
    }
}

// Salva o banco de dados no localStorage
function saveDatabase() {
    if (!db) return;

    try {
        // Exporta o banco de dados como um array binário
        const data = db.export();

        // Converte para string base64 para armazenar no localStorage
        const binaryString = Array.from(new Uint8Array(data))
            .map(byte => String.fromCharCode(byte))
            .join('');
        const base64String = window.btoa(binaryString);

        // Salva no localStorage
        localStorage.setItem('ucaq_database', base64String);
        console.log('Banco de dados salvo no localStorage');
    } catch (error) {
        console.error('Erro ao salvar banco de dados:', error);
    }
}

// Cria as tabelas necessárias no banco de dados
function createTables() {
    if (!db) return;

    // Tabela de Equipe
    db.run(`
        CREATE TABLE IF NOT EXISTS equipe (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operador TEXT NOT NULL,
            auxiliar TEXT NOT NULL,
            data TEXT NOT NULL,
            poco TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Deslocamento
    db.run(`
        CREATE TABLE IF NOT EXISTS deslocamento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            poco TEXT NOT NULL,
            origem TEXT NOT NULL,
            destino TEXT NOT NULL,
            inicio TEXT NOT NULL,
            fim TEXT NOT NULL,
            kmInicio TEXT,
            kmFim TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Operação
    db.run(`
        CREATE TABLE IF NOT EXISTS operacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pocoId TEXT,
            poco TEXT NOT NULL,
            atividade TEXT NOT NULL,
            inicio TEXT NOT NULL,
            fim TEXT NOT NULL,
            volume TEXT,
            temperatura TEXT,
            pressao TEXT,
            observacao TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Aguardo
    db.run(`
        CREATE TABLE IF NOT EXISTS aguardo (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            motivo TEXT NOT NULL,
            inicio TEXT NOT NULL,
            fim TEXT NOT NULL,
            observacao TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Mobilização
    db.run(`
        CREATE TABLE IF NOT EXISTS mobilizacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            local TEXT NOT NULL,
            inicio TEXT NOT NULL,
            fim TEXT NOT NULL,
            observacao TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Desmobilização
    db.run(`
        CREATE TABLE IF NOT EXISTS desmobilizacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            local TEXT NOT NULL,
            inicio TEXT NOT NULL,
            fim TEXT NOT NULL,
            observacao TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Abastecimento
    db.run(`
        CREATE TABLE IF NOT EXISTS abastecimento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            local TEXT NOT NULL,
            data TEXT NOT NULL,
            litros TEXT,
            valor TEXT,
            kilometragem TEXT,
            inicio TEXT,
            fim TEXT,
            tipo TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    // Tabela de Alimentação
    db.run(`
        CREATE TABLE IF NOT EXISTS alimentacao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            local TEXT NOT NULL,
            data TEXT NOT NULL,
            refeicao TEXT NOT NULL,
            valor TEXT,
            timestamp TEXT NOT NULL
        )
    `);

    console.log('Tabelas criadas com sucesso');

    // Salva o banco de dados após criar as tabelas
    saveDatabase();
}

// Verifica e atualiza a estrutura das tabelas
function updateTables() {
    if (!db) return;

    try {
        // Verificar e atualizar a tabela de abastecimento
        const resultAbastecimento = db.exec("PRAGMA table_info(abastecimento)");

        // Verifique se os campos inicio, fim e tipo existem
        const columnsAbastecimento = resultAbastecimento[0]?.values || [];
        const columnNamesAbastecimento = columnsAbastecimento.map(col => col[1]);

        let needsUpdate = false;

        if (!columnNamesAbastecimento.includes('inicio')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN inicio TEXT");
            needsUpdate = true;
            console.log("Coluna 'inicio' adicionada à tabela abastecimento");
        }

        if (!columnNamesAbastecimento.includes('fim')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN fim TEXT");
            needsUpdate = true;
            console.log("Coluna 'fim' adicionada à tabela abastecimento");
        }

        if (!columnNamesAbastecimento.includes('tipo')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN tipo TEXT");
            needsUpdate = true;
            console.log("Coluna 'tipo' adicionada à tabela abastecimento");
        }

        if (needsUpdate) {
            saveDatabase();
            console.log("Tabelas atualizadas com sucesso");
        }

        return true;
    } catch (error) {
        console.error("Erro ao atualizar tabelas:", error);
        return false;
    }
}

// Executa uma consulta SQL e retorna os resultados
function executeQuery(sql, params = []) {
    if (!db) {
        console.error('Banco de dados não inicializado');
        return null;
    }

    try {
        const stmt = db.prepare(sql);

        // Vincula os parâmetros à consulta
        if (params && params.length > 0) {
            stmt.bind(params);
        }

        // Para consultas SELECT, retorna todos os resultados
        const results = [];
        while (stmt.step()) {
            results.push(stmt.getAsObject());
        }

        stmt.free();
        return results;
    } catch (error) {
        console.error('Erro ao executar consulta SQL:', error, sql, params);
        return null;
    }
}

// Insere um registro em uma tabela
function insertRecord(table, data) {
    if (!db) {
        console.error('Banco de dados não inicializado');
        return false;
    }

    try {
        // Constrói a consulta de inserção dinâmica
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

        // Prepara e executa a consulta
        const stmt = db.prepare(sql);
        stmt.bind(values);
        stmt.step();
        stmt.free();

        // Salva o banco de dados após a inserção
        saveDatabase();

        return true;
    } catch (error) {
        console.error(`Erro ao inserir registro na tabela ${table}:`, error);
        return false;
    }
}

// Obtém todos os registros de uma tabela
function getAllRecords(table) {
    return executeQuery(`SELECT * FROM ${table} ORDER BY id DESC`);
}

// Obtém registros filtrados por data
function getRecordsByDate(table, date) {
    return executeQuery(
        `SELECT * FROM ${table} WHERE date(substr(timestamp, 1, 10)) = date(?) ORDER BY timestamp DESC`,
        [date]
    );
}

// Sincroniza dados do localStorage para o SQLite
// Esta função deve ser chamada uma vez para migrar dados existentes
async function migrateFromLocalStorage() {
    if (!db) {
        await initDatabase();
        if (!db) return false;
    }

    try {
        // Migra dados da equipe
        const teamData = JSON.parse(localStorage.getItem('teamData') || '{}');
        if (teamData && teamData.operator) {
            insertRecord('equipe', {
                operador: teamData.operator,
                auxiliar: teamData.assistant,
                data: teamData.date,
                poco: teamData.well,
                timestamp: teamData.timestamp || new Date().toISOString()
            });
        }

        // Migra dados de operações
        const operations = JSON.parse(localStorage.getItem('operations') || '[]');
        operations.forEach(op => {
            insertRecord('operacao', {
                pocoId: op.pocoId || '',
                poco: op.well || op.poco,
                atividade: op.activity || op.atividade,
                inicio: op.startTime || op.inicio,
                fim: op.endTime || op.fim,
                volume: op.volume || '',
                temperatura: op.temperature || op.temperatura || '',
                pressao: op.pressure || op.pressao || '',
                observacao: op.observations || op.observacao || '',
                timestamp: op.timestamp || new Date().toISOString()
            });
        });

        // Migra dados de deslocamentos
        const displacements = JSON.parse(localStorage.getItem('displacements') || '[]');
        displacements.forEach(d => {
            insertRecord('deslocamento', {
                poco: d.well || d.poco,
                origem: d.origin || d.origem,
                destino: d.destination || d.destino,
                inicio: d.startTime || d.inicio,
                fim: d.endTime || d.fim,
                kmInicio: d.startKm || d.kmInicio || '',
                kmFim: d.endKm || d.kmFim || '',
                timestamp: d.timestamp || new Date().toISOString()
            });
        });

        // Migra dados de aguardos
        const waitings = JSON.parse(localStorage.getItem('waitings') || '[]');
        waitings.forEach(w => {
            insertRecord('aguardo', {
                motivo: w.reason || w.motivo,
                inicio: w.startTime || w.inicio,
                fim: w.endTime || w.fim,
                observacao: w.observations || w.observacao || '',
                timestamp: w.timestamp || new Date().toISOString()
            });
        });

        // Continua com a migração de outros tipos...

        console.log('Migração de dados do localStorage para SQLite concluída');
        return true;
    } catch (error) {
        console.error('Erro durante a migração de dados:', error);
        return false;
    }
}

// Exporta as funções do módulo
window.db = {
    init: initDatabase,
    save: saveDatabase,
    execute: executeQuery,
    insert: insertRecord,
    getAll: getAllRecords,
    getByDate: getRecordsByDate,
    migrate: migrateFromLocalStorage,
    download: downloadDatabase,
    delete: function (table, id) {
        if (!db) {
            console.error('Banco de dados não inicializado');
            return false;
        }

        try {
            // Prepara a consulta SQL de exclusão
            const sql = `DELETE FROM ${table} WHERE id = ?`;

            // Executa a consulta com o ID como parâmetro
            db.run(sql, [id]);

            // Salva o banco após a exclusão
            saveDatabase();

            console.log(`Registro #${id} excluído da tabela ${table}`);
            return true;
        } catch (error) {
            console.error(`Erro ao excluir registro #${id} da tabela ${table}:`, error);
            return false;
        }
    }
};
