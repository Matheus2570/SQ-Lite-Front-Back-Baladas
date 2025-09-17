// models/balada.js
const sqlite3 = require('sqlite3').verbose();
const dbPath = './infra/database.db';

function openDbConnection() {
  return new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) console.error('Erro ao abrir o banco de dados:', err.message);
  });
}

// GET ALL
function getAllBaladas(callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas", [], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY ID
function getBaladaById(id, callback) {
  const db = openDbConnection();
  db.get("SELECT * FROM baladas WHERE id = ?", [id], (err, row) => {
    db.close();
    callback(err, row);
  });
}

// GET BY cidade
function getBaladasByCidade(cidade, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE cidade LIKE ?", [`%${cidade}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY data
function getBaladasByData(data, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE data = ?", [data], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY nome
function getBaladasByNome(nome, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE nome LIKE ?", [`%${nome}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// GET BY tipo
function getBaladasByTipo(tipo, callback) {
  const db = openDbConnection();
  db.all("SELECT * FROM baladas WHERE tipo LIKE ?", [`%${tipo}%`], (err, rows) => {
    db.close();
    callback(err, rows);
  });
}

// CREATE
function createBalada(balada, callback) {
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  db.run("INSERT INTO baladas (nome, cidade, endereco, tipo, data) VALUES (?, ?, ?, ?, ?)",
    [nome, cidade, endereco, tipo, data],
    function(err) {
      db.close();
      callback(err, { id: this.lastID });
    });
}

// UPDATE
function updateBalada(id, balada, callback) {
  const { nome, cidade, endereco, tipo, data } = balada;
  const db = openDbConnection();
  db.run("UPDATE baladas SET nome = ?, cidade = ?, endereco = ?, tipo = ?, data = ? WHERE id = ?",
    [nome, cidade, endereco, tipo, data, id],
    function(err) {
      db.close();
      callback(err, { changes: this.changes });
    });
}

// DELETE
function deleteBalada(id, callback) {
  const db = openDbConnection();
  db.run("DELETE FROM baladas WHERE id = ?", [id], function(err) {
    db.close();
    callback(err, { changes: this.changes });
  });
}

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
