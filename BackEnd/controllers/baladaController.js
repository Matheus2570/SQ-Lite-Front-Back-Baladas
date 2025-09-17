// controllers/baladaController.js
const Balada = require('../models/balada');

// GET ALL
exports.getAllBaladas = (req, res) => {
  Balada.getAllBaladas((err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY ID
exports.getBaladaById = (req, res) => {
  Balada.getBaladaById(req.params.id, (err, balada) => {
    if (err) res.status(500).send(err);
    else if (balada) res.json(balada);
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};

// GET BY cidade
exports.getBaladasByCidade = (req, res) => {
  Balada.getBaladasByCidade(req.params.cidade, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY data
exports.getBaladasByData = (req, res) => {
  Balada.getBaladasByData(req.params.data, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY nome
exports.getBaladasByNome = (req, res) => {
  Balada.getBaladasByNome(req.params.nome, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY tipo
exports.getBaladasByTipo = (req, res) => {
  Balada.getBaladasByTipo(req.params.tipo, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// CREATE
exports.createBalada = (req, res) => {
  Balada.createBalada(req.body, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(201).json(result);
  });
};

// UPDATE
exports.updateBalada = (req, res) => {
  Balada.updateBalada(req.params.id, req.body, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.changes) res.status(200).json(result);
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};

// DELETE
exports.deleteBalada = (req, res) => {
  Balada.deleteBalada(req.params.id, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.changes) res.status(200).json({ message: 'Balada deletada com sucesso' });
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};
