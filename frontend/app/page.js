'use client';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0f172a', /* slate-900 */
      color: '#ffffff',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '3.5rem', 
        fontWeight: '900',
        marginBottom: '1rem',
        textAlign: 'center',
        background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.025em'
      }}>
        Smart Expense Tracker
      </h1>
      
      <p style={{
        fontSize: '1.25rem',
        color: '#94a3b8',
        marginBottom: '2.5rem',
        textAlign: 'center',
        fontWeight: '500'
      }}>
        AI-powered expense insights
      </p>
      
      <button 
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: '#2563eb',
          border: 'none',
          borderRadius: '9999px',
          cursor: 'pointer',
          boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.4), 0 8px 10px -6px rgba(37, 99, 235, 0.4)',
          transition: 'all 0.2s ease-in-out',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#1d4ed8';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onClick={() => window.location.href = '/dashboard'}
      >
        Get Started
      </button>
    </div>
  );
}
