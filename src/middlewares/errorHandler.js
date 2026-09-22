// src/middlewares/errorHandler.js
const { ZodError } = require('zod');

const errorHandler = (err, req, res, next) => {
  console.error('LOG DE ERRO:', err);

  // 1. Tratar erros de validação do Zod
  if (err instanceof ZodError) {
    const issues = err.issues.map((issue) => ({
      field: issue.path.join('.').replace('body.', ''), // Nome do campo com falha
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: 'Falha na validação dos dados.',
        statusCode: 400,
        details: issues,
      },
    });
  }

  // 2. Tratar erros customizados da nossa classe AppError
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erro interno no servidor';

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = errorHandler;