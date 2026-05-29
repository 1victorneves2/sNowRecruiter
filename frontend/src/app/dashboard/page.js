'use client';

import { useState, useEffect } from 'react';
import { loginCompany, getJobs, getCandidates, createJob, updateCandidateStatus } from '@/utils/api';

const STATUS_CONFIG = {
  RECEBIDO:   { bg: '#fef3c7', color: '#92400e' },
  EM_ANALISE: { bg: '#dbeafe', color: '#1d4ed8' },
  ENTREVISTA: { bg: '#ede9fe', color: '#7c3aed' },
  CONTRATADO: { bg: '#d1fae5', color: '#059669' },
  REPROVADO:  { bg: '#fee2e2', color: '#dc2626' },
};

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState('');
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    modality: 'PRESENCIAL',
    location: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      setToken(saved);
      loadData(saved);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await loginCompany(email, password);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      loadData(data.token);
    } catch (err) {
      setError('Erro ao fazer login: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (authToken) => {
    setDataLoading(true);
    try {
      const [jobsData, candidatesData] = await Promise.all([
        getJobs(authToken),
        getCandidates(authToken),
      ]);
      setJobs(jobsData.jobs || []);
      setCandidates(candidatesData.candidates || []);
    } catch (err) {
      setError('Erro ao carregar dados: ' + err.message);
    } finally {
      setDataLoading(false);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createJob(token, newJob);
      setNewJob({ title: '', description: '', requirements: '', salary: '', modality: 'PRESENCIAL', location: '' });
      loadData(token);
    } catch (err) {
      setError('Erro ao criar vaga: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      await updateCandidateStatus(token, candidateId, newStatus);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      setError('Erro ao atualizar status: ' + err.message);
    }
  };

  const handleLogout = () => {
    setToken('');
    setJobs([]);
    setCandidates([]);
    localStorage.removeItem('token');
  };

  if (!token) {
    return (
      <div className="container" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div className="card">
          <h2>Login - Dashboard RH</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="button"
              style={{ width: '100%' }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
            Use os dados da empresa que você registrou.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>Dashboard RH</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {dataLoading && <span style={{ fontSize: '13px', color: '#666' }}>Atualizando...</span>}
          <button onClick={() => loadData(token)} className="button" style={{ background: '#6b7280' }}>
            Atualizar
          </button>
          <button onClick={handleLogout} className="button" style={{ background: '#dc2626' }}>
            Sair
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="card">
          <h3>Nova Vaga</h3>
          <form onSubmit={handleCreateJob}>
            <input
              type="text"
              placeholder="Título da vaga"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Descrição"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              className="input"
              style={{ minHeight: '80px' }}
              required
            />
            <input
              type="text"
              placeholder="Requisitos"
              value={newJob.requirements}
              onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Salário (ex: R$ 3.000 - R$ 5.000)"
              value={newJob.salary}
              onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Localização (ex: São Paulo, SP)"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              className="input"
            />
            <select
              value={newJob.modality}
              onChange={(e) => setNewJob({ ...newJob, modality: e.target.value })}
              className="input"
            >
              <option value="PRESENCIAL">Presencial</option>
              <option value="HIBRIDO">Híbrido</option>
              <option value="REMOTO">Remoto</option>
            </select>
            <button type="submit" disabled={loading} className="button" style={{ width: '100%', background: '#10b981' }}>
              {loading ? 'Criando...' : 'Criar Vaga'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Vagas ({jobs.length})</h3>
          {jobs.length === 0 ? (
            <p style={{ color: '#999' }}>Nenhuma vaga criada ainda</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} style={{ padding: '10px', borderBottom: '1px solid #eee', fontSize: '14px' }}>
                <strong>{job.title}</strong>
                <p style={{ margin: '4px 0', color: '#666', fontSize: '12px' }}>
                  {job.modality} {job.location ? `· ${job.location}` : ''}
                </p>
                <p style={{ margin: '4px 0', color: '#2563eb', fontSize: '12px' }}>
                  {job._count?.candidates || 0} candidato(s)
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3>Candidatos ({candidates.length})</h3>
        {candidates.length === 0 ? (
          <p style={{ color: '#999' }}>Nenhum candidato ainda</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: '14px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Nome</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Vaga</th>
                  <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => {
                  const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.RECEBIDO;
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px' }}>{c.name}</td>
                      <td style={{ padding: '10px' }}>{c.email}</td>
                      <td style={{ padding: '10px', color: '#666', fontSize: '12px' }}>
                        {c.job?.title || '-'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <select
                          value={c.status}
                          onChange={(e) => handleStatusChange(c.id, e.target.value)}
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {Object.keys(STATUS_CONFIG).map((s) => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
