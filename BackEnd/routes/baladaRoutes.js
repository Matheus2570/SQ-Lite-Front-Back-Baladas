// routes/baladaRoutes.js
const express = require('express');
const router = express.Router();
const baladaController = require('../controllers/baladaController');

// CRUD
router.get('/', baladaController.getAllBaladas);
router.get('/:id', baladaController.getBaladaById);
router.get('/cidade/:cidade', baladaController.getBaladasByCidade);
router.get('/data/:data', baladaController.getBaladasByData);
router.get('/nome/:nome', baladaController.getBaladasByNome);
router.get('/tipo/:tipo', baladaController.getBaladasByTipo);

router.post('/', baladaController.createBalada);
router.put('/:id', baladaController.updateBalada);
router.delete('/:id', baladaController.deleteBalada);

module.exports = router;
