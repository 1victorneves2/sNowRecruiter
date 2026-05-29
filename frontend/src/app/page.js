'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [apiStatus, setApiStatus] = useState('verificando...');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    fetch(`${apiUrl}/health`)
      .then((r) => r.json())
      .then((d) => setApiStatus(d.status === 'ok' ? 'Online' : 'Degradado'))
      .catch(() => setApiStatus('Offline'));
  }, []);

  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '40px 0' }}>
        <h2>Bem-vindo ao sNowRecruiter</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          MicroSaaS de Recrutamento e Seleção
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div className="card">
          <h3>Para RHs</h3>
          <p>Gerencie vagas e candidatos em um só lugar.</p>
          <Link href="/dashboard">
            <button className="button" style={{ width: '100%' }}>
              Ir para Dashboard
            </button>
          </Link>
        </div>

        <div className="card">
          <h3>Testes da API</h3>
          <p>Teste os endpoints disponíveis.</p>
          <Link href="/admin">
            <button className="button" style={{ width: '100%' }}>
              Abrir Testes
            </button>
          </Link>
        </div>

        <div className="card">
          <h3>Status</h3>
          <p>
            Backend:{' '}
            <span style={{
              color: apiStatus === 'Online' ? '#059669' : apiStatus === 'Offline' ? '#dc2626' : '#d97706',
              fontWeight: 'bold',
            }}>
              {apiStatus}
            </span>
          </p>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            API: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}
          </p>
        </div>
      </div>
    </div>
  );
}
