import React, { useEffect, useState } from 'react';
import { Card, Typography, Button, Tabs, Badge, Space, Row, Col, Table, Spin, Alert, Statistic } from 'antd';
import { DollarOutlined, CreditCardOutlined, RiseOutlined, CalendarOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import type { Loan, Payment } from '../types';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface CustomerDashboardData {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  stats: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
    totalBorrowed: number;
    totalPaid: number;
    totalPending: number;
  };
}

const ClienteDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<CustomerDashboardData | null>(null);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, loansResponse, paymentsResponse] = await Promise.all([
        apiService.getCustomerDashboard(),
        apiService.getCustomerLoans(),
        apiService.getCustomerPayments()
      ]);
      
      setDashboardData(dashboardResponse);
      setLoans(loansResponse);
      setPayments(paymentsResponse);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const loanColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Taxa',
      dataIndex: 'interestRate',
      key: 'interestRate',
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'Parcelas',
      dataIndex: 'installments',
      key: 'installments',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Badge 
          color={status === 'ACTIVE' ? 'green' : status === 'COMPLETED' ? 'blue' : 'orange'}
          text={status}
        />
      ),
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
  ];

  const paymentColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Valor',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => formatCurrency(amount),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Método',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => formatDate(date),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Erro" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Title level={2}>Dashboard do Cliente</Title>
          <Text type="secondary">Bem-vindo, {dashboardData?.customer.name}</Text>
        </Col>
        <Col>
          <Button 
            type="primary" 
            danger 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Col>
      </Row>

      {/* Estatísticas */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Emprestado"
              value={dashboardData?.stats.totalBorrowed || 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Pago"
              value={dashboardData?.stats.totalPaid || 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<CreditCardOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pendente"
              value={dashboardData?.stats.totalPending || 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<RiseOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Empréstimos Ativos"
              value={dashboardData?.stats.activeLoans || 0}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Conteúdo Principal */}
      <Card>
        <Tabs defaultActiveKey="loans">
          <TabPane tab="Meus Empréstimos" key="loans">
            <Table 
              columns={loanColumns} 
              dataSource={loans} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="Meus Pagamentos" key="payments">
            <Table 
              columns={paymentColumns} 
              dataSource={payments} 
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </TabPane>
          
          <TabPane tab="Meu Perfil" key="profile">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Card title="Informações Pessoais">
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Nome:</Text>
                    <br />
                    <Text>{dashboardData?.customer.name}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Email:</Text>
                    <br />
                    <Text>{dashboardData?.customer.email}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Telefone:</Text>
                    <br />
                    <Text>{dashboardData?.customer.phone}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>CPF:</Text>
                    <br />
                    <Text>{dashboardData?.customer.cpf}</Text>
                  </Col>
                </Row>
              </Card>
            </Space>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default ClienteDashboard;