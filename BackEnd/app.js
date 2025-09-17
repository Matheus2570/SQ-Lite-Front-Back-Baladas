// app.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware para JSON
app.use(express.json());

// Rotas de baladas
const baladaRoutes = require('./routes/baladaRoutes');
app.use('/baladas', baladaRoutes);

// Iniciando servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
