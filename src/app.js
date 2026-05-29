require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const candidateRoutes = require('./routes/candidates');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 🧪 ENDPOINT DE TESTE - Criar empresa
app.get('/api/test/register', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        email: 'test@company.com',
        password: hashedPassword,
      },
    });

    res.json({ success: true, message: 'Empresa criada!', company: { id: company.id, name: company.name, email: company.email } });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
