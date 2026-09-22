const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('MONGODB_URI não definido. Usando armazenamento em memória.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB conectado com sucesso.');
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    return false;
  }
};

module.exports = { connectDB };
