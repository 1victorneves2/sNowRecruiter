'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [backendStatus, setBackendStatus] = useState('verificando...');
  const [dbStatus, setDbStatus] = useState('verificando...');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    fetch(`${apiUrl}/health`)
      .then((r) => r.json())
      .then((d) => {
        setBackendStatus(d.status === 'ok' ? 'Online' : 'Degradado');
        setDbStatus(d.database === 'connected' ? 'Conectado' : 'Desconectado');
      })
      .catch(() => {
        setBackendStatus('Offline');
        setDbStatus('Offline');
      });
  }, []);

  const statusBadge = (s) => {
    if (s === 'verificando...') return 'badge badge-info';
    if (s === 'Online' || s === 'Conectado') return 'badge badge-success';
    return 'badge badge-error';
  };

  return (
    <>
      <div className="hero">
        <h2>Recrutamento Inteligente</h2>
        <p>Plataforma completa para gerenciar vagas e candidatos</p>
      </div>

      <div className="grid" style={{ marginBottom: '60px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ cursor: 'pointer', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '10px' }}>📊 Dashboard RH</h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              Acesse o painel para gerenciar vagas e candidatos
            </p>
            <button className="button">Entrar</button>
          </div>
        </Link>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '10px' }}>🚀 Status</h3>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <span className={statusBadge(backendStatus)}>Backend: {backendStatus}</span>
            </div>
            <div>
              <span className={statusBadge(dbStatus)}>Database: {dbStatus}</span>
            </div>
          </div>
          <p style={{ color: '#64748b', fontSize: '12px' }}>
            {backendStatus === 'Online' ? 'Tudo pronto para produção!' : 'Verifique a conexão com o backend.'}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ marginBottom: '10px' }}>⚡ Rápido & Escalável</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Construído com tecnologias modernas e em produção
          </p>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Next.js • Express • PostgreSQL
          </div>
        </div>
      </div>
    </>
  );
}
