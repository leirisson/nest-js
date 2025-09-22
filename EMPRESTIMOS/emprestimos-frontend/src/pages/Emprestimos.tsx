import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  DatePicker,
  Statistic,
  Select,
  InputNumber,
  Badge,
  Drawer,
  Descriptions,
  Timeline,
  Progress,
  Steps,
  Alert,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  BankOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  PercentageOutlined,
  EyeOutlined,
  FileTextOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, addMonths, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Step } = Steps;

interface Loan {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  interestRate: number;
  interestType: 'SIMPLE' | 'COMPOUND';
  numberOfPeriods: number;
  startDate: string;
  endDate: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  createdAt: string;
  nextPaymentDate?: string;
  monthlyPayment: number;
}

interface LoanFormData {
  clientId: string;
  amount: number | null;
  interestRate: number | null;
  interestType: 'SIMPLE' | 'COMPOUND';
  numberOfPeriods: number | null;
  startDate: dayjs.Dayjs | null;
  description: string;
}

// Dados mockados para demonstração
const mockLoans: Loan[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'João Silva Santos',
    amount: 50000,
    interestRate: 2.5,
    interestType: 'COMPOUND',
    numberOfPeriods: 12,
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    description: 'Empréstimo para capital de giro',
    status: 'ACTIVE',
    totalAmount: 56341.21,
    paidAmount: 18780.40,
    remainingAmount: 37560.81,
    createdAt: '2024-01-10',
    nextPaymentDate: '2024-02-15',
    monthlyPayment: 4695.10,
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Maria Santos Oliveira',
    amount: 25000,
    interestRate: 2.0,
    interestType: 'SIMPLE',
    numberOfPeriods: 6,
    startDate: '2024-01-20',
    endDate: '2024-07-20',
    description: 'Empréstimo pessoal',
    status: 'ACTIVE',
    totalAmount: 26500,
    paidAmount: 8833.33,
    remainingAmount: 17666.67,
    createdAt: '2024-01-18',
    nextPaymentDate: '2024-02-20',
    monthlyPayment: 4416.67,
  },
  {
    id: '3',
    clientId: '3',
    clientName: 'Pedro Costa Lima',
    amount: 75000,
    interestRate: 3.0,
    interestType: 'COMPOUND',
    numberOfPeriods: 24,
    startDate: '2023-12-01',
    endDate: '2025-12-01',
    description: 'Financiamento de veículo',
    status: 'ACTIVE',
    totalAmount: 95234.56,
    paidAmount: 15872.43,
    remainingAmount: 79362.13,
    createdAt: '2023-11-28',
    nextPaymentDate: '2024-02-01',
    monthlyPayment: 3968.11,
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'Ana Ferreira Rocha',
    amount: 15000,
    interestRate: 1.8,
    interestType: 'SIMPLE',
    numberOfPeriods: 10,
    startDate: '2024-01-05',
    endDate: '2024-11-05',
    description: 'Empréstimo para reforma',
    status: 'PENDING',
    totalAmount: 16350,
    paidAmount: 0,
    remainingAmount: 16350,
    createdAt: '2024-01-03',
    monthlyPayment: 1635,
  },
  {
    id: '5',
    clientId: '5',
    clientName: 'Carlos Mendes Silva',
    amount: 100000,
    interestRate: 2.8,
    interestType: 'COMPOUND',
    numberOfPeriods: 36,
    startDate: '2023-06-01',
    endDate: '2026-06-01',
    description: 'Empréstimo empresarial',
    status: 'COMPLETED',
    totalAmount: 134567.89,
    paidAmount: 134567.89,
    remainingAmount: 0,
    createdAt: '2023-05-28',
    monthlyPayment: 3737.44,
  },
];

const mockClients = [
  { id: '1', name: 'João Silva Santos' },
  { id: '2', name: 'Maria Santos Oliveira' },
  { id: '3', name: 'Pedro Costa Lima' },
  { id: '4', name: 'Ana Ferreira Rocha' },
  { id: '5', name: 'Carlos Mendes Silva' },
];

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    APPROVED: 'blue',
    ACTIVE: 'green',
    COMPLETED: 'success',
    OVERDUE: 'red',
    CANCELLED: 'default',
  };
  return colors[status as keyof typeof colors] || 'default';
};

const getStatusText = (status: string) => {
  const texts = {
    PENDING: 'Pendente',
    APPROVED: 'Aprovado',
    ACTIVE: 'Ativo',
    COMPLETED: 'Concluído',
    OVERDUE: 'Em Atraso',
    CANCELLED: 'Cancelado',
  };
  return texts[status as keyof typeof texts] || status;
};

const getInterestTypeText = (type: string) => {
  return type === 'SIMPLE' ? 'Simples' : 'Composto';
};

const calculateProgress = (loan: Loan) => {
  return Math.round((loan.paidAmount / loan.totalAmount) * 100);
};

const getStatusIcon = (status: string) => {
  const icons = {
    PENDING: <ClockCircleOutlined />,
    APPROVED: <CheckCircleOutlined />,
    ACTIVE: <TrophyOutlined />,
    COMPLETED: <CheckCircleOutlined />,
    OVERDUE: <ExclamationCircleOutlined />,
    CANCELLED: <StopOutlined />,
  };
  return icons[status as keyof typeof icons] || <ClockCircleOutlined />;
};

export const Emprestimos: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>(mockLoans);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [form] = Form.useForm();

  // Estatísticas
  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === 'ACTIVE').length,
    pending: loans.filter(l => l.status === 'PENDING').length,
    completed: loans.filter(l => l.status === 'COMPLETED').length,
    overdue: loans.filter(l => l.status === 'OVERDUE').length,
    totalAmount: loans.reduce((sum, l) => sum + l.amount, 0),
    totalOutstanding: loans.reduce((sum, l) => sum + l.remainingAmount, 0),
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchText, value);
  };

  const applyFilters = (search: string, status: string) => {
    let filtered = loans;

    if (search) {
      filtered = filtered.filter(loan =>
        loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
        loan.description.toLowerCase().includes(search.toLowerCase()) ||
        loan.id.includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(loan => loan.status === status);
    }

    setFilteredLoans(filtered);
  };

  const handleAdd = () => {
    setEditingLoan(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    form.setFieldsValue({
      ...loan,
      startDate: dayjs(loan.startDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newLoans = loans.filter(loan => loan.id !== id);
      setLoans(newLoans);
      applyFilters(searchText, statusFilter);
      message.success('Empréstimo excluído com sucesso!');
    } catch (error) {
      message.error('Erro ao excluir empréstimo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: LoanFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const startDate = values.startDate!.format('YYYY-MM-DD');
      const endDate = addMonths(values.startDate!.toDate(), values.numberOfPeriods!).toISOString().split('T')[0];
      
      // Cálculo simplificado do empréstimo
      const principal = values.amount!;
      const rate = values.interestRate! / 100;
      const periods = values.numberOfPeriods!;
      
      let totalAmount: number;
      if (values.interestType === 'SIMPLE') {
        totalAmount = principal * (1 + rate * periods);
      } else {
        totalAmount = principal * Math.pow(1 + rate, periods);
      }
      
      const monthlyPayment = totalAmount / periods;
      const clientName = mockClients.find(c => c.id === values.clientId)?.name || 'Cliente não encontrado';

      const loanData: Loan = {
        id: editingLoan?.id || Date.now().toString(),
        clientId: values.clientId,
        clientName,
        amount: principal,
        interestRate: values.interestRate!,
        interestType: values.interestType,
        numberOfPeriods: periods,
        startDate,
        endDate,
        description: values.description,
        status: editingLoan?.status || 'PENDING',
        totalAmount,
        paidAmount: editingLoan?.paidAmount || 0,
        remainingAmount: editingLoan ? editingLoan.remainingAmount : totalAmount,
        createdAt: editingLoan?.createdAt || new Date().toISOString(),
        nextPaymentDate: editingLoan?.nextPaymentDate,
        monthlyPayment,
      };

      if (editingLoan) {
        const updatedLoans = loans.map(loan =>
          loan.id === editingLoan.id ? loanData : loan
        );
        setLoans(updatedLoans);
        message.success('Empréstimo atualizado com sucesso!');
      } else {
        const newLoans = [...loans, loanData];
        setLoans(newLoans);
        message.success('Empréstimo criado com sucesso!');
      }
      
      applyFilters(searchText, statusFilter);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar empréstimo');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsDetailDrawerVisible(true);
  };

  const columns: ColumnsType<Loan> = [
    {
      title: 'Empréstimo',
      key: 'loan',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>#{record.id}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.clientName}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Valor',
      key: 'amount',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>R$ {record.amount.toLocaleString('pt-BR')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Total: R$ {record.totalAmount.toLocaleString('pt-BR')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Taxa/Tipo',
      key: 'interest',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text>{record.interestRate}% a.m.</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {getInterestTypeText(record.interestType)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Progresso',
      key: 'progress',
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ minWidth: 120 }}>
          <Progress 
            percent={calculateProgress(record)} 
            size="small" 
            status={record.status === 'COMPLETED' ? 'success' : 'active'}
          />
          <Text style={{ fontSize: 11 }}>
            {record.numberOfPeriods - Math.floor((record.paidAmount / record.totalAmount) * record.numberOfPeriods)} de {record.numberOfPeriods} parcelas
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Vencimento',
      key: 'dates',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>
            {format(new Date(record.endDate), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
          {record.nextPaymentDate && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Próx: {format(new Date(record.nextPaymentDate), 'dd/MM', { locale: ptBR })}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Ver detalhes">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'COMPLETED'}
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja excluir este empréstimo?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.status === 'ACTIVE' || record.status === 'COMPLETED'}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Empréstimos
          </Title>
          <Text type="secondary">
            Gerencie os empréstimos do sistema
          </Text>
        </div>

        {/* Estatísticas */}
        <Row gutter={[16, 16]}>
          {[
            { title: "Total de Empréstimos", value: stats.total, prefix: <BankOutlined />, color: '#1890ff' },
            { title: "Empréstimos Ativos", value: stats.active, prefix: <Badge status="processing" />, color: '#52c41a' },
            { title: "Volume Total", value: stats.totalAmount, prefix: <DollarOutlined />, color: '#722ed1', formatter: (value: any) => `R$ ${Number(value).toLocaleString('pt-BR')}` },
            { title: "Saldo Devedor", value: stats.totalOutstanding, prefix: <ExclamationCircleOutlined />, color: '#fa8c16', formatter: (value: any) => `R$ ${Number(value).toLocaleString('pt-BR')}` }
          ].map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={stat.title}>
              <motion.div
                initial={{ y: 30, opacity: 0, scale: 0.9 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <Card
                  hoverable
                  style={{
                    borderRadius: 12,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    formatter={stat.formatter}
                    valueStyle={{ color: stat.color }}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Filtros e Ações */}
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Buscar por cliente, ID ou descrição..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Select
                placeholder="Status"
                allowClear
                style={{ width: '100%' }}
                onChange={handleStatusFilter}
                value={statusFilter || undefined}
              >
                <Option value="PENDING">Pendente</Option>
                <Option value="APPROVED">Aprovado</Option>
                <Option value="ACTIVE">Ativo</Option>
                <Option value="COMPLETED">Concluído</Option>
                <Option value="OVERDUE">Em Atraso</Option>
                <Option value="CANCELLED">Cancelado</Option>
              </Select>
            </Col>
            <Col xs={24} sm={6} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                block
              >
                Novo Empréstimo
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabela */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredLoans}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredLoans.length,
              pageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Exibindo ${range[0]}-${range[1]} de ${total} empréstimos`,
              size: 'default',
              position: ['bottomCenter'],
              hideOnSinglePage: false,
              responsive: true,
              showLessItems: true
            }}
            scroll={{ x: 1200, y: 400 }}
            size="middle"
            bordered={false}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
        </Card>
      </Space>

      {/* Modal de Formulário */}
      <Modal
        title={editingLoan ? 'Editar Empréstimo' : 'Novo Empréstimo'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={900}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="clientId"
                label="Cliente"
                rules={[{ required: true, message: 'Cliente é obrigatório' }]}
              >
                <Select
                  placeholder="Selecione o cliente"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {mockClients.map(client => (
                    <Option key={client.id} value={client.id}>
                      {client.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="amount"
                label="Valor do Empréstimo"
                rules={[{ required: true, message: 'Valor é obrigatório' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0,00"
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value!.replace(/R\$\s?|(,*)/g, '')}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="interestRate"
                label="Taxa de Juros (% a.m.)"
                rules={[{ required: true, message: 'Taxa é obrigatória' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0,00"
                  min={0}
                  max={100}
                  step={0.1}
                  formatter={(value) => `${value}%`}
                  parser={(value) => value!.replace('%', '')}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="interestType"
                label="Tipo de Juros"
                rules={[{ required: true, message: 'Tipo é obrigatório' }]}
              >
                <Select placeholder="Selecione o tipo">
                  <Option value="SIMPLE">Juros Simples</Option>
                  <Option value="COMPOUND">Juros Compostos</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="numberOfPeriods"
                label="Número de Parcelas"
                rules={[{ required: true, message: 'Número de parcelas é obrigatório' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="12"
                  min={1}
                  max={360}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="startDate"
                label="Data de Início"
                rules={[{ required: true, message: 'Data de início é obrigatória' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Selecione a data"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="description"
                label="Descrição"
                rules={[{ required: true, message: 'Descrição é obrigatória' }]}
              >
                <Input
                  placeholder="Descreva o propósito do empréstimo"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingLoan ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer de Detalhes */}
      <Drawer
        title="Detalhes do Empréstimo"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={700}
      >
        {selectedLoan && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Status e Progresso */}
            <Card>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Status do Empréstimo</Text>
                    <Tag color={getStatusColor(selectedLoan.status)} icon={getStatusIcon(selectedLoan.status)} style={{ fontSize: 14, padding: '4px 12px' }}>
                      {getStatusText(selectedLoan.status)}
                    </Tag>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Progresso de Pagamento</Text>
                    <Progress 
                      percent={calculateProgress(selectedLoan)} 
                      status={selectedLoan.status === 'COMPLETED' ? 'success' : 'active'}
                    />
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Informações Básicas */}
            <Card title="Informações do Empréstimo">
              <Descriptions column={2}>
                <Descriptions.Item label="ID">
                  #{selectedLoan.id}
                </Descriptions.Item>
                <Descriptions.Item label="Cliente">
                  {selectedLoan.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Principal">
                  R$ {selectedLoan.amount.toLocaleString('pt-BR')}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Total">
                  R$ {selectedLoan.totalAmount.toLocaleString('pt-BR')}
                </Descriptions.Item>
                <Descriptions.Item label="Taxa de Juros">
                  {selectedLoan.interestRate}% a.m.
                </Descriptions.Item>
                <Descriptions.Item label="Tipo de Juros">
                  {getInterestTypeText(selectedLoan.interestType)}
                </Descriptions.Item>
                <Descriptions.Item label="Parcelas">
                  {selectedLoan.numberOfPeriods}x de R$ {selectedLoan.monthlyPayment.toLocaleString('pt-BR')}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Início">
                  {format(new Date(selectedLoan.startDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Término">
                  {format(new Date(selectedLoan.endDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Descrição" span={2}>
                  {selectedLoan.description}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Resumo Financeiro */}
            <Card title="Resumo Financeiro">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Valor Pago"
                    value={selectedLoan.paidAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Saldo Devedor"
                    value={selectedLoan.remainingAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Parcela Mensal"
                    value={selectedLoan.monthlyPayment}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Timeline do Empréstimo */}
            <Card title="Histórico">
              <Timeline
                items={[
                  {
                    children: `Empréstimo criado em ${format(new Date(selectedLoan.createdAt), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'blue',
                  },
                  {
                    children: `Empréstimo iniciado em ${format(new Date(selectedLoan.startDate), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'green',
                  },
                  ...(selectedLoan.status === 'COMPLETED' ? [{
                    children: `Empréstimo quitado em ${format(new Date(selectedLoan.endDate), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'green',
                  }] : []),
                ]}
              />
            </Card>
          </Space>
        )}
      </Drawer>
    </motion.div>
  );
};

export default Emprestimos;