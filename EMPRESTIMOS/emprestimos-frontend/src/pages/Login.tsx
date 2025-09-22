import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  Divider,
  theme
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BankOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginRequest } from '../types';

const { Title, Text } = Typography;
const { useToken } = theme;

export const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useToken();

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values: LoginRequest) => {
    setError('');
    setIsLoading(true);

    try {
      const userData = await login(values);
      
      // Redirecionar baseado no tipo de usuário
      if (userData.userType === 'CUSTOMER') {
        navigate('/cliente/dashboard', { replace: true });
      } else {
        const from = (location.state as any)?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Row justify="center" align="middle" style={{ width: '100%', minHeight: '100vh' }}>
        <Col xs={22} sm={16} md={12} lg={8} xl={6}>
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card
              style={{
                borderRadius: 16,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                border: 'none',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '40px 32px' }}>
                {/* Header */}
                <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                  >
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 20px rgba(24, 144, 255, 0.3)'
                      }}
                    >
                      <BankOutlined style={{ fontSize: 36, color: 'white' }} />
                    </div>
                  </motion.div>
                  
                  <div>
                    <Title level={2} style={{ margin: 0, color: '#1f1f1f' }}>
                      Bem-vindo
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      Sistema de Gestão Financeira
                    </Text>
                  </div>
                </Space>

                <Divider style={{ margin: '32px 0' }} />

                {/* Error Alert */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ marginBottom: 24 }}
                  >
                    <Alert
                      message={error}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError('')}
                      style={{ borderRadius: 8 }}
                    />
                  </motion.div>
                )}

                {/* Login Form */}
                <Form
                  form={form}
                  name="login"
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                  requiredMark={false}
                >
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Por favor, insira seu email!' },
                      { type: 'email', message: 'Email inválido!' }
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Digite seu email"
                      style={{ borderRadius: 8, padding: '12px 16px' }}
                      disabled={isLoading}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label="Senha"
                    rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Digite sua senha"
                      iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                      style={{ borderRadius: 8, padding: '12px 16px' }}
                      disabled={isLoading}
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isLoading}
                      block
                      style={{
                        height: 48,
                        borderRadius: 8,
                        fontSize: 16,
                        fontWeight: 500,
                        background: 'linear-gradient(135deg, #1890ff, #722ed1)',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                      }}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </Form.Item>
                </Form>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Text type="secondary" style={{ fontSize: 14 }}>
                    Esqueceu sua senha?{' '}
                    <Button
                      type="link"
                      size="small"
                      style={{ padding: 0, fontSize: 14 }}
                      disabled={isLoading}
                      onClick={() => {
                        // TODO: Implementar recuperação de senha
                        alert('Funcionalidade em desenvolvimento');
                      }}
                    >
                      Clique aqui
                    </Button>
                  </Text>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </div>
  );
};

export default Login;