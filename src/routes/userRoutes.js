c// src/routes/userRoutes.js (trecho do arquivo)
const express = require('express');
const router = express.Router();
const AppError = require('../utils/AppError');
const validate = require('../middlewares/validate'); // Importa o middleware
const { createUserSchema } = require('../schemas/userSchema'); // Importa o schema

let users = [{ id: 1, name: 'João Silva', email: 'joaodasisi@email.com' }];

router.get('/users', (req, res) => {
  res.json({ success: true, data: users });
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Cadastra um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Maria Souza
 *               email:
 *                 type: string
 *                 example: maria@email.com
 *     responses:
 *       201:
 *         description: Usuário cadastrado com sucesso
 *       400:
 *         description: Dados de requisição inválidos
 */
// APLICADO O MIDDLEWARE DE VALIDAÇÃO ANTES DO HANDLER DA ROTA:
router.post('/users', validate(createUserSchema), (req, res) => {
  const { name, email } = req.body;

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, data: newUser });
});

module.exports = router;