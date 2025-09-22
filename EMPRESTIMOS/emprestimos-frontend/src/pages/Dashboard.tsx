import React from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Table,
  Tag,
  Avatar,
  Progress,
  List,
  Badge,
} from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
  DollarOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const { Title, Text } = Typography;

// Dados mockados para demonstração
const statsData = [
  {
    title: 'Total de Clientes',
    value: 1234,
    prefix: <UserOutlined />,
    suffix: '',
    precision: 0,
    valueStyle: { color: '#3f8600' },
    trend: { value: 11.28, isPositive: true },
  },
  {
    title: 'Empréstimos Ativos',
    value: 89,
    prefix: <BankOutlined />,
    suffix: '',
    precision: 0,
    valueStyle: { color: '#1890ff' },
    trend: { value: 5.67, isPositive: true },
  },
  {
    title: 'Valor Total Emprestado',
    value: 2456789.50,
    prefix: <DollarOutlined />,
    suffix: '',
    precision: 2,
    valueStyle: { color: '#722ed1' },
    trend: { value: 8.43, isPositive: true },
    formatter: (value: number) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
  },
  {
    title: 'Pagamentos Pendentes',
    value: 23,
    prefix: <CreditCardOutlined />,
    suffix: '',
    precision: 0,
    valueStyle: { color: '#f5222d' },
    trend: { value: 2.15, isPositive: false },
  },
];

const monthlyData = [
  { month: 'Jan', emprestimos: 45, pagamentos: 42, valor: 125000 },
  { month: 'Fev', emprestimos: 52, pagamentos: 48, valor: 145000 },
  { month: 'Mar', emprestimos: 48, pagamentos: 51, valor: 135000 },
  { month: 'Abr', emprestimos: 61, pagamentos: 55, valor: 165000 },
  { month: 'Mai', emprestimos: 55, pagamentos: 58, valor: 155000 },
  { month: 'Jun', emprestimos: 67, pagamentos: 62, valor: 185000 },
];

const statusData = [
  { name: 'Em Dia', value: 65, color: '#52c41a' },
  { name: 'Atrasado', value: 20, color: '#faad14' },
  { name: 'Vencido', value: 10, color: '#f5222d' },
  { name: 'Quitado', value: 5, color: '#1890ff' },
];

const recentLoans = [
  {
    id: 1,
    cliente: 'João Silva',
    valor: 15000,
    status: 'aprovado',
    data: new Date('2024-01-15'),
  },
  {
    id: 2,
    cliente: 'Maria Santos',
    valor: 8500,
    status: 'pendente',
    data: new Date('2024-01-14'),
  },
  {
    id: 3,
    cliente: 'Pedro Costa',
    valor: 22000,
    status: 'em_analise',
    data: new Date('2024-01-13'),
  },
  {
    id: 4,
    cliente: 'Ana Oliveira',
    valor: 12000,
    status: 'aprovado',
    data: new Date('2024-01-12'),
  },
];

const topClients = [
  { name: 'Carlos Mendes', emprestimos: 5, valor: 85000, avatar: 'C' },
  { name: 'Lucia Ferreira', emprestimos: 4, valor: 72000, avatar: 'L' },
  { name: 'Roberto Lima', emprestimos: 3, valor: 65000, avatar: 'R' },
  { name: 'Sandra Rocha', emprestimos: 3, valor: 58000, avatar: 'S' },
];

const getStatusColor = (status: string) => {
  const colors = {
    aprovado: 'success',
    pendente: 'warning',
    em_analise: 'processing',
    rejeitado: 'error',
  };
  return colors[status as keyof typeof colors] || 'default';
};

const getStatusText = (status: string) => {
  const texts = {
    aprovado: 'Aprovado',
    pendente: 'Pendente',
    em_analise: 'Em Análise',
    rejeitado: 'Rejeitado',
  };
  return texts[status as keyof typeof texts] || status;
};

export const Dashboard: React.FC = () => {
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
            Dashboard
          </Title>
          <Text type="secondary">
            Visão geral do sistema de empréstimos
          </Text>
        </div>

        {/* Cards de Estatísticas */}
        <Row gutter={[16, 16]}>
          {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <motion.div
              initial={{ y: 30, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: index * 0.15,
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
                  border: 'none',
                  borderRadius: 12,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                }}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    precision={stat.precision}
                    valueStyle={stat.valueStyle}
                    prefix={stat.prefix}
                    suffix={
                      stat.trend && (
                        <span style={{ fontSize: 14, marginLeft: 8 }}>
                          {stat.trend.isPositive ? (
                            <ArrowUpOutlined style={{ color: '#3f8600' }} />
                          ) : (
                            <ArrowDownOutlined style={{ color: '#cf1322' }} />
                          )}
                          {stat.trend.value}%
                        </span>
                      )
                    }
                    formatter={stat.formatter}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Gráficos */}
        <Row gutter={[16, 16]}>
          {/* Gráfico de Linha - Evolução Mensal */}
          <Col xs={24} lg={16}>
            <motion.div
              initial={{ x: -30, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.6,
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <Card title="Evolução Mensal" extra={<Badge status="processing" text="Últimos 6 meses" />}>
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      formatter: function(params: any) {
                        let result = `${params[0].name}<br/>`;
                        params.forEach((param: any) => {
                          const value = param.seriesName === 'Valor' 
                            ? `R$ ${Number(param.value).toLocaleString('pt-BR')}`
                            : param.value;
                          result += `${param.seriesName}: ${value}<br/>`;
                        });
                        return result;
                      }
                    },
                    legend: {
                      data: ['Empréstimos', 'Pagamentos']
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: monthlyData.map(item => item.month),
                      boundaryGap: false
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [
                      {
                        name: 'Empréstimos',
                        type: 'line',
                        data: monthlyData.map(item => item.emprestimos),
                        smooth: true,
                        lineStyle: {
                          color: '#1890ff',
                          width: 2
                        },
                        itemStyle: {
                          color: '#1890ff'
                        }
                      },
                      {
                        name: 'Pagamentos',
                        type: 'line',
                        data: monthlyData.map(item => item.pagamentos),
                        smooth: true,
                        lineStyle: {
                          color: '#52c41a',
                          width: 2
                        },
                        itemStyle: {
                          color: '#52c41a'
                        }
                      }
                    ]
                  }}
                  style={{ height: '300px' }}
                />
              </Card>
            </motion.div>
          </Col>

          {/* Gráfico de Pizza - Status dos Empréstimos */}
          <Col xs={24} lg={8}>
            <motion.div
              initial={{ x: 30, opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8,
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ scale: 1.02 }}
            >
              <Card title="Status dos Empréstimos">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'item',
                      formatter: '{a} <br/>{b}: {c}% ({d}%)'
                    },
                    legend: {
                      orient: 'vertical',
                      left: 'left'
                    },
                    series: [
                      {
                        name: 'Status',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        center: ['60%', '50%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                          borderRadius: 5,
                          borderColor: '#fff',
                          borderWidth: 2
                        },
                        label: {
                          show: false,
                          position: 'center'
                        },
                        emphasis: {
                          label: {
                            show: true,
                            fontSize: '18',
                            fontWeight: 'bold'
                          }
                        },
                        labelLine: {
                          show: false
                        },
                        data: statusData.map(item => ({
                          value: item.value,
                          name: item.name,
                          itemStyle: {
                            color: item.color
                          }
                        }))
                      }
                    ]
                  }}
                  style={{ height: '300px' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Gráfico de Barras - Valores por Mês */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card title="Valores Emprestados por Mês">
                <ReactECharts
                  option={{
                    tooltip: {
                      trigger: 'axis',
                      formatter: function(params: any) {
                        const value = params[0].value;
                        return `${params[0].name}<br/>Valor: R$ ${Number(value).toLocaleString('pt-BR')}`;
                      }
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      data: monthlyData.map(item => item.month),
                      boundaryGap: false
                    },
                    yAxis: {
                      type: 'value',
                      axisLabel: {
                        formatter: function(value: number) {
                          return `R$ ${(value / 1000).toFixed(0)}k`;
                        }
                      }
                    },
                    series: [{
                      name: 'Valor',
                      type: 'line',
                      data: monthlyData.map(item => item.valor),
                      smooth: true,
                      lineStyle: {
                        color: '#722ed1',
                        width: 2
                      },
                      itemStyle: {
                        color: '#722ed1'
                      },
                      areaStyle: {
                        color: {
                          type: 'linear',
                          x: 0,
                          y: 0,
                          x2: 0,
                          y2: 1,
                          colorStops: [{
                            offset: 0, color: 'rgba(114, 46, 209, 0.3)'
                          }, {
                            offset: 1, color: 'rgba(114, 46, 209, 0.1)'
                          }]
                        }
                      }
                    }]
                  }}
                  style={{ height: '300px' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        {/* Listas e Tabelas */}
        {/* Gráfico ECharts - Exemplo */}
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card title="Análise de Empréstimos - ECharts" style={{ marginBottom: 16 }}>
                <ReactECharts
                  option={{
                    title: {
                      text: 'Empréstimos por Mês',
                      left: 'center'
                    },
                    tooltip: {
                      trigger: 'axis'
                    },
                    legend: {
                      data: ['Aprovados', 'Pendentes', 'Rejeitados'],
                      top: 30
                    },
                    grid: {
                      left: '3%',
                      right: '4%',
                      bottom: '3%',
                      containLabel: true
                    },
                    xAxis: {
                      type: 'category',
                      boundaryGap: false,
                      data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
                    },
                    yAxis: {
                      type: 'value'
                    },
                    series: [
                      {
                        name: 'Aprovados',
                        type: 'line',
                        stack: 'Total',
                        data: [120, 132, 101, 134, 90, 230],
                        smooth: true,
                        itemStyle: { color: '#52c41a' }
                      },
                      {
                        name: 'Pendentes',
                        type: 'line',
                        stack: 'Total',
                        data: [220, 182, 191, 234, 290, 330],
                        smooth: true,
                        itemStyle: { color: '#faad14' }
                      },
                      {
                        name: 'Rejeitados',
                        type: 'line',
                        stack: 'Total',
                        data: [150, 232, 201, 154, 190, 330],
                        smooth: true,
                        itemStyle: { color: '#ff4d4f' }
                      }
                    ]
                  }}
                  style={{ height: '400px' }}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {/* Empréstimos Recentes */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card title="Empréstimos Recentes" extra={<a href="/emprestimos">Ver todos</a>}>
                <List
                  itemLayout="horizontal"
                  dataSource={recentLoans}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: '#1890ff' }}>
                            {item.cliente.charAt(0)}
                          </Avatar>
                        }
                        title={
                          <Space>
                            {item.cliente}
                            <Tag color={getStatusColor(item.status)}>
                              {getStatusText(item.status)}
                            </Tag>
                          </Space>
                        }
                        description={
                          <Space>
                            <Text strong>R$ {item.valor.toLocaleString('pt-BR')}</Text>
                            <Text type="secondary">
                              {format(item.data, 'dd/MM/yyyy', { locale: ptBR })}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>

          {/* Top Clientes */}
          <Col xs={24} lg={12}>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card title="Top Clientes" extra={<TrophyOutlined style={{ color: '#faad14' }} />}>
                <List
                  itemLayout="horizontal"
                  dataSource={topClients}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge count={index + 1} color="#1890ff">
                            <Avatar style={{ backgroundColor: '#52c41a' }}>
                              {item.avatar}
                            </Avatar>
                          </Badge>
                        }
                        title={item.name}
                        description={
                          <Space direction="vertical" size={0}>
                            <Text type="secondary">
                              {item.emprestimos} empréstimos
                            </Text>
                            <Text strong>
                              R$ {item.valor.toLocaleString('pt-BR')}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Space>
    </motion.div>
  );
};

export default Dashboard;