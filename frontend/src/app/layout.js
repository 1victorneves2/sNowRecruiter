import './globals.css';

export const metadata = {
  title: 'sNowRecruiter - MicroSaaS RH',
  description: 'Sistema de Recrutamento em Produção',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <header>
          <div className="container">
            <h1>❄️ sNowRecruiter</h1>
            <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>
              MicroSaaS de Recrutamento
            </p>
          </div>
        </header>
        <main className="container" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          {children}
        </main>
        <footer>
          <p>© 2026 sNowRecruiter - Plataforma em Produção ✅</p>
        </footer>
      </body>
    </html>
  );
}
