// models/balada.js
const sqlite3 = require('sqlite3').verbose();
const dbPath = './infra/database.db';

// Função para abrir a conexão com o banco de dados
function openDbConnection() {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error('Erro ao abrir o banco de dados:', err.message);
  });
}

/* ---------------- GET ---------------- */

// Busca todas as baladas
function getAllBaladas(callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas", [], (err, rows) => {
    db.close(); // Fecha conexão
    callback(err, rows); // Retorna os resultados
  });
}

// Busca balada pelo ID
function getBaladaById(id, callback) {
  const db = openDbConnection();
  db.get("SELECT * FROM baladas WHERE id = ?", [id], (err, row) => {
    db.close();
    callback(err, row);
  });
}

// Busca baladas pela cidade (LIKE → aceita parte do texto)
function getBaladasByCidade(cidade, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE cidade LIKE ?", [`%${cidade}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// Busca baladas pela data (exata)
function getBaladasByData(data, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE data = ?", [data], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// Busca baladas pelo nome
function getBaladasByNome(nome, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE nome LIKE ?", [`%${nome}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// Busca baladas pelo tipo
function getBaladasByTipo(tipo, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE tipo LIKE ?", [`%${tipo}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

/* ---------------- CREATE ---------------- */

// Cria uma nova balada
function createBalada(balada, callback) {
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  db.run(
    "INSERT INTO baladas (nome, cidade, endereco, tipo, data) VALUES (?, ?, ?, ?, ?)",
    [nome, cidade, endereco, tipo, data],
    function(err) {
      db.close();
      // Retorna o ID do registro inserido
      callback(err, { id: this.lastID });
    }
  );
}

/* ---------------- UPDATE ---------------- */

// Atualiza uma balada existente
function updateBalada(id, balada, callback) {
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  db.run(
    "UPDATE baladas SET nome = ?, cidade = ?, endereco = ?, tipo = ?, data = ? WHERE id = ?",
    [nome, cidade, endereco, tipo, data, id],
    function(err) {
      db.close();
      // Retorna quantas linhas foram alteradas
      callback(err, { changes: this.changes });
    }
  );
}

/* ---------------- DELETE ---------------- */

// Deleta uma balada pelo ID
function deleteBalada(id, callback) {
  const db = openDbConnection();
  db.run("DELETE FROM baladas WHERE id = ?", [id], function(err) {
    db.close();
    // Retorna quantas linhas foram deletadas
    callback(err, { changes: this.changes });
  });
}

// Exporta todas as funções para o controller poder usar
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
