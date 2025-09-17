// app.js
const express = require('express');
const app = express();
const port = 3000; // Porta em que o servidor vai rodar

/* ---------------- MIDDLEWARE ---------------- */
// Middleware para permitir que o servidor entenda JSON no body das requisições
// Exemplo: quando você manda { "nome": "Balada X" } no POST
app.use(express.json());

/* ---------------- ROTAS ---------------- */
// Importa as rotas de baladas
const baladaRoutes = require('./routes/baladaRoutes');

// Todas as rotas de baladas vão começar com /baladas
// Exemplo: GET http://localhost:3000/baladas
app.use('/baladas', baladaRoutes);

/* ---------------- SERVIDOR ---------------- */
// Inicia o servidor na porta definida e mostra no console
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
