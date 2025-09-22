import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown, Typography, Space, Badge, Button } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  BankOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'DASHBOARD', path: '/dashboard' },
  { key: 'clientes', icon: <UserOutlined />, label: 'CLIENTES', path: '/clientes' },
  { key: 'emprestimos', icon: <BankOutlined />, label: 'EMPRÉSTIMOS', path: '/emprestimos' },
  { key: 'pagamentos', icon: <CreditCardOutlined />, label: 'PAGAMENTOS', path: '/pagamentos' },
  { key: 'recibos', icon: <FileTextOutlined />, label: 'RECIBOS', path: '/recibos' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true); // Inicia colapsado por padrão
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginTime] = useState(new Date()); // Simula horário de login
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calcula tempo logado
  const getLoggedTime = () => {
    const diff = Math.floor((currentTime.getTime() - loginTime.getTime()) / 1000);
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = menuItems.find(item => item.key === key);
    if (item) {
      navigate(item.path);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Perfil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Configurações',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: handleLogout,
    },
  ];

  const selectedKey = menuItems.find(item => item.path === location.pathname)?.key || 'dashboard';

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <motion.div
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={260}
          collapsedWidth={60}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 1000,
            background: '#1890ff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            style={{
              height: 64,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#1890ff',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
              }}
            >
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: collapsed ? '50%' : '12px',
                padding: collapsed ? '8px' : '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: collapsed ? 0 : '8px',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}>
                <BankOutlined style={{ 
                  color: 'white', 
                  fontSize: collapsed ? 20 : 18,
                  transition: 'font-size 0.3s ease'
                }} />
                {!collapsed && (
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 14, 
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}>
                    SISTEMA
                  </Text>
                )}
              </div>
            </motion.div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ 
              borderRight: 0,
              background: '#1890ff',
              color: 'white'
            }}
            items={menuItems.map(item => ({
              key: item.key,
              icon: item.icon,
              label: item.label,
            }))}
          />
        </Sider>
      </motion.div>

      <AntLayout style={{ marginLeft: collapsed ? 60 : 260, transition: 'margin-left 0.2s' }}>
        <Header
          style={{
            padding: '0 16px',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            position: 'sticky',
            top: 0,
            zIndex: 999,
            height: 64,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 48,
                height: 48,
              }}
            />
            <Text strong style={{ fontSize: 16, marginLeft: 12 }}>
              {menuItems.find(item => item.path === location.pathname)?.label || 'DASHBOARD'}
            </Text>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto' }}>
            {/* Informações de tempo - compactas */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '140px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CalendarOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                <Text type="secondary" style={{ fontSize: 10, lineHeight: 1.2 }}>
                  {format(currentTime, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ClockCircleOutlined style={{ fontSize: 10, color: '#8c8c8c' }} />
                <Text type="secondary" style={{ fontSize: 10, lineHeight: 1.2 }}>
                  {getLoggedTime()}
                </Text>
              </div>
            </div>

            {/* Divisor visual */}
            <div style={{ width: '1px', height: '32px', backgroundColor: '#f0f0f0' }} />

            {/* Menu do usuário - compacto */}
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <div style={{ 
                cursor: 'pointer', 
                padding: '4px 8px', 
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s',
                ':hover': { backgroundColor: '#f5f5f5' }
              }}>
                <Avatar
                  size={28}
                  icon={<UserOutlined />}
                  style={{ backgroundColor: '#1976d2', fontSize: '12px' }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text strong style={{ fontSize: 12, lineHeight: 1.2 }}>
                    {user?.name || 'Usuário'}
                  </Text>
                  <Text type="secondary" style={{ fontSize: 10, lineHeight: 1.2 }}>
                    {user?.role || 'Admin'}
                  </Text>
                </div>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            minHeight: 'calc(100vh - 112px)',
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              staggerChildren: 0.1
            }}
          >
            {children}
          </motion.div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;