// Importa o Model, que contém as funções responsáveis por executar o SQL
const Balada = require('../models/balada');

// =======================
// GET ALL - Buscar todas as baladas
// =======================
exports.getAllBaladas = (req, res) => {
  // Chama a função do Model
  Balada.getAllBaladas((err, baladas) => {
    if (err) res.status(500).send(err);   // Se deu erro → HTTP 500
    else res.json(baladas);               // Se deu certo → retorna JSON com os dados
  });
};

// =======================
// GET BY ID - Buscar balada por ID
// =======================
exports.getBaladaById = (req, res) => {
  // Pega o ID que veio da URL: /baladas/:id
  Balada.getBaladaById(req.params.id, (err, balada) => {
    if (err) res.status(500).send(err);   
    else if (balada) res.json(balada);    // Se encontrou → retorna a balada
    else res.status(404).send({ message: 'Balada não encontrada' }); // Se não → 404
  });
};

// =======================
// GET BY CIDADE - Buscar baladas por cidade
// =======================
exports.getBaladasByCidade = (req, res) => {
  // Pega a cidade da URL: /baladas/cidade/:cidade
  Balada.getBaladasByCidade(req.params.cidade, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// =======================
// GET BY DATA - Buscar baladas por data
// =======================
exports.getBaladasByData = (req, res) => {
  // Pega a data da URL: /baladas/data/:data
  Balada.getBaladasByData(req.params.data, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// =======================
// GET BY NOME - Buscar baladas por nome
// =======================
exports.getBaladasByNome = (req, res) => {
  // Pega o nome da URL: /baladas/nome/:nome
  Balada.getBaladasByNome(req.params.nome, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// =======================
// GET BY TIPO - Buscar baladas por tipo
// =======================
exports.getBaladasByTipo = (req, res) => {
  // Pega o tipo da URL: /baladas/tipo/:tipo
  Balada.getBaladasByTipo(req.params.tipo, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// =======================
// CREATE - Criar uma nova balada
// =======================
exports.createBalada = (req, res) => {
  // Os dados vêm no corpo da requisição (req.body)
  Balada.createBalada(req.body, (err, result) => {
    if (err) res.status(500).send(err);
    else res.status(201).json(result);   // 201 = Created
  });
};

// =======================
// UPDATE - Atualizar uma balada
// =======================
exports.updateBalada = (req, res) => {
  // Pega o ID da rota + novos dados do corpo
  Balada.updateBalada(req.params.id, req.body, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.changes) res.status(200).json(result);  // Se atualizou → 200
    else res.status(404).send({ message: 'Balada não encontrada' }); // Se não → 404
  });
};

// =======================
// DELETE - Deletar balada
// =======================
exports.deleteBalada = (req, res) => {
  // Pega o ID da rota: /baladas/:id
  Balada.deleteBalada(req.params.id, (err, result) => {
    if (err) res.status(500).send(err);
    else if (result.changes) res.status(200).json({ message: 'Balada deletada com sucesso' });
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};
