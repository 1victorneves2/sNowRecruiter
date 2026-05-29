'use client';

import { useState } from 'react';
import { registerCompany } from '@/utils/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function Admin() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const testEndpoint = async (endpoint, options = {}) => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(`${API_URL}${endpoint}`, options);
      const data = await res.json();
      setResponse({ endpoint, status: res.status, ok: res.ok, data });
    } catch (error) {
      setResponse({ endpoint, status: null, ok: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    try {
      const data = await registerCompany(registerData.name, registerData.email, registerData.password);
      setResponse({ endpoint: '/auth/register', status: 201, ok: true, data });
    } catch (err) {
      setResponse({ endpoint: '/auth/register', status: null, ok: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Testes da API</h2>
      <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
        Base URL: <code style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{API_URL}</code>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <div className="card">
            <h3>Health Check</h3>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
              GET /health — Verifica se o servidor e banco estão ok.
            </p>
            <button onClick={() => testEndpoint('/health')} disabled={loading} className="button">
              Testar
            </button>
          </div>

          <div className="card">
            <h3>Registrar Empresa</h3>
            <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
              POST /auth/register — Cria uma conta de empresa.
            </p>
            <form onSubmit={handleRegister}>
              <input
                type="text"
                placeholder="Nome da empresa"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                className="input"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                className="input"
                required
              />
              <input
                type="password"
                placeholder="Senha (mín. 6 caracteres)"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                className="input"
                required
                minLength={6}
              />
              <button type="submit" disabled={loading} className="button" style={{ width: '100%' }}>
                {loading ? 'Registrando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>

        <div>
          {response && (
            <div className="card">
              <h3>Resultado</h3>
              <p style={{ fontSize: '13px' }}>
                <strong>Endpoint:</strong> {response.endpoint}
              </p>
              {response.status && (
                <p style={{ fontSize: '13px' }}>
                  <strong>Status HTTP:</strong>{' '}
                  <span style={{ color: response.ok ? '#059669' : '#dc2626', fontWeight: 'bold' }}>
                    {response.status}
                  </span>
                </p>
              )}
              {response.error && (
                <div className="error" style={{ marginTop: '10px' }}>
                  <strong>Erro de conexão:</strong> {response.error}
                </div>
              )}
              {response.data && (
                <pre style={{
                  background: '#f3f4f6',
                  padding: '12px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px',
                  maxHeight: '400px',
                }}>
                  {JSON.stringify(response.data, null, 2)}
                </pre>
              )}
            </div>
          )}

          {!response && !loading && (
            <div className="card" style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
              Execute um teste para ver o resultado aqui
            </div>
          )}

          {loading && (
            <div className="card" style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
              Aguardando resposta...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
