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
  Radio,
  Avatar,
  List,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  CreditCardOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  BankOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  WalletOutlined,
  MoneyCollectOutlined,
  PayCircleOutlined,

} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TextArea } = Input;

interface Payment {
  id: string;
  installmentId: string;
  loanId: string;
  clientId: string;
  clientName: string;
  loanDescription: string;
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK';
  paymentDate: string;
  dueDate: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'OVERDUE';
  notes?: string;
  createdAt: string;
  installmentNumber: number;
  totalInstallments: number;
  interestAmount: number;
  principalAmount: number;
  feeAmount: number;
  receiptNumber?: string;
}

interface PaymentFormData {
  installmentId: string;
  amount: number | null;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK';
  paymentDate: dayjs.Dayjs | null;
  notes: string;
}

// Dados mockados para demonstração
const mockPayments: Payment[] = [
  {
    id: '1',
    installmentId: '1',
    loanId: '1',
    clientId: '1',
    clientName: 'João Silva Santos',
    loanDescription: 'Empréstimo para capital de giro',
    amount: 4695.10,
    paymentMethod: 'PIX',
    paymentDate: '2024-01-15',
    dueDate: '2024-01-15',
    status: 'COMPLETED',
    notes: 'Pagamento realizado via PIX',
    createdAt: '2024-01-15',
    installmentNumber: 1,
    totalInstallments: 12,
    interestAmount: 1250.00,
    principalAmount: 4166.67,
    feeAmount: 278.43,
    receiptNumber: 'REC-2024-001',
  },
  {
    id: '2',
    installmentId: '2',
    loanId: '1',
    clientId: '1',
    clientName: 'João Silva Santos',
    loanDescription: 'Empréstimo para capital de giro',
    amount: 4695.10,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: '2024-02-15',
    dueDate: '2024-02-15',
    status: 'COMPLETED',
    notes: 'Transferência bancária',
    createdAt: '2024-02-15',
    installmentNumber: 2,
    totalInstallments: 12,
    interestAmount: 1145.83,
    principalAmount: 4270.84,
    feeAmount: 278.43,
    receiptNumber: 'REC-2024-002',
  },
  {
    id: '3',
    installmentId: '3',
    loanId: '2',
    clientId: '2',
    clientName: 'Maria Santos Oliveira',
    loanDescription: 'Empréstimo pessoal',
    amount: 4416.67,
    paymentMethod: 'PIX',
    paymentDate: '2024-01-20',
    dueDate: '2024-01-20',
    status: 'COMPLETED',
    notes: 'Pagamento pontual via PIX',
    createdAt: '2024-01-20',
    installmentNumber: 1,
    totalInstallments: 6,
    interestAmount: 500.00,
    principalAmount: 4166.67,
    feeAmount: 250.00,
    receiptNumber: 'REC-2024-003',
  },
  {
    id: '4',
    installmentId: '4',
    loanId: '2',
    clientId: '2',
    clientName: 'Maria Santos Oliveira',
    loanDescription: 'Empréstimo pessoal',
    amount: 4416.67,
    paymentMethod: 'CASH',
    paymentDate: '2024-02-20',
    dueDate: '2024-02-20',
    status: 'PENDING',
    notes: 'Aguardando pagamento',
    createdAt: '2024-02-20',
    installmentNumber: 2,
    totalInstallments: 6,
    interestAmount: 500.00,
    principalAmount: 4166.67,
    feeAmount: 250.00,
  },
  {
    id: '5',
    installmentId: '5',
    loanId: '3',
    clientId: '3',
    clientName: 'Pedro Costa Lima',
    loanDescription: 'Financiamento de veículo',
    amount: 3968.11,
    paymentMethod: 'DEBIT_CARD',
    paymentDate: '2024-01-01',
    dueDate: '2024-01-01',
    status: 'OVERDUE',
    notes: 'Pagamento em atraso',
    createdAt: '2024-01-01',
    installmentNumber: 1,
    totalInstallments: 24,
    interestAmount: 2250.00,
    principalAmount: 3125.00,
    feeAmount: 593.11,
  },
];

const mockInstallments = [
  { id: '1', loanId: '1', clientName: 'João Silva Santos', installmentNumber: 3, amount: 4695.10, dueDate: '2024-03-15' },
  { id: '2', loanId: '2', clientName: 'Maria Santos Oliveira', installmentNumber: 3, amount: 4416.67, dueDate: '2024-03-20' },
  { id: '3', loanId: '3', clientName: 'Pedro Costa Lima', installmentNumber: 2, amount: 3968.11, dueDate: '2024-02-01' },
  { id: '4', loanId: '4', clientName: 'Ana Ferreira Rocha', installmentNumber: 1, amount: 1635.00, dueDate: '2024-02-05' },
];

const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'orange',
    COMPLETED: 'green',
    CANCELLED: 'default',
    OVERDUE: 'red',
  };
  return colors[status as keyof typeof colors] || 'default';
};

const getStatusText = (status: string) => {
  const texts = {
    PENDING: 'Pendente',
    COMPLETED: 'Pago',
    CANCELLED: 'Cancelado',
    OVERDUE: 'Em Atraso',
  };
  return texts[status as keyof typeof texts] || status;
};

const getPaymentMethodText = (method: string) => {
  const methods = {
    CASH: 'Dinheiro',
    BANK_TRANSFER: 'Transferência',
    PIX: 'PIX',
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
    CHECK: 'Cheque',
  };
  return methods[method as keyof typeof methods] || method;
};

const getPaymentMethodIcon = (method: string) => {
  const icons = {
    CASH: <WalletOutlined />,
    BANK_TRANSFER: <BankOutlined />,
    PIX: <PayCircleOutlined />,
    CREDIT_CARD: <CreditCardOutlined />,
    DEBIT_CARD: <CreditCardOutlined />,
    CHECK: <FileTextOutlined />,
  };
  return icons[method as keyof typeof icons] || <MoneyCollectOutlined />;
};

const getStatusIcon = (status: string) => {
  const icons = {
    PENDING: <ClockCircleOutlined />,
    COMPLETED: <CheckCircleOutlined />,
    CANCELLED: <StopOutlined />,
    OVERDUE: <ExclamationCircleOutlined />,
  };
  return icons[status as keyof typeof icons] || <ClockCircleOutlined />;
};

const isOverdue = (dueDate: string, status: string) => {
  if (status === 'COMPLETED') return false;
  return new Date(dueDate) < new Date();
};

export const Pagamentos: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [form] = Form.useForm();

  // Estatísticas
  const stats = {
    total: payments.length,
    completed: payments.filter(p => p.status === 'COMPLETED').length,
    pending: payments.filter(p => p.status === 'PENDING').length,
    overdue: payments.filter(p => p.status === 'OVERDUE').length,
    totalAmount: payments.reduce((sum, p) => sum + p.amount, 0),
    completedAmount: payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0),
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    applyFilters(value, statusFilter, methodFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    applyFilters(searchText, value, methodFilter);
  };

  const handleMethodFilter = (value: string) => {
    setMethodFilter(value);
    applyFilters(searchText, statusFilter, value);
  };

  const applyFilters = (search: string, status: string, method: string) => {
    let filtered = payments;

    if (search) {
      filtered = filtered.filter(payment =>
        payment.clientName.toLowerCase().includes(search.toLowerCase()) ||
        payment.loanDescription.toLowerCase().includes(search.toLowerCase()) ||
        payment.id.includes(search) ||
        payment.receiptNumber?.includes(search)
      );
    }

    if (status) {
      filtered = filtered.filter(payment => payment.status === status);
    }

    if (method) {
      filtered = filtered.filter(payment => payment.paymentMethod === method);
    }

    setFilteredPayments(filtered);
  };

  const handleAdd = () => {
    setEditingPayment(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    form.setFieldsValue({
      ...payment,
      paymentDate: dayjs(payment.paymentDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPayments = payments.filter(payment => payment.id !== id);
      setPayments(newPayments);
      applyFilters(searchText, statusFilter, methodFilter);
      message.success('Pagamento excluído com sucesso!');
    } catch (error) {
      message.error('Erro ao excluir pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: PaymentFormData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paymentDate = values.paymentDate!.format('YYYY-MM-DD');
      const installment = mockInstallments.find(i => i.id === values.installmentId);
      
      if (!installment) {
        message.error('Parcela não encontrada');
        return;
      }

      const paymentData: Payment = {
        id: editingPayment?.id || Date.now().toString(),
        installmentId: values.installmentId,
        loanId: installment.loanId,
        clientId: '1', // Mock
        clientName: installment.clientName,
        loanDescription: 'Empréstimo',
        amount: values.amount!,
        paymentMethod: values.paymentMethod,
        paymentDate,
        dueDate: installment.dueDate,
        status: editingPayment?.status || 'COMPLETED',
        notes: values.notes,
        createdAt: editingPayment?.createdAt || new Date().toISOString(),
        installmentNumber: installment.installmentNumber,
        totalInstallments: 12, // Mock
        interestAmount: values.amount! * 0.3, // Mock
        principalAmount: values.amount! * 0.7, // Mock
        feeAmount: 0,
        receiptNumber: editingPayment?.receiptNumber || `REC-${Date.now()}`,
      };

      if (editingPayment) {
        const updatedPayments = payments.map(payment =>
          payment.id === editingPayment.id ? paymentData : payment
        );
        setPayments(updatedPayments);
        message.success('Pagamento atualizado com sucesso!');
      } else {
        const newPayments = [...payments, paymentData];
        setPayments(newPayments);
        message.success('Pagamento registrado com sucesso!');
      }
      
      applyFilters(searchText, statusFilter, methodFilter);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar pagamento');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsDetailDrawerVisible(true);
  };

  const columns: ColumnsType<Payment> = [
    {
      title: 'Pagamento',
      key: 'payment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>#{record.id}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.receiptNumber || 'Sem recibo'}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Cliente/Empréstimo',
      key: 'client',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.clientName}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.installmentNumber}/{record.totalInstallments} - {record.loanDescription}
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
            Principal: R$ {record.principalAmount.toLocaleString('pt-BR')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Método',
      key: 'method',
      render: (_, record) => (
        <Space>
          {getPaymentMethodIcon(record.paymentMethod)}
          <Text>{getPaymentMethodText(record.paymentMethod)}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const overdue = isOverdue(record.dueDate, record.status);
        const status = overdue && record.status === 'PENDING' ? 'OVERDUE' : record.status;
        return (
          <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
            {getStatusText(status)}
          </Tag>
        );
      },
    },
    {
      title: 'Datas',
      key: 'dates',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>
            Venc: {format(new Date(record.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
          {record.status === 'COMPLETED' && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Pago: {format(new Date(record.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}
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
            title="Tem certeza que deseja excluir este pagamento?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.status === 'COMPLETED'}
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
            Pagamentos
          </Title>
          <Text type="secondary">
            Gerencie os pagamentos e parcelas do sistema
          </Text>
        </div>

        {/* Estatísticas */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total de Pagamentos"
                value={stats.total}
                prefix={<MoneyCollectOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Pagamentos Realizados"
                value={stats.completed}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Valor Recebido"
                value={stats.completedAmount}
                prefix={<DollarOutlined />}
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Valor Pendente"
                value={stats.pendingAmount}
                prefix={<ExclamationCircleOutlined />}
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtros e Ações */}
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={8} md={6}>
              <Search
                placeholder="Buscar por cliente, ID ou recibo..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={4} md={3}>
              <Select
                placeholder="Status"
                allowClear
                style={{ width: '100%' }}
                onChange={handleStatusFilter}
                value={statusFilter || undefined}
              >
                <Option value="PENDING">Pendente</Option>
                <Option value="COMPLETED">Pago</Option>
                <Option value="OVERDUE">Em Atraso</Option>
                <Option value="CANCELLED">Cancelado</Option>
              </Select>
            </Col>
            <Col xs={24} sm={4} md={3}>
              <Select
                placeholder="Método"
                allowClear
                style={{ width: '100%' }}
                onChange={handleMethodFilter}
                value={methodFilter || undefined}
              >
                <Option value="CASH">Dinheiro</Option>
                <Option value="PIX">PIX</Option>
                <Option value="BANK_TRANSFER">Transferência</Option>
                <Option value="CREDIT_CARD">Cartão Crédito</Option>
                <Option value="DEBIT_CARD">Cartão Débito</Option>
                <Option value="CHECK">Cheque</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                block
              >
                Registrar Pagamento
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabela */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredPayments}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredPayments.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} pagamentos`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Space>

      {/* Modal de Formulário */}
      <Modal
        title={editingPayment ? 'Editar Pagamento' : 'Registrar Pagamento'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
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
                name="installmentId"
                label="Parcela"
                rules={[{ required: true, message: 'Parcela é obrigatória' }]}
              >
                <Select
                  placeholder="Selecione a parcela"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {mockInstallments.map(installment => (
                    <Option key={installment.id} value={installment.id}>
                      {installment.clientName} - Parcela {installment.installmentNumber} (R$ {installment.amount.toLocaleString('pt-BR')})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="amount"
                label="Valor do Pagamento"
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
            <Col xs={24} md={12}>
              <Form.Item
                name="paymentMethod"
                label="Método de Pagamento"
                rules={[{ required: true, message: 'Método é obrigatório' }]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value="CASH">💵 Dinheiro</Radio>
                    <Radio value="PIX">📱 PIX</Radio>
                    <Radio value="BANK_TRANSFER">🏦 Transferência Bancária</Radio>
                    <Radio value="CREDIT_CARD">💳 Cartão de Crédito</Radio>
                    <Radio value="DEBIT_CARD">💳 Cartão de Débito</Radio>
                    <Radio value="CHECK">📄 Cheque</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="paymentDate"
                label="Data do Pagamento"
                rules={[{ required: true, message: 'Data é obrigatória' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Selecione a data"
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="notes"
                label="Observações"
              >
                <TextArea
                  rows={3}
                  placeholder="Observações sobre o pagamento..."
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
                {editingPayment ? 'Atualizar' : 'Registrar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer de Detalhes */}
      <Drawer
        title="Detalhes do Pagamento"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={700}
      >
        {selectedPayment && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Status e Informações Básicas */}
            <Card>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Status do Pagamento</Text>
                    <Tag 
                      color={getStatusColor(selectedPayment.status)} 
                      icon={getStatusIcon(selectedPayment.status)} 
                      style={{ fontSize: 14, padding: '4px 12px' }}
                    >
                      {getStatusText(selectedPayment.status)}
                    </Tag>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Método de Pagamento</Text>
                    <Space>
                      {getPaymentMethodIcon(selectedPayment.paymentMethod)}
                      <Text strong>{getPaymentMethodText(selectedPayment.paymentMethod)}</Text>
                    </Space>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Informações do Pagamento */}
            <Card title="Informações do Pagamento">
              <Descriptions column={2}>
                <Descriptions.Item label="ID do Pagamento">
                  #{selectedPayment.id}
                </Descriptions.Item>
                <Descriptions.Item label="Número do Recibo">
                  {selectedPayment.receiptNumber || 'Não gerado'}
                </Descriptions.Item>
                <Descriptions.Item label="Cliente">
                  {selectedPayment.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="Empréstimo">
                  {selectedPayment.loanDescription}
                </Descriptions.Item>
                <Descriptions.Item label="Parcela">
                  {selectedPayment.installmentNumber} de {selectedPayment.totalInstallments}
                </Descriptions.Item>
                <Descriptions.Item label="Valor Total">
                  R$ {selectedPayment.amount.toLocaleString('pt-BR')}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Vencimento">
                  {format(new Date(selectedPayment.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Data do Pagamento">
                  {selectedPayment.status === 'COMPLETED' 
                    ? format(new Date(selectedPayment.paymentDate), 'dd/MM/yyyy', { locale: ptBR })
                    : 'Não pago'
                  }
                </Descriptions.Item>
                <Descriptions.Item label="Observações" span={2}>
                  {selectedPayment.notes || 'Nenhuma observação'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Detalhamento Financeiro */}
            <Card title="Detalhamento Financeiro">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Valor Principal"
                    value={selectedPayment.principalAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Juros"
                    value={selectedPayment.interestAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Taxas"
                    value={selectedPayment.feeAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* Timeline do Pagamento */}
            <Card title="Histórico">
              <Timeline
                items={[
                  {
                    children: `Parcela criada em ${format(new Date(selectedPayment.createdAt), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'blue',
                  },
                  {
                    children: `Vencimento em ${format(new Date(selectedPayment.dueDate), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'orange',
                  },
                  ...(selectedPayment.status === 'COMPLETED' ? [{
                    children: `Pagamento realizado em ${format(new Date(selectedPayment.paymentDate), 'dd/MM/yyyy', { locale: ptBR })} via ${getPaymentMethodText(selectedPayment.paymentMethod)}`,
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

export default Pagamentos;