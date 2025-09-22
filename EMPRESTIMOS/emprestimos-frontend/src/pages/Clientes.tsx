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
  Avatar,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  DatePicker,
  Statistic,
  Divider,
  Badge,
  Drawer,
  Descriptions,
  Timeline,
} from 'antd';
import {
  UserAddOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  EyeOutlined,
  BankOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, differenceInYears } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  birthDate: string;
  createdAt: string;
  totalLoans: number;
  totalAmount: number;
  status: 'active' | 'inactive' | 'blocked';
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  birthDate: dayjs.Dayjs | null;
}

// Dados mockados para demonstração
const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    cpf: '123.456.789-00',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    birthDate: '1985-05-15',
    createdAt: '2024-01-10',
    totalLoans: 3,
    totalAmount: 45000,
    status: 'active',
  },
  {
    id: '2',
    name: 'Maria Santos Oliveira',
    email: 'maria.santos@email.com',
    phone: '(11) 88888-8888',
    cpf: '987.654.321-00',
    address: 'Av. Paulista, 456 - São Paulo, SP',
    birthDate: '1990-08-22',
    createdAt: '2024-01-08',
    totalLoans: 2,
    totalAmount: 28000,
    status: 'active',
  },
  {
    id: '3',
    name: 'Pedro Costa Lima',
    email: 'pedro.costa@email.com',
    phone: '(11) 77777-7777',
    cpf: '456.789.123-00',
    address: 'Rua Augusta, 789 - São Paulo, SP',
    birthDate: '1978-12-03',
    createdAt: '2024-01-05',
    totalLoans: 5,
    totalAmount: 75000,
    status: 'active',
  },
  {
    id: '4',
    name: 'Ana Ferreira Rocha',
    email: 'ana.ferreira@email.com',
    phone: '(11) 66666-6666',
    cpf: '789.123.456-00',
    address: 'Rua Oscar Freire, 321 - São Paulo, SP',
    birthDate: '1992-03-18',
    createdAt: '2024-01-03',
    totalLoans: 1,
    totalAmount: 15000,
    status: 'inactive',
  },
  {
    id: '5',
    name: 'Carlos Mendes Silva',
    email: 'carlos.mendes@email.com',
    phone: '(11) 55555-5555',
    cpf: '321.654.987-00',
    address: 'Rua Consolação, 654 - São Paulo, SP',
    birthDate: '1980-11-25',
    createdAt: '2024-01-01',
    totalLoans: 4,
    totalAmount: 62000,
    status: 'blocked',
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    active: 'success',
    inactive: 'warning',
    blocked: 'error',
  };
  return colors[status as keyof typeof colors] || 'default';
};

const getStatusText = (status: string) => {
  const texts = {
    active: 'Ativo',
    inactive: 'Inativo',
    blocked: 'Bloqueado',
  };
  return texts[status as keyof typeof texts] || status;
};

const calculateAge = (birthDate: string) => {
  return differenceInYears(new Date(), new Date(birthDate));
};

const formatCPF = (cpf: string) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone: string) => {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

export const Clientes: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [filteredClients, setFilteredClients] = useState<Client[]>(mockClients);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [form] = Form.useForm();

  // Estatísticas
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    inactive: clients.filter(c => c.status === 'inactive').length,
    blocked: clients.filter(c => c.status === 'blocked').length,
    totalAmount: clients.reduce((sum, c) => sum + c.totalAmount, 0),
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = clients.filter(client =>
      client.name.toLowerCase().includes(value.toLowerCase()) ||
      client.email.toLowerCase().includes(value.toLowerCase()) ||
      client.cpf.includes(value) ||
      client.phone.includes(value)
    );
    setFilteredClients(filtered);
  };

  const handleAdd = () => {
    setEditingClient(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    form.setFieldsValue({
      ...client,
      birthDate: dayjs(client.birthDate),
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newClients = clients.filter(client => client.id !== id);
      setClients(newClients);
      setFilteredClients(newClients.filter(client =>
        client.name.toLowerCase().includes(searchText.toLowerCase()) ||
        client.email.toLowerCase().includes(searchText.toLowerCase()) ||
        client.cpf.includes(searchText) ||
        client.phone.includes(searchText)
      ));
      message.success('Cliente excluído com sucesso!');
    } catch (error) {
      message.error('Erro ao excluir cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: ClientFormData) => {
    setLoading(true);
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const clientData = {
        ...values,
        birthDate: values.birthDate?.format('YYYY-MM-DD') || '',
        phone: formatPhone(values.phone.replace(/\D/g, '')),
        cpf: formatCPF(values.cpf.replace(/\D/g, '')),
      };

      if (editingClient) {
        // Atualizar cliente existente
        const updatedClients = clients.map(client =>
          client.id === editingClient.id
            ? { ...client, ...clientData }
            : client
        );
        setClients(updatedClients);
        setFilteredClients(updatedClients);
        message.success('Cliente atualizado com sucesso!');
      } else {
        // Criar novo cliente
        const newClient: Client = {
          id: Date.now().toString(),
          ...clientData,
          createdAt: new Date().toISOString(),
          totalLoans: 0,
          totalAmount: 0,
          status: 'active',
        };
        const newClients = [...clients, newClient];
        setClients(newClients);
        setFilteredClients(newClients);
        message.success('Cliente criado com sucesso!');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailDrawerVisible(true);
  };

  const columns: ColumnsType<Client> = [
    {
      title: 'Cliente',
      key: 'client',
      render: (_, record) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Idade',
      key: 'age',
      render: (_, record) => `${calculateAge(record.birthDate)} anos`,
    },
    {
      title: 'Empréstimos',
      key: 'loans',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.totalLoans}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            R$ {record.totalAmount.toLocaleString('pt-BR')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Cadastro',
      key: 'createdAt',
      render: (_, record) => format(new Date(record.createdAt), 'dd/MM/yyyy', { locale: ptBR }),
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
            />
          </Tooltip>
          <Popconfirm
            title="Tem certeza que deseja excluir este cliente?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
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
            Clientes
          </Title>
          <Text type="secondary">
            Gerencie os clientes do sistema
          </Text>
        </div>

        {/* Estatísticas */}
        <Row gutter={[16, 16]}>
          {[
            { title: "Total de Clientes", value: stats.total, prefix: <UserOutlined />, color: '#1890ff' },
            { title: "Clientes Ativos", value: stats.active, prefix: <Badge status="success" />, color: '#52c41a' },
            { title: "Clientes Inativos", value: stats.inactive, prefix: <Badge status="warning" />, color: '#faad14' },
            { title: "Volume Total", value: stats.totalAmount, prefix: <DollarOutlined />, color: '#722ed1', formatter: (value: any) => `R$ ${Number(value).toLocaleString('pt-BR')}` }
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
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={16} md={18}>
              <Search
                placeholder="Buscar por nome, email, CPF ou telefone..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
            <Col xs={24} sm={8} md={6}>
              <Button
                type="primary"
                icon={<UserAddOutlined />}
                size="large"
                onClick={handleAdd}
                block
              >
                Novo Cliente
              </Button>
            </Col>
          </Row>
          </Card>
        </motion.div>

        {/* Tabela */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          <Card
            style={{
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
          <Table
            columns={columns}
            dataSource={filteredClients}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredClients.length,
              pageSize: 10,
              pageSizeOptions: ['10', '20', '50', '100'],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `Exibindo ${range[0]}-${range[1]} de ${total} clientes`,
              size: 'default',
              position: ['bottomCenter'],
              hideOnSinglePage: false,
              responsive: true,
              showLessItems: true
            }}
            scroll={{ x: 1000, y: 400 }}
            size="middle"
            bordered={false}
            rowClassName={(record, index) => 
              index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
            }
          />
          </Card>
        </motion.div>
      </Space>

      {/* Modal de Formulário */}
      <Modal
        title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
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
                name="name"
                label="Nome Completo"
                rules={[{ required: true, message: 'Nome é obrigatório' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Digite o nome completo"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Email é obrigatório' },
                  { type: 'email', message: 'Email inválido' },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Digite o email"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Telefone"
                rules={[{ required: true, message: 'Telefone é obrigatório' }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="(11) 99999-9999"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="cpf"
                label="CPF"
                rules={[{ required: true, message: 'CPF é obrigatório' }]}
              >
                <Input
                  prefix={<FileTextOutlined />}
                  placeholder="000.000.000-00"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="birthDate"
                label="Data de Nascimento"
                rules={[{ required: true, message: 'Data de nascimento é obrigatória' }]}
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
                name="address"
                label="Endereço"
                rules={[{ required: true, message: 'Endereço é obrigatório' }]}
              >
                <Input
                  prefix={<HomeOutlined />}
                  placeholder="Digite o endereço completo"
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
                {editingClient ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Drawer de Detalhes */}
      <Drawer
        title="Detalhes do Cliente"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={600}
      >
        {selectedClient && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Informações Básicas */}
            <Card title="Informações Pessoais">
              <Descriptions column={1}>
                <Descriptions.Item label="Nome">
                  {selectedClient.name}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedClient.email}
                </Descriptions.Item>
                <Descriptions.Item label="Telefone">
                  {selectedClient.phone}
                </Descriptions.Item>
                <Descriptions.Item label="CPF">
                  {selectedClient.cpf}
                </Descriptions.Item>
                <Descriptions.Item label="Idade">
                  {calculateAge(selectedClient.birthDate)} anos
                </Descriptions.Item>
                <Descriptions.Item label="Endereço">
                  {selectedClient.address}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(selectedClient.status)}>
                    {getStatusText(selectedClient.status)}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Estatísticas do Cliente */}
            <Card title="Resumo Financeiro">
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic
                    title="Total de Empréstimos"
                    value={selectedClient.totalLoans}
                    prefix={<BankOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Valor Total"
                    value={selectedClient.totalAmount}
                    prefix={<DollarOutlined />}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                  />
                </Col>
              </Row>
            </Card>

            {/* Histórico */}
            <Card title="Histórico">
              <Timeline
                items={[
                  {
                    children: `Cliente cadastrado em ${format(new Date(selectedClient.createdAt), 'dd/MM/yyyy', { locale: ptBR })}`,
                    color: 'blue',
                  },
                  {
                    children: 'Primeiro empréstimo aprovado',
                    color: 'green',
                  },
                  {
                    children: 'Pagamento em dia',
                    color: 'green',
                  },
                ]}
              />
            </Card>
          </Space>
        )}
      </Drawer>
    </motion.div>
  );
};

export default Clientes;