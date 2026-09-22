const {z}= require("zod")

const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'O nome é obrigatório.' })
      .min(3, 'O nome deve ter no mínimo 3 caracteres.'),
    email: z
      .string({ required_error: 'O e-mail é obrigatório.' })
      .email('Forneça um e-mail válido.'),
  }),
});

module.exports = { createUserSchema };