const validate = (schema) => (req, res, next) => {
  try {
    // Valida body, query e params de acordo com o schema fornecido
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // Dados válidos -> passa para o controller
  } catch (error) {
    next(error); // Encaminha o ZodError diretamente para o Global Error Handler
  }
};

module.exports = validate;