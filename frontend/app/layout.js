export const metadata = {
  title: 'Smart Expense Tracker',
  description: 'AI-powered expense insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, boxSizing: 'border-box' }}>
        {children}
      </body>
    </html>
  );
}
