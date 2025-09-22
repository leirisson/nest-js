import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Clientes } from './pages/Clientes';
import { Emprestimos } from './pages/Emprestimos';
import { Pagamentos } from './pages/Pagamentos';
import { Recibos } from './pages/Recibos';
import ClienteDashboard from './pages/ClienteDashboard';
import 'antd/dist/reset.css';

// Configuração do React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Configuração do tema Ant Design
const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1976d2',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    borderRadius: 6,
  },
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Rota de Login */}
              <Route path="/login" element={<Login />} />
              
              {/* Rota para Clientes */}
              <Route
                path="/cliente/*"
                element={
                  <ProtectedRoute requiredRole="CUSTOMER">
                    <Routes>
                      <Route path="/" element={<Navigate to="/cliente/dashboard" replace />} />
                      <Route path="/dashboard" element={<ClienteDashboard />} />
                    </Routes>
                  </ProtectedRoute>
                }
              />
              
              {/* Rotas para Admin */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute requiredRole="ADMIN">
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/emprestimos" element={<Emprestimos />} />
                        <Route path="/pagamentos" element={<Pagamentos />} />
                        <Route path="/recibos" element={<Recibos />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
