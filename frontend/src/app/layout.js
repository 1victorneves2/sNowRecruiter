import './globals.css';

export const metadata = {
  title: 'sNowRecruiter - MicroSaaS RH',
  description: 'Sistema de recrutamento em produção',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', backgroundColor: '#f5f5f5' }}>
        <header style={{ background: '#1f2937', color: 'white', padding: '20px', textAlign: 'center' }}>
          <h1 style={{ margin: 0 }}>sNowRecruiter</h1>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>MicroSaaS de Recrutamento</p>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          {children}
        </main>
        <footer style={{ background: '#1f2937', color: 'white', textAlign: 'center', padding: '20px', marginTop: '40px' }}>
          <p>© 2026 sNowRecruiter</p>
        </footer>
      </body>
    </html>
  );
}
