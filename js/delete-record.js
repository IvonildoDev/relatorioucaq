// Função para excluir um registro de uma tabela específica
function deleteRecord(table, id) {
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
