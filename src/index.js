require('express-async-errors');
require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const { connectDB } = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Middlewares para parse do corpo de requisições JSON
app.use(express.json());

// 2. Rota de documentação Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs)); // Serve a interface no /api-docs

// 3. Registrar Rotas da aplicação
app.use('/api', userRoutes);
app.use('/api', todoRoutes);

// 4. Middleware Global de Tratamento de Erros (DEVE FICAR POR ÚLTIMO)
app.use(errorHandler); //

const startServer = async () => {
  const connected = await connectDB();

  if (!connected) {
    console.log('Continuando em modo sem banco de dados.');
  }

  app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
    console.log(`Documentação Swagger em: http://localhost:${PORT}/api-docs`);
  });
};

startServer();
