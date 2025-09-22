import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Formatação de moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatação de porcentagem
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Formatação de data
export const formatDate = (date: string | Date, pattern: string = 'dd/MM/yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return '';
    return format(dateObj, pattern, { locale: ptBR });
  } catch {
    return '';
  }
};

// Formatação de data e hora
export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'dd/MM/yyyy HH:mm');
};

// Formatação de CPF
export const formatCPF = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
  }
  return cpf;
};

// Formatação de telefone
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  } else if (cleaned.length === 10) {
    const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
  }
  return phone;
};

// Validação de CPF
export const isValidCPF = (cpf: string): boolean => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de telefone
export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
};

// Remover formatação de CPF
export const cleanCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

// Remover formatação de telefone
export const cleanPhone = (phone: string): string => {
  return phone.replace(/\D/g, '');
};

// Calcular idade
export const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = typeof birthDate === 'string' ? parseISO(birthDate) : birthDate;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Calcular dias entre datas
export const daysBetween = (date1: string | Date, date2: string | Date): number => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Verificar se data está vencida
export const isOverdue = (dueDate: string | Date): boolean => {
  const today = new Date();
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
  return due < today;
};

// Gerar cores para status
export const getStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    ACTIVE: '#2196F3',
    PAID: '#4CAF50',
    OVERDUE: '#F44336',
    CANCELLED: '#9E9E9E',
    PENDING: '#FF9800',
  };
  return colors[status] || '#9E9E9E';
};

// Traduzir status
export const translateStatus = (status: string): string => {
  const translations: { [key: string]: string } = {
    ACTIVE: 'Ativo',
    PAID: 'Pago',
    OVERDUE: 'Vencido',
    CANCELLED: 'Cancelado',
    PENDING: 'Pendente',
    SIMPLE: 'Simples',
    COMPOUND: 'Composto',
    MONTHLY: 'Mensal',
    INSTALLMENT: 'Parcela',
    PARTIAL: 'Parcial',
    FULL: 'Total',
    ADVANCE: 'Antecipado',
    CASH: 'Dinheiro',
    PIX: 'PIX',
    BANK_TRANSFER: 'Transferência',
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
  };
  return translations[status] || status;
};

// Traduzir tipo de interesse
export const translateInterestType = (type: string): string => {
  const translations: { [key: string]: string } = {
    SIMPLE: 'Juros Simples',
    COMPOUND: 'Juros Compostos',
    MONTHLY: 'Juros Mensais',
  };
  return translations[type] || type;
};

// Traduzir método de pagamento
export const translatePaymentMethod = (method: string): string => {
  const translations: { [key: string]: string } = {
    CASH: 'Dinheiro',
    PIX: 'PIX',
    BANK_TRANSFER: 'Transferência Bancária',
    CREDIT_CARD: 'Cartão de Crédito',
    DEBIT_CARD: 'Cartão de Débito',
  };
  return translations[method] || method;
};

// Calcular juros simples
export const calculateSimpleInterest = (
  principal: number,
  rate: number,
  periods: number
): number => {
  return principal * (rate / 100) * periods;
};

// Calcular juros compostos
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  periods: number
): number => {
  return principal * Math.pow(1 + rate / 100, periods) - principal;
};

// Calcular valor da parcela
export const calculateInstallmentAmount = (
  totalAmount: number,
  numberOfPeriods: number
): number => {
  return totalAmount / numberOfPeriods;
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalizar primeira letra
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Gerar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Download de arquivo
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copiar para clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};