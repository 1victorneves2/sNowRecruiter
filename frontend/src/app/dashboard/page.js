'use client';

import { useState, useEffect } from 'react';

const STATUS_BADGE = {
  RECEBIDO:   'badge badge-warning',
  EM_ANALISE: 'badge badge-info',
  ENTREVISTA: 'badge badge-purple',
  CONTRATADO: 'badge badge-success',
  REPROVADO:  'badge badge-error',
};

export default function Dashboard() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    modality: 'PRESENCIAL',
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

  // Restaura sessão ao recarregar a página
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
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao fazer login');
      setToken(data.token);
      localStorage.setItem('token', data.token);
      loadData(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async (authToken) => {
    try {
      const [jobsRes, candRes] = await Promise.all([
        fetch(`${API_URL}/jobs`, { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch(`${API_URL}/candidates`, { headers: { Authorization: `Bearer ${authToken}` } }),
      ]);
      const jobsData = await jobsRes.json();
      const candData = await candRes.json();
      setJobs(jobsData.jobs || []);
      setCandidates(candData.candidates || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao criar vaga');
      setFormData({ title: '', description: '', requirements: '', location: '', salary: '', modality: 'PRESENCIAL' });
      loadData(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/candidates/${candidateId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, status: newStatus } : c))
      );
    } catch (err) {
      setError('Erro ao atualizar status: ' + err.message);
    }
  };

  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '60px auto' }}>
        <div className="card">
          <h2 style={{ marginBottom: '20px' }}>Login</h2>
          {error && <div className="error">{error}</div>}
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email da empresa"
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
            <button type="submit" disabled={loading} className="button" style={{ width: '100%' }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
            💡 Registre sua empresa na página de Testes da API
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0 40px 0' }}>
        <h2>Dashboard RH</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => loadData(token)}
            className="button"
            style={{ background: '#6b7280' }}
          >
            Atualizar
          </button>
          <button
            onClick={() => {
              setToken('');
              setJobs([]);
              setCandidates([]);
              localStorage.removeItem('token');
            }}
            className="button"
            style={{ background: '#dc2626' }}
          >
            Sair
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="grid" style={{ marginBottom: '40px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px' }}>➕ Nova Vaga</h3>
          <form onSubmit={handleCreateJob}>
            <input
              type="text"
              placeholder="Título da vaga"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              style={{ minHeight: '100px' }}
              required
            />
            <input
              type="text"
              placeholder="Requisitos"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Localização (ex: São Paulo, SP)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input"
            />
            <input
              type="text"
              placeholder="Salário (ex: R$ 3.000 - R$ 5.000)"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="input"
            />
            <select
              value={formData.modality}
              onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
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
          <h3 style={{ marginBottom: '16px' }}>📋 Vagas ({jobs.length})</h3>
          {jobs.length === 0 ? (
            <p style={{ color: '#64748b' }}>Nenhuma vaga criada ainda</p>
          ) : (
            jobs.map((job) => (
              <div key={job.id} style={{ paddingBottom: '15px', marginBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 4px 0' }}>{job.title}</h4>
                <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 4px 0' }}>
                  {job.modality} {job.location ? `· ${job.location}` : ''}
                </p>
                <span className="badge badge-info" style={{ fontSize: '11px' }}>
                  {job._count?.candidates || 0} candidato(s)
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px' }}>👥 Candidatos ({candidates.length})</h3>
        {candidates.length === 0 ? (
          <p style={{ color: '#64748b' }}>Nenhum candidato ainda</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                  <th>Vaga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c) => (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td style={{ fontSize: '12px' }}>{c.email}</td>
                    <td style={{ fontSize: '12px', color: '#64748b' }}>{c.job?.title || '-'}</td>
                    <td>
                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className={STATUS_BADGE[c.status] || 'badge badge-info'}
                        style={{ border: 'none', cursor: 'pointer', fontWeight: '600' }}
                      >
                        {Object.keys(STATUS_BADGE).map((s) => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
