// Tipos para autenticação
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// Tipos para clientes
export interface Customer {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  whatsapp: boolean;
  address: string;
  createdAt: string;
  updatedAt: string;
  loans?: Loan[];
}

export interface CreateCustomerRequest {
  name: string;
  cpf: string;
  phone: string;
  whatsapp: boolean;
  address: string;
}

export interface UpdateCustomerRequest extends Partial<CreateCustomerRequest> {}

// Tipos para empréstimos
export interface Loan {
  id: string;
  customerId: string;
  principalAmount: number;
  totalAmount: number;
  interestRate: number;
  interestType: 'SIMPLE' | 'COMPOUND' | 'MONTHLY';
  numberOfPeriods: number;
  status: 'ACTIVE' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  startDate: string;
  firstDueDate: string;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  installments?: Installment[];
  payments?: Payment[];
}

export interface CreateLoanRequest {
  customerId: string;
  principalAmount: number;
  interestRate: number;
  interestType: 'SIMPLE' | 'COMPOUND' | 'MONTHLY';
  numberOfPeriods: number;
  startDate: string;
}

export interface UpdateLoanRequest {
  status?: 'ACTIVE' | 'PAID' | 'OVERDUE' | 'CANCELLED';
}

// Tipos para parcelas
export interface Installment {
  id: string;
  loanId: string;
  number: number;
  amount: number;
  dueDate: string;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAmount: number;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  loan?: Loan;
  payments?: Payment[];
}

export interface UpdateInstallmentRequest {
  status?: 'PENDING' | 'PAID' | 'OVERDUE';
  paidAmount?: number;
  paidAt?: string;
}

// Tipos para pagamentos
export interface Payment {
  id: string;
  loanId: string;
  installmentId?: string;
  amount: number;
  type: 'INSTALLMENT' | 'PARTIAL' | 'FULL' | 'ADVANCE';
  method: 'CASH' | 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
  description?: string;
  paymentMethod: 'CASH' | 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
  paymentDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  loan?: Loan;
  installment?: Installment;
}

export interface CreatePaymentRequest {
  loanId: string;
  installmentId?: string;
  amount: number;
  type: 'INSTALLMENT' | 'PARTIAL' | 'FULL' | 'ADVANCE';
  method: 'CASH' | 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
  description?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  type?: 'INSTALLMENT' | 'PARTIAL' | 'FULL' | 'ADVANCE';
  method?: 'CASH' | 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';
  description?: string;
}

// Enums para pagamentos
export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
export type PaymentMethod = 'CASH' | 'PIX' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'DEBIT_CARD';

// Tipos para recibos
export interface Receipt {
  id: string;
  paymentId: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  loanId: string;
  installmentNumber?: number;
  createdAt: string;
}

// Tipos para dashboard
export interface DashboardStats {
  totalCustomers: number;
  totalLoans: number;
  totalAmount: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  activeLoans: number;
  paidLoans: number;
  overdueLoans: number;
}

export interface MonthlyStats {
  month: string;
  year: number;
  loansCreated: number;
  totalAmount: number;
  totalPaid: number;
  paymentsReceived: number;
}

// Tipos para configuração do sistema
export interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Tipos para paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tipos para formulários
export interface FormErrors {
  [key: string]: string | undefined;
}

// Tipos para API responses
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Tipos para filtros
export interface LoanFilters {
  customerId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentFilters {
  loanId?: string;
  type?: string;
  method?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}