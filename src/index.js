require('express-async-errors'); // Captura exceções em funções assíncronas automaticamente
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares para parse do corpo de requisições JSON
app.use(express.json());

// 2. Rota de documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs)); // Serve a interface no /api-docs

// 3. Registrar Rotas da aplicação
app.use('/api', userRoutes);

// 4. Middleware Global de Tratamento de Erros (DEVE FICAR POR ÚLTIMO)
app.use(errorHandler); //

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`);
  console.log(` Documentação Swagger em: http://localhost:${PORT}/api-docs`);
});
