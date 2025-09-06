/**
 * localStorage-fallback.js - Sistema de fallback quando SQLite não está disponível
 * Este módulo simula a API de banco de dados usando localStorage quando WebAssembly/SQL.js falha
 */

// Verifica se o db já existe no namespace global
if (!window.db) {
    console.log('Inicializando sistema de fallback com localStorage');

    // Implementa uma API compatível usando localStorage
    window.db = {
        // Inicializa o "banco de dados"
        init: async function () {
            console.log('Usando localStorage como sistema de armazenamento');
            return true;
        },

        // Simula salvar o banco de dados (não faz nada adicional)
        save: function () {
            console.log('Simulação de salvamento do banco de dados concluída');
            return true;
        },

        // Executa uma "consulta" no localStorage
        execute: function (sql, params = []) {
            console.log('Simulando consulta SQL:', sql);

            // Extrai o nome da tabela da consulta (de forma simplificada)
            const tableMatch = sql.match(/FROM\s+(\w+)/i);
            if (!tableMatch) return [];

            const tableName = tableMatch[1];
            let results = [];

            // Determina a chave correta do localStorage com base no nome da tabela
            let storageKey;
            switch (tableName.toLowerCase()) {
                case 'equipe':
                    storageKey = 'teamData';
                    break;
                case 'operacao':
                    storageKey = 'operations';
                    break;
                case 'deslocamento':
                    storageKey = 'displacements';
                    break;
                case 'aguardo':
                    storageKey = 'waitings';
                    break;
                case 'mobilizacao':
                    storageKey = 'mobilizations';
                    break;
                case 'desmobilizacao':
                    storageKey = 'demobilizations';
                    break;
                case 'abastecimento':
                    storageKey = 'supplies';
                    break;
                case 'alimentacao':
                    storageKey = 'meals';
                    break;
                default:
                    storageKey = tableName;
            }

            // Obtém os dados do localStorage
            const data = JSON.parse(localStorage.getItem(storageKey) || '[]');

            // Verifica se é um array ou um objeto único
            if (Array.isArray(data)) {
                results = data;
            } else if (typeof data === 'object' && data !== null) {
                results = [data];
            }

            return results;
        },

        // Insere um registro em uma "tabela"
        insert: function (table, data) {
            console.log(`Simulando inserção na tabela ${table}:`, data);

            // Determina a chave correta do localStorage com base na tabela
            let storageKey;
            switch (table.toLowerCase()) {
                case 'equipe':
                    storageKey = 'teamData';
                    localStorage.setItem(storageKey, JSON.stringify(data));
                    break;
                case 'operacao':
                    storageKey = 'operations';
                    let operations = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    operations.push(data);
                    localStorage.setItem(storageKey, JSON.stringify(operations));
                    break;
                case 'deslocamento':
                    storageKey = 'displacements';
                    let displacements = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    displacements.push(data);
                    localStorage.setItem(storageKey, JSON.stringify(displacements));
                    break;
                case 'aguardo':
                    storageKey = 'waitings';
                    let waitings = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    waitings.push(data);
                    localStorage.setItem(storageKey, JSON.stringify(waitings));
                    break;
                // Outros casos...
                default:
                    storageKey = table;
                    let items = JSON.parse(localStorage.getItem(storageKey) || '[]');
                    items.push(data);
                    localStorage.setItem(storageKey, JSON.stringify(items));
            }

            return true;
        },

        // Obtém todos os registros de uma "tabela"
        getAll: function (table) {
            // Reutiliza a função execute para simplicidade
            return this.execute(`SELECT * FROM ${table}`);
        },

        // Obtém registros filtrados por data
        getByDate: function (table, date) {
            console.log(`Simulando filtragem por data na tabela ${table} para ${date}`);

            // Obtém todos os registros
            const all = this.getAll(table);

            // Filtra por data (de forma simplificada)
            return all.filter(item => {
                if (!item.timestamp) return false;
                return item.timestamp.substring(0, 10) === date.substring(0, 10);
            });
        },

        // Simula a migração (não faz nada, pois já estamos usando localStorage)
        migrate: async function () {
            console.log('Simulando migração (não aplicável no modo fallback)');
            return true;
        }
    };
}
