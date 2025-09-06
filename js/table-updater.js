// Função para verificar e atualizar a estrutura da tabela de abastecimento
function updateAbastecimentoTable() {
    try {
        // Verificar se a tabela já existe
        const result = db.exec("PRAGMA table_info(abastecimento)");

        // Verifique se os campos inicio, fim e tipo existem
        const columns = result[0]?.values || [];
        const columnNames = columns.map(col => col[1]);

        let needsUpdate = false;

        if (!columnNames.includes('inicio')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN inicio TEXT");
            needsUpdate = true;
            console.log("Coluna 'inicio' adicionada à tabela abastecimento");
        }

        if (!columnNames.includes('fim')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN fim TEXT");
            needsUpdate = true;
            console.log("Coluna 'fim' adicionada à tabela abastecimento");
        }

        if (!columnNames.includes('tipo')) {
            db.run("ALTER TABLE abastecimento ADD COLUMN tipo TEXT");
            needsUpdate = true;
            console.log("Coluna 'tipo' adicionada à tabela abastecimento");
        }

        if (needsUpdate) {
            saveDatabase();
            console.log("Tabela abastecimento atualizada com sucesso");
        }

        return true;
    } catch (error) {
        console.error("Erro ao atualizar tabela abastecimento:", error);
        return false;
    }
}
