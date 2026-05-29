const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Rota pública - candidatos se candidatando a vagas
router.post('/apply/:jobId', async (req, res) => {
  const { name, email, phone, city, experience, linkedin, portfolio, salaryExpectation, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.jobId },
      select: { id: true, companyId: true, status: true },
    });

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    if (job.status !== 'ATIVO') {
      return res.status(400).json({ error: 'Esta vaga não está aceitando candidaturas' });
    }

    const candidate = await prisma.candidate.create({
      data: {
        jobId: job.id,
        companyId: job.companyId,
        name,
        email,
        phone: phone || '',
        city: city || '',
        experience: experience || '',
        linkedin,
        portfolio,
        salaryExpectation,
        message,
        resumeUrl: '',
      },
    });

    res.status(201).json({ candidate });
  } catch (error) {
    console.error('Erro ao candidatar:', error);
    res.status(500).json({ error: 'Erro ao enviar candidatura' });
  }
});

// Rotas protegidas - apenas para a empresa
router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const candidates = await prisma.candidate.findMany({
      where: { companyId: req.companyId },
      include: { job: { select: { title: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ candidates });
  } catch (error) {
    console.error('Erro ao buscar candidatos:', error);
    res.status(500).json({ error: 'Erro ao buscar candidatos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const candidate = await prisma.candidate.findFirst({
      where: { id: req.params.id, companyId: req.companyId },
      include: { job: true },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidato não encontrado' });
    }

    res.json({ candidate });
  } catch (error) {
    console.error('Erro ao buscar candidato:', error);
    res.status(500).json({ error: 'Erro ao buscar candidato' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['RECEBIDO', 'EM_ANALISE', 'ENTREVISTA', 'CONTRATADO', 'REPROVADO'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Status inválido. Use: RECEBIDO, EM_ANALISE, ENTREVISTA, CONTRATADO ou REPROVADO',
    });
  }

  try {
    const candidate = await prisma.candidate.findFirst({
      where: { id: req.params.id, companyId: req.companyId },
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidato não encontrado' });
    }

    const updated = await prisma.candidate.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ candidate: updated });
  } catch (error) {
    console.error('Erro ao atualizar status do candidato:', error);
    res.status(500).json({ error: 'Erro ao atualizar status do candidato' });
  }
});

module.exports = router;
