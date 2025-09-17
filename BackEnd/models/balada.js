// models/balada.js
// Importa o módulo 'sqlite3' e configura para usar o modo 'verbose' para mais detalhes em caso de erro.
const sqlite3 = require('sqlite3').verbose();
// Define o caminho para o arquivo do banco de dados SQLite.
const dbPath = './infra/database.db';

// --- Funções de Conexão com o Banco de Dados ---

// Função que abre a conexão com o banco de dados.
// Retorna uma instância do banco de dados.
function openDbConnection() {
  // `sqlite3.OPEN_READWRITE` permite leitura e escrita no banco.
  // Se houver um erro, ele é exibido no console.
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error('Erro ao abrir o banco de dados:', err.message);
  });
}

// --- Funções de Consulta (CRUD) ---

// GET ALL (Obter todas as baladas)
// Função assíncrona que busca todas as baladas e executa um callback com o resultado.
function getAllBaladas(callback) {
  // Abre a conexão com o banco de dados.
  const db = openDbConnection();
  // `db.all` executa uma consulta SELECT que retorna todas as linhas que correspondem à query.
  // O primeiro argumento é a query SQL, o segundo são os parâmetros (nesse caso, nenhum),
  // e o terceiro é a função de callback que recebe um erro (err) e as linhas (rows).
  db.all("SELECT * FROM baladas", [], (err, rows) => {
    // Fecha a conexão com o banco de dados após a operação.
    db.close();
    // Chama o callback com o erro e as linhas encontradas.
    callback(err, rows);
  });
}

// GET BY ID (Obter balada por ID)
// Busca uma única balada com base no seu ID.
function getBaladaById(id, callback) {
  const db = openDbConnection();
  // `db.get` executa uma consulta SELECT que retorna apenas a primeira linha encontrada.
  // `?` é um placeholder para evitar SQL Injection. O valor é passado no array `[id]`.
  db.get("SELECT * FROM baladas WHERE id = ?", [id], (err, row) => {
    db.close();
    // `row` conterá o objeto da balada ou `undefined` se não for encontrada.
    callback(err, row);
  });
}

// GET BY cidade (Obter baladas por cidade)
// Busca baladas por um nome de cidade, usando a cláusula `LIKE` para uma busca parcial.
function getBaladasByCidade(cidade, callback) {
  const db = openDbConnection();
  // `%${cidade}%` permite que a busca encontre a cidade mesmo que o nome seja apenas parte de uma string maior.
  db.all("SELECT * FROM baladas WHERE cidade LIKE ?", [`%${cidade}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY data (Obter baladas por data)
// Busca baladas com base na data exata.
function getBaladasByData(data, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE data = ?", [data], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY nome (Obter baladas por nome)
// Busca baladas por um nome, usando a cláusula `LIKE` para uma busca parcial.
function getBaladasByNome(nome, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE nome LIKE ?", [`%${nome}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY tipo (Obter baladas por tipo)
// Busca baladas por um tipo, usando a cláusula `LIKE` para uma busca parcial.
function getBaladasByTipo(tipo, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE tipo LIKE ?", [`%${tipo}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// CREATE (Criar uma nova balada)
// Insere uma nova balada no banco de dados.
function createBalada(balada, callback) {
  // Desestrutura o objeto `balada` para pegar os valores necessários.
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  // `db.run` executa uma query que não retorna dados (como INSERT, UPDATE, DELETE).
  // Usa `?` para os valores e os passa no array.
  db.run("INSERT INTO baladas (nome, cidade, endereco, tipo, data) VALUES (?, ?, ?, ?, ?)",
    [nome, cidade, endereco, tipo, data],
    // A função de callback de `db.run` tem o contexto (`this`) com informações úteis, como o ID da última inserção.
    function(err) {
      db.close();
      // `this.lastID` retorna o ID da linha que acabou de ser inserida.
      callback(err, { id: this.lastID });
    });
}

// UPDATE (Atualizar uma balada)
// Atualiza uma balada com base no seu ID.
function updateBalada(id, balada, callback) {
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  // A query UPDATE define os novos valores para os campos e usa a cláusula WHERE para especificar qual balada atualizar.
  db.run("UPDATE baladas SET nome = ?, cidade = ?, endereco = ?, tipo = ?, data = ? WHERE id = ?",
    [nome, cidade, endereco, tipo, data, id],
    function(err) {
      db.close();
      // `this.changes` retorna o número de linhas que foram modificadas.
      callback(err, { changes: this.changes });
    });
}

// DELETE (Deletar uma balada)
// Deleta uma balada com base no seu ID.
function deleteBalada(id, callback) {
  const db = openDbConnection();
  // A query DELETE remove a linha que corresponde ao ID.
  db.run("DELETE FROM baladas WHERE id = ?", [id], function(err) {
    db.close();
    // Retorna o número de linhas afetadas.
    callback(err, { changes: this.changes });
  });
}

// --- Exportação dos Métodos ---

// Exporta todas as funções para que possam ser usadas em outros arquivos (como o controller).
module.exports = {
  getAllBaladas,
  getBaladaById,
  getBaladasByCidade,
  getBaladasByData,
  getBaladasByNome,
  getBaladasByTipo,
  createBalada,
  updateBalada,
  deleteBalada
};