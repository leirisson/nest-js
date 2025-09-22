import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Modal,
  Row,
  Col,
  Typography,
  Tag,
  Tooltip,
  message,
  Statistic,
  Badge,
  Drawer,
  Descriptions,
  Timeline,
  Alert,
  Divider,
  Avatar,
  List,
  Empty,
  Result,
  QRCode,
  Steps,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  DownloadOutlined,
  PrinterOutlined,
  EyeOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BankOutlined,
  WalletOutlined,
  PayCircleOutlined,
  CreditCardOutlined,
  MoneyCollectOutlined,
  FilePdfOutlined,
  ShareAltOutlined,
  QrcodeOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  IdcardOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Step } = Steps;

interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  clientId: string;
  clientName: string;
  clientDocument: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  loanId: string;
  loanDescription: string;
  installmentNumber: number;
  totalInstallments: number;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  feeAmount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'CHECK';
  paymentDate: string;
  dueDate: string;
  issueDate: string;
  status: 'ISSUED' | 'SENT' | 'VIEWED' | 'DOWNLOADED';
  notes?: string;
  companyName: string;
  companyDocument: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  digitalSignature?: string;
  qrCode?: string;
}

// Dados mockados para demonstração
const mockReceipts: Receipt[] = [
  {
    id: '1',
    receiptNumber: 'REC-2024-001',
    paymentId: '1',
    clientId: '1',
    clientName: 'João Silva Santos',
    clientDocument: '123.456.789-00',
    clientEmail: 'joao.silva@email.com',
    clientPhone: '(11) 99999-9999',
    clientAddress: 'Rua das Flores, 123 - São Paulo/SP',
    loanId: '1',
    loanDescription: 'Empréstimo para capital de giro',
    installmentNumber: 1,
    totalInstallments: 12,
    amount: 4695.10,
    principalAmount: 4166.67,
    interestAmount: 1250.00,
    feeAmount: 278.43,
    paymentMethod: 'PIX',
    paymentDate: '2024-01-15',
    dueDate: '2024-01-15',
    issueDate: '2024-01-15',
    status: 'DOWNLOADED',
    notes: 'Pagamento realizado via PIX',
    companyName: 'Financeira ABC Ltda',
    companyDocument: '12.345.678/0001-90',
    companyAddress: 'Av. Paulista, 1000 - São Paulo/SP',
    companyPhone: '(11) 3333-4444',
    companyEmail: 'contato@financeiraabc.com.br',
    digitalSignature: 'ABC123XYZ789',
    qrCode: 'https://financeiraabc.com.br/recibo/REC-2024-001',
  },
  {
    id: '2',
    receiptNumber: 'REC-2024-002',
    paymentId: '2',
    clientId: '1',
    clientName: 'João Silva Santos',
    clientDocument: '123.456.789-00',
    clientEmail: 'joao.silva@email.com',
    clientPhone: '(11) 99999-9999',
    clientAddress: 'Rua das Flores, 123 - São Paulo/SP',
    loanId: '1',
    loanDescription: 'Empréstimo para capital de giro',
    installmentNumber: 2,
    totalInstallments: 12,
    amount: 4695.10,
    principalAmount: 4270.84,
    interestAmount: 1145.83,
    feeAmount: 278.43,
    paymentMethod: 'BANK_TRANSFER',
    paymentDate: '2024-02-15',
    dueDate: '2024-02-15',
    issueDate: '2024-02-15',
    status: 'SENT',
    notes: 'Transferência bancária',
    companyName: 'Financeira ABC Ltda',
    companyDocument: '12.345.678/0001-90',
    companyAddress: 'Av. Paulista, 1000 - São Paulo/SP',
    companyPhone: '(11) 3333-4444',
    companyEmail: 'contato@financeiraabc.com.br',
    digitalSignature: 'ABC123XYZ790',
    qrCode: 'https://financeiraabc.com.br/recibo/REC-2024-002',
  },
  {
    id: '3',
    receiptNumber: 'REC-2024-003',
    paymentId: '3',
    clientId: '2',
    clientName: 'Maria Santos Oliveira',
    clientDocument: '987.654.321-00',
    clientEmail: 'maria.santos@email.com',
    clientPhone: '(11) 88888-8888',
    clientAddress: 'Av. Brasil, 456 - Rio de Janeiro/RJ',
    loanId: '2',
    loanDescription: 'Empréstimo pessoal',
    installmentNumber: 1,
    totalInstallments: 6,
    amount: 4416.67,
    principalAmount: 4166.67,
    interestAmount: 500.00,
    feeAmount: 250.00,
    paymentMethod: 'PIX',
    paymentDate: '2024-01-20',
    dueDate: '2024-01-20',
    issueDate: '2024-01-20',
    status: 'VIEWED',
    notes: 'Pagamento pontual via PIX',
    companyName: 'Financeira ABC Ltda',
    companyDocument: '12.345.678/0001-90',
    companyAddress: 'Av. Paulista, 1000 - São Paulo/SP',
    companyPhone: '(11) 3333-4444',
    companyEmail: 'contato@financeiraabc.com.br',
    digitalSignature: 'ABC123XYZ791',
    qrCode: 'https://financeiraabc.com.br/recibo/REC-2024-003',
  },
  {
    id: '4',
    receiptNumber: 'REC-2024-004',
    paymentId: '4',
    clientId: '3',
    clientName: 'Pedro Costa Lima',
    clientDocument: '456.789.123-00',
    clientEmail: 'pedro.costa@email.com',
    clientPhone: '(11) 77777-7777',
    clientAddress: 'Rua das Palmeiras, 789 - Belo Horizonte/MG',
    loanId: '3',
    loanDescription: 'Financiamento de veículo',
    installmentNumber: 1,
    totalInstallments: 24,
    amount: 3968.11,
    principalAmount: 3125.00,
    interestAmount: 2250.00,
    feeAmount: 593.11,
    paymentMethod: 'DEBIT_CARD',
    paymentDate: '2024-01-01',
    dueDate: '2024-01-01',
    issueDate: '2024-01-01',
    status: 'ISSUED',
    notes: 'Pagamento via cartão de débito',
    companyName: 'Financeira ABC Ltda',
    companyDocument: '12.345.678/0001-90',
    companyAddress: 'Av. Paulista, 1000 - São Paulo/SP',
    companyPhone: '(11) 3333-4444',
    companyEmail: 'contato@financeiraabc.com.br',
    digitalSignature: 'ABC123XYZ792',
    qrCode: 'https://financeiraabc.com.br/recibo/REC-2024-004',
  },
];

const getStatusColor = (status: string) => {
  const colors = {
    ISSUED: 'blue',
    SENT: 'orange',
    VIEWED: 'green',
    DOWNLOADED: 'purple',
  };
  return colors[status as keyof typeof colors] || 'default';
};

const getStatusText = (status: string) => {
  const texts = {
    ISSUED: 'Emitido',
    SENT: 'Enviado',
    VIEWED: 'Visualizado',
    DOWNLOADED: 'Baixado',
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
    ISSUED: <ClockCircleOutlined />,
    SENT: <MailOutlined />,
    VIEWED: <EyeOutlined />,
    DOWNLOADED: <DownloadOutlined />,
  };
  return icons[status as keyof typeof icons] || <ClockCircleOutlined />;
};

export const Recibos: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [filteredReceipts, setFilteredReceipts] = useState<Receipt[]>(mockReceipts);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);

  // Estatísticas
  const stats = {
    total: receipts.length,
    issued: receipts.filter(r => r.status === 'ISSUED').length,
    sent: receipts.filter(r => r.status === 'SENT').length,
    viewed: receipts.filter(r => r.status === 'VIEWED').length,
    downloaded: receipts.filter(r => r.status === 'DOWNLOADED').length,
    totalAmount: receipts.reduce((sum, r) => sum + r.amount, 0),
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (value) {
      const filtered = receipts.filter(receipt =>
        receipt.receiptNumber.toLowerCase().includes(value.toLowerCase()) ||
        receipt.clientName.toLowerCase().includes(value.toLowerCase()) ||
        receipt.clientDocument.includes(value) ||
        receipt.loanDescription.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredReceipts(filtered);
    } else {
      setFilteredReceipts(receipts);
    }
  };

  const handleViewDetails = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDetailDrawerVisible(true);
    
    // Simular atualização de status para "VIEWED"
    if (receipt.status === 'SENT') {
      const updatedReceipts = receipts.map(r => 
        r.id === receipt.id ? { ...r, status: 'VIEWED' as const } : r
      );
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts.filter(r => 
        !searchText || 
        r.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientDocument.includes(searchText) ||
        r.loanDescription.toLowerCase().includes(searchText.toLowerCase())
      ));
    }
  };

  const handleDownload = async (receipt: Receipt) => {
    setLoading(true);
    try {
      // Fazer download do PDF real do backend
      const response = await fetch(`http://localhost:3000/api/receipts/payment/${receipt.paymentId}/pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Erro ao baixar recibo');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const element = document.createElement('a');
      element.href = url;
      element.download = `${receipt.receiptNumber}.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      window.URL.revokeObjectURL(url);
      
      // Atualizar status para "DOWNLOADED"
      const updatedReceipts = receipts.map(r => 
        r.id === receipt.id ? { ...r, status: 'DOWNLOADED' as const } : r
      );
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts.filter(r => 
        !searchText || 
        r.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientDocument.includes(searchText) ||
        r.loanDescription.toLowerCase().includes(searchText.toLowerCase())
      ));
      
      message.success('Recibo baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar recibo:', error);
      message.error('Erro ao baixar recibo. Verifique se o servidor está funcionando.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsPrintModalVisible(true);
  };

  const handleSendEmail = async (receipt: Receipt) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar status para "SENT"
      const updatedReceipts = receipts.map(r => 
        r.id === receipt.id ? { ...r, status: 'SENT' as const } : r
      );
      setReceipts(updatedReceipts);
      setFilteredReceipts(updatedReceipts.filter(r => 
        !searchText || 
        r.receiptNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientName.toLowerCase().includes(searchText.toLowerCase()) ||
        r.clientDocument.includes(searchText) ||
        r.loanDescription.toLowerCase().includes(searchText.toLowerCase())
      ));
      
      message.success('Recibo enviado por email com sucesso!');
    } catch (error) {
      message.error('Erro ao enviar recibo por email');
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<Receipt> = [
    {
      title: 'Recibo',
      key: 'receipt',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.receiptNumber}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {format(new Date(record.issueDate), 'dd/MM/yyyy', { locale: ptBR })}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Cliente',
      key: 'client',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.clientName}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.clientDocument}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Pagamento',
      key: 'payment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>R$ {record.amount.toLocaleString('pt-BR')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Parcela {record.installmentNumber}/{record.totalInstallments}
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
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)} icon={getStatusIcon(record.status)}>
          {getStatusText(record.status)}
        </Tag>
      ),
    },
    {
      title: 'Data Pagamento',
      key: 'paymentDate',
      render: (_, record) => (
        <Text style={{ fontSize: 12 }}>
          {format(new Date(record.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}
        </Text>
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
          <Tooltip title="Baixar PDF">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
              loading={loading}
            />
          </Tooltip>
          <Tooltip title="Imprimir">
            <Button
              type="text"
              icon={<PrinterOutlined />}
              onClick={() => handlePrint(record)}
            />
          </Tooltip>
          <Tooltip title="Enviar por email">
            <Button
              type="text"
              icon={<MailOutlined />}
              onClick={() => handleSendEmail(record)}
              loading={loading}
            />
          </Tooltip>
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
            Recibos
          </Title>
          <Text type="secondary">
            Gerencie os recibos de pagamento do sistema
          </Text>
        </div>

        {/* Estatísticas */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Total de Recibos"
                value={stats.total}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Recibos Baixados"
                value={stats.downloaded}
                prefix={<DownloadOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Recibos Visualizados"
                value={stats.viewed}
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Valor Total"
                value={stats.totalAmount}
                prefix={<DollarOutlined />}
                formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Filtros */}
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <Search
                placeholder="Buscar por número, cliente ou documento..."
                allowClear
                enterButton={<SearchOutlined />}
                onSearch={handleSearch}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Col>
          </Row>
        </Card>

        {/* Tabela */}
        <Card>
          <Table
            columns={columns}
            dataSource={filteredReceipts}
            rowKey="id"
            loading={loading}
            pagination={{
              total: filteredReceipts.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} de ${total} recibos`,
            }}
            scroll={{ x: 1200 }}
          />
        </Card>
      </Space>

      {/* Drawer de Detalhes */}
      <Drawer
        title="Detalhes do Recibo"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={800}
      >
        {selectedReceipt && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Status e Informações Básicas */}
            <Card>
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Status do Recibo</Text>
                    <Tag 
                      color={getStatusColor(selectedReceipt.status)} 
                      icon={getStatusIcon(selectedReceipt.status)} 
                      style={{ fontSize: 14, padding: '4px 12px' }}
                    >
                      {getStatusText(selectedReceipt.status)}
                    </Tag>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">Número do Recibo</Text>
                    <Text strong style={{ fontSize: 16 }}>{selectedReceipt.receiptNumber}</Text>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Informações da Empresa */}
            <Card title="Dados da Empresa">
              <Descriptions column={2}>
                <Descriptions.Item label="Razão Social">
                  {selectedReceipt.companyName}
                </Descriptions.Item>
                <Descriptions.Item label="CNPJ">
                  {selectedReceipt.companyDocument}
                </Descriptions.Item>
                <Descriptions.Item label="Endereço" span={2}>
                  {selectedReceipt.companyAddress}
                </Descriptions.Item>
                <Descriptions.Item label="Telefone">
                  {selectedReceipt.companyPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedReceipt.companyEmail}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Informações do Cliente */}
            <Card title="Dados do Cliente">
              <Descriptions column={2}>
                <Descriptions.Item label="Nome">
                  {selectedReceipt.clientName}
                </Descriptions.Item>
                <Descriptions.Item label="CPF">
                  {selectedReceipt.clientDocument}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedReceipt.clientEmail}
                </Descriptions.Item>
                <Descriptions.Item label="Telefone">
                  {selectedReceipt.clientPhone}
                </Descriptions.Item>
                <Descriptions.Item label="Endereço" span={2}>
                  {selectedReceipt.clientAddress}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Informações do Pagamento */}
            <Card title="Detalhes do Pagamento">
              <Descriptions column={2}>
                <Descriptions.Item label="Empréstimo">
                  {selectedReceipt.loanDescription}
                </Descriptions.Item>
                <Descriptions.Item label="Parcela">
                  {selectedReceipt.installmentNumber} de {selectedReceipt.totalInstallments}
                </Descriptions.Item>
                <Descriptions.Item label="Método de Pagamento">
                  <Space>
                    {getPaymentMethodIcon(selectedReceipt.paymentMethod)}
                    {getPaymentMethodText(selectedReceipt.paymentMethod)}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Data do Pagamento">
                  {format(new Date(selectedReceipt.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Vencimento">
                  {format(new Date(selectedReceipt.dueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Data de Emissão">
                  {format(new Date(selectedReceipt.issueDate), 'dd/MM/yyyy', { locale: ptBR })}
                </Descriptions.Item>
                <Descriptions.Item label="Observações" span={2}>
                  {selectedReceipt.notes || 'Nenhuma observação'}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Detalhamento Financeiro */}
            <Card title="Detalhamento Financeiro">
              <Row gutter={16}>
                <Col span={8}>
                  <Statistic
                    title="Valor Principal"
                    value={selectedReceipt.principalAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Juros"
                    value={selectedReceipt.interestAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#fa8c16' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Taxas"
                    value={selectedReceipt.feeAmount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#722ed1' }}
                  />
                </Col>
              </Row>
              <Divider />
              <Row>
                <Col span={24}>
                  <Statistic
                    title="Valor Total Pago"
                    value={selectedReceipt.amount}
                    formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`}
                    valueStyle={{ color: '#52c41a', fontSize: 24, fontWeight: 'bold' }}
                  />
                </Col>
              </Row>
            </Card>

            {/* QR Code e Assinatura Digital */}
            <Card title="Autenticação">
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Text strong>QR Code de Verificação</Text>
                    {selectedReceipt.qrCode && (
                      <QRCode value={selectedReceipt.qrCode} size={120} />
                    )}
                    <Text type="secondary" style={{ fontSize: 11, textAlign: 'center' }}>
                      Escaneie para verificar a autenticidade
                    </Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Assinatura Digital</Text>
                    <Text code style={{ fontSize: 11, wordBreak: 'break-all' }}>
                      {selectedReceipt.digitalSignature}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      Documento assinado digitalmente
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* Ações */}
            <Card>
              <Space size="middle" wrap>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(selectedReceipt)}
                  loading={loading}
                >
                  Baixar PDF
                </Button>
                <Button 
                  icon={<PrinterOutlined />}
                  onClick={() => handlePrint(selectedReceipt)}
                >
                  Imprimir
                </Button>
                <Button 
                  icon={<MailOutlined />}
                  onClick={() => handleSendEmail(selectedReceipt)}
                  loading={loading}
                >
                  Enviar por Email
                </Button>
                <Button 
                  icon={<ShareAltOutlined />}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedReceipt.qrCode || '');
                    message.success('Link copiado para a área de transferência!');
                  }}
                >
                  Compartilhar
                </Button>
              </Space>
            </Card>
          </Space>
        )}
      </Drawer>

      {/* Modal de Impressão */}
      <Modal
        title="Visualização para Impressão"
        open={isPrintModalVisible}
        onCancel={() => setIsPrintModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setIsPrintModalVisible(false)}>
            Cancelar
          </Button>,
          <Button 
            key="print" 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={() => {
              window.print();
              setIsPrintModalVisible(false);
            }}
          >
            Imprimir
          </Button>,
        ]}
      >
        {selectedReceipt && (
          <div style={{ padding: '20px', backgroundColor: '#fff' }}>
            {/* Cabeçalho da Empresa */}
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #1890ff', paddingBottom: '20px' }}>
              <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
                {selectedReceipt.companyName}
              </Title>
              <Text>{selectedReceipt.companyDocument}</Text><br />
              <Text>{selectedReceipt.companyAddress}</Text><br />
              <Text>{selectedReceipt.companyPhone} | {selectedReceipt.companyEmail}</Text>
            </div>

            {/* Título do Recibo */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Title level={2} style={{ margin: 0 }}>RECIBO DE PAGAMENTO</Title>
              <Text strong style={{ fontSize: '16px' }}>{selectedReceipt.receiptNumber}</Text>
            </div>

            {/* Dados do Cliente */}
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>Dados do Cliente:</Title>
              <Text><strong>Nome:</strong> {selectedReceipt.clientName}</Text><br />
              <Text><strong>CPF:</strong> {selectedReceipt.clientDocument}</Text><br />
              <Text><strong>Endereço:</strong> {selectedReceipt.clientAddress}</Text><br />
              <Text><strong>Telefone:</strong> {selectedReceipt.clientPhone}</Text><br />
              <Text><strong>Email:</strong> {selectedReceipt.clientEmail}</Text>
            </div>

            {/* Detalhes do Pagamento */}
            <div style={{ marginBottom: '20px' }}>
              <Title level={4}>Detalhes do Pagamento:</Title>
              <Text><strong>Empréstimo:</strong> {selectedReceipt.loanDescription}</Text><br />
              <Text><strong>Parcela:</strong> {selectedReceipt.installmentNumber} de {selectedReceipt.totalInstallments}</Text><br />
              <Text><strong>Método de Pagamento:</strong> {getPaymentMethodText(selectedReceipt.paymentMethod)}</Text><br />
              <Text><strong>Data do Pagamento:</strong> {format(new Date(selectedReceipt.paymentDate), 'dd/MM/yyyy', { locale: ptBR })}</Text><br />
              <Text><strong>Data de Vencimento:</strong> {format(new Date(selectedReceipt.dueDate), 'dd/MM/yyyy', { locale: ptBR })}</Text>
            </div>

            {/* Valores */}
            <div style={{ marginBottom: '30px', border: '1px solid #d9d9d9', padding: '15px' }}>
              <Title level={4}>Discriminação dos Valores:</Title>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <Text>Valor Principal:</Text>
                <Text>R$ {selectedReceipt.principalAmount.toLocaleString('pt-BR')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <Text>Juros:</Text>
                <Text>R$ {selectedReceipt.interestAmount.toLocaleString('pt-BR')}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <Text>Taxas:</Text>
                <Text>R$ {selectedReceipt.feeAmount.toLocaleString('pt-BR')}</Text>
              </div>
              <Divider style={{ margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: '18px' }}>TOTAL PAGO:</Text>
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>R$ {selectedReceipt.amount.toLocaleString('pt-BR')}</Text>
              </div>
            </div>

            {/* Observações */}
            {selectedReceipt.notes && (
              <div style={{ marginBottom: '20px' }}>
                <Title level={4}>Observações:</Title>
                <Text>{selectedReceipt.notes}</Text>
              </div>
            )}

            {/* Rodapé */}
            <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #d9d9d9', paddingTop: '20px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Recibo emitido em {format(new Date(selectedReceipt.issueDate), 'dd/MM/yyyy', { locale: ptBR })}
              </Text><br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Assinatura Digital: {selectedReceipt.digitalSignature}
              </Text><br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Este documento foi gerado eletronicamente e possui validade legal.
              </Text>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Recibos;