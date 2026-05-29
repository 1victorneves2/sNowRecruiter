const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      where: { companyId: req.companyId },
      include: { _count: { select: { candidates: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ jobs });
  } catch (error) {
    console.error('Erro ao buscar vagas:', error);
    res.status(500).json({ error: 'Erro ao buscar vagas' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, requirements, modality, location, salary } = req.body;

  if (!title || !description || !requirements) {
    return res.status(400).json({ error: 'Título, descrição e requisitos são obrigatórios' });
  }

  try {
    const job = await prisma.job.create({
      data: {
        companyId: req.companyId,
        title,
        description,
        requirements,
        modality: modality || 'PRESENCIAL',
        location: location || '',
        salary: salary || '',
      },
    });
    res.status(201).json({ job });
  } catch (error) {
    console.error('Erro ao criar vaga:', error);
    res.status(500).json({ error: 'Erro ao criar vaga' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id, companyId: req.companyId },
      include: { candidates: true, _count: { select: { candidates: true } } },
    });

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Erro ao buscar vaga:', error);
    res.status(500).json({ error: 'Erro ao buscar vaga' });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['ATIVO', 'ENCERRADO', 'PAUSADO'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status inválido. Use: ATIVO, ENCERRADO ou PAUSADO' });
  }

  try {
    const job = await prisma.job.findFirst({
      where: { id: req.params.id, companyId: req.companyId },
    });

    if (!job) {
      return res.status(404).json({ error: 'Vaga não encontrada' });
    }

    const updated = await prisma.job.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({ job: updated });
  } catch (error) {
    console.error('Erro ao atualizar status da vaga:', error);
    res.status(500).json({ error: 'Erro ao atualizar status da vaga' });
  }
});

module.exports = router;
