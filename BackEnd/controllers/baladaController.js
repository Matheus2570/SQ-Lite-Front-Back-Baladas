// controllers/baladaController.js
// Importa o modelo 'Balada' para interagir com o banco de dados.
const Balada = require('../models/balada');

// --- Métodos do Controller ---

// GET ALL (Obter todas as baladas)
// Exporta a função que lida com a requisição de obter todas as baladas.
exports.getAllBaladas = (req, res) => {
  // Chama o método 'getAllBaladas' do modelo 'Balada'.
  // Ele passa uma função de callback que será executada quando a operação no banco terminar.
  Balada.getAllBaladas((err, baladas) => {
    // Se houver um erro, envia uma resposta com status 500 (Erro interno do servidor).
    if (err) res.status(500).send(err);
    // Se não houver erro, envia as baladas encontradas como uma resposta JSON.
    else res.json(baladas);
  });
};

// GET BY ID (Obter balada por ID)
// Exporta a função que lida com a requisição de obter uma balada específica pelo seu ID.
exports.getBaladaById = (req, res) => {
  // Chama o método 'getBaladaById' do modelo 'Balada', passando o ID que vem dos parâmetros da URL (req.params.id).
  Balada.getBaladaById(req.params.id, (err, balada) => {
    // Se houver um erro, envia uma resposta com status 500.
    if (err) res.status(500).send(err);
    // Se uma balada for encontrada, envia-a como resposta JSON.
    else if (balada) res.json(balada);
    // Se nenhuma balada for encontrada (o valor é 'false' ou 'undefined'), envia uma resposta com status 404 (Não Encontrada).
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};

// GET BY cidade (Obter baladas por cidade)
// Similar ao método 'getBaladaById', mas busca por um parâmetro diferente.
exports.getBaladasByCidade = (req, res) => {
  // Busca as baladas pela cidade passada nos parâmetros da URL (req.params.cidade).
  Balada.getBaladasByCidade(req.params.cidade, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY data (Obter baladas por data)
// Busca as baladas pela data.
exports.getBaladasByData = (req, res) => {
  Balada.getBaladasByData(req.params.data, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY nome (Obter baladas por nome)
// Busca as baladas pelo nome.
exports.getBaladasByNome = (req, res) => {
  Balada.getBaladasByNome(req.params.nome, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// GET BY tipo (Obter baladas por tipo)
// Busca as baladas pelo tipo.
exports.getBaladasByTipo = (req, res) => {
  Balada.getBaladasByTipo(req.params.tipo, (err, baladas) => {
    if (err) res.status(500).send(err);
    else res.json(baladas);
  });
};

// CREATE (Criar uma nova balada)
// Exporta a função que lida com a requisição de criação de uma nova balada.
exports.createBalada = (req, res) => {
  // Chama o método 'createBalada' do modelo, passando os dados do corpo da requisição (req.body).
  Balada.createBalada(req.body, (err, result) => {
    if (err) res.status(500).send(err);
    // Se a balada for criada com sucesso, envia uma resposta com status 201 (Criado) e o resultado da operação.
    else res.status(201).json(result);
  });
};

// UPDATE (Atualizar uma balada existente)
// Exporta a função que lida com a requisição de atualização.
exports.updateBalada = (req, res) => {
  // Chama o método 'updateBalada' com o ID da URL e os dados do corpo da requisição.
  Balada.updateBalada(req.params.id, req.body, (err, result) => {
    if (err) res.status(500).send(err);
    // Verifica se a atualização afetou alguma linha (result.changes é maior que 0).
    // Se sim, envia uma resposta de sucesso com status 200 (OK).
    else if (result.changes) res.status(200).json(result);
    // Se nenhuma linha foi alterada, significa que a balada não foi encontrada.
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};

// DELETE (Deletar uma balada)
// Exporta a função que lida com a requisição de exclusão.
exports.deleteBalada = (req, res) => {
  // Chama o método 'deleteBalada' com o ID da URL.
  Balada.deleteBalada(req.params.id, (err, result) => {
    if (err) res.status(500).send(err);
    // Verifica se a exclusão afetou alguma linha.
    else if (result.changes) res.status(200).json({ message: 'Balada deletada com sucesso' });
    // Se não afetou, a balada não foi encontrada.
    else res.status(404).send({ message: 'Balada não encontrada' });
  });
};