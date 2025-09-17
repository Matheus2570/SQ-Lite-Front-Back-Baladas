// routes/baladaRoutes.js
const express = require('express');
const router = express.Router(); // Criamos um "mini app" só para rotas
const baladaController = require('../controllers/baladaController'); // Importa o controller

/* ---------------- ROTAS CRUD ---------------- */

// LISTAR todas as baladas
// Exemplo: GET http://localhost:3000/baladas/
router.get('/', baladaController.getAllBaladas);

// BUSCAR balada por ID
// Exemplo: GET http://localhost:3000/baladas/1
router.get('/:id', baladaController.getBaladaById);

// BUSCAR baladas por cidade
// Exemplo: GET http://localhost:3000/baladas/cidade/São Paulo
router.get('/cidade/:cidade', baladaController.getBaladasByCidade);

// BUSCAR baladas por data
// Exemplo: GET http://localhost:3000/baladas/data/2025-09-20
router.get('/data/:data', baladaController.getBaladasByData);

// BUSCAR baladas por nome
// Exemplo: GET http://localhost:3000/baladas/nome/Festa
router.get('/nome/:nome', baladaController.getBaladasByNome);

// BUSCAR baladas por tipo
// Exemplo: GET http://localhost:3000/baladas/tipo/Eletrônica
router.get('/tipo/:tipo', baladaController.getBaladasByTipo);

/* ---------------- CRIAÇÃO ---------------- */

// CRIAR nova balada
// Exemplo: POST http://localhost:3000/baladas/
// Body JSON: { "nome": "Balada X", "cidade": "SP", "endereco": "...", "tipo": "Sertanejo", "data": "2025-09-25" }
router.post('/', baladaController.createBalada);

/* ---------------- ATUALIZAÇÃO ---------------- */

// ATUALIZAR uma balada existente
// Exemplo: PUT http://localhost:3000/baladas/1
// Body JSON: { "nome": "Novo Nome", ... }
router.put('/:id', baladaController.updateBalada);

/* ---------------- EXCLUSÃO ---------------- */

// DELETAR uma balada pelo ID
// Exemplo: DELETE http://localhost:3000/baladas/1
router.delete('/:id', baladaController.deleteBalada);

/* ---------------- EXPORTA ---------------- */

module.exports = router; // Exporta para ser usado no app principal (app.js / server.js)
