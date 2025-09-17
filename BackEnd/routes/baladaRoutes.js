// routes/baladaRoutes.js
// Importa o módulo 'express' para criar um roteador.
const express = require('express');
// Cria uma instância de um roteador Express. Isso permite agrupar rotas relacionadas.
const router = express.Router();
// Importa o 'baladaController', que contém as funções de lógica de negócios (controladores) para as rotas.
const baladaController = require('../controllers/baladaController');

// --- Definição das Rotas (Endpoints da API) ---

// Rotas de Leitura (GET)
// Rota para obter todas as baladas.
// Quando uma requisição GET é feita para a URL raiz ('/'), a função 'getAllBaladas' do controlador é executada.
router.get('/', baladaController.getAllBaladas);

// Rota para obter uma balada por ID.
// ':id' é um parâmetro de URL. O valor que vier depois de '/' será capturado e enviado para o controlador.
router.get('/:id', baladaController.getBaladaById);

// Rota para obter baladas por cidade.
router.get('/cidade/:cidade', baladaController.getBaladasByCidade);

// Rota para obter baladas por data.
router.get('/data/:data', baladaController.getBaladasByData);

// Rota para obter baladas por nome.
router.get('/nome/:nome', baladaController.getBaladasByNome);

// Rota para obter baladas por tipo.
router.get('/tipo/:tipo', baladaController.getBaladasByTipo);

// Rotas de Escrita (CREATE, UPDATE, DELETE)

// Rota para criar uma nova balada.
// Quando uma requisição POST é feita para '/', a função 'createBalada' é chamada.
router.post('/', baladaController.createBalada);

// Rota para atualizar uma balada.
// ':id' especifica qual balada será atualizada.
// A requisição PUT é usada para modificar um recurso existente.
router.put('/:id', baladaController.updateBalada);

// Rota para deletar uma balada.
// ':id' especifica qual balada será deletada.
// A requisição DELETE é usada para remover um recurso.
router.delete('/:id', baladaController.deleteBalada);

// Exporta o roteador para que ele possa ser usado no arquivo principal da aplicação (geralmente `app.js` ou `server.js`).
module.exports = router;