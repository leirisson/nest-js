import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Loan,
  CreateLoanRequest,
  UpdateLoanRequest,
  Installment,
  UpdateInstallmentRequest,
  Payment,
  CreatePaymentRequest,
  Receipt,
  DashboardStats,
  MonthlyStats,
  PaginatedResponse,
  PaginationParams,
  LoanFilters,
  PaymentFilters,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas e erros
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response: AxiosResponse<LoginResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Métodos para clientes
  async getCustomers(params?: PaginationParams): Promise<PaginatedResponse<Customer>> {
    const response = await this.api.get('/customers', { params });
    return response.data;
  }

  async getCustomer(id: string): Promise<Customer> {
    const response = await this.api.get(`/customers/${id}`);
    return response.data;
  }

  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const response = await this.api.post('/customers', data);
    return response.data;
  }

  async updateCustomer(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    const response = await this.api.patch(`/customers/${id}`, data);
    return response.data;
  }

  async deleteCustomer(id: string): Promise<void> {
    await this.api.delete(`/customers/${id}`);
  }

  async getCustomerLoans(customerId: string): Promise<Loan[]> {
    const response = await this.api.get(`/customers/${customerId}/loans`);
    return response.data;
  }

  // Métodos para empréstimos
  async getLoans(params?: PaginationParams & LoanFilters): Promise<PaginatedResponse<Loan>> {
    const response = await this.api.get('/loans', { params });
    return response.data;
  }

  async getLoan(id: string): Promise<Loan> {
    const response = await this.api.get(`/loans/${id}`);
    return response.data;
  }

  async createLoan(data: CreateLoanRequest): Promise<Loan> {
    const response = await this.api.post('/loans', data);
    return response.data;
  }

  async updateLoan(id: string, data: UpdateLoanRequest): Promise<Loan> {
    const response = await this.api.patch(`/loans/${id}`, data);
    return response.data;
  }

  async deleteLoan(id: string): Promise<void> {
    await this.api.delete(`/loans/${id}`);
  }

  async getLoanInstallments(loanId: string): Promise<Installment[]> {
    const response = await this.api.get(`/loans/${loanId}/installments`);
    return response.data;
  }

  async getLoanPayments(loanId: string): Promise<Payment[]> {
    const response = await this.api.get(`/loans/${loanId}/payments`);
    return response.data;
  }

  // Métodos para parcelas
  async getInstallments(params?: PaginationParams): Promise<PaginatedResponse<Installment>> {
    const response = await this.api.get('/installments', { params });
    return response.data;
  }

  async getInstallment(id: string): Promise<Installment> {
    const response = await this.api.get(`/installments/${id}`);
    return response.data;
  }

  async updateInstallment(id: string, data: UpdateInstallmentRequest): Promise<Installment> {
    const response = await this.api.patch(`/installments/${id}`, data);
    return response.data;
  }

  async getOverdueInstallments(): Promise<Installment[]> {
    const response = await this.api.get('/installments/overdue');
    return response.data;
  }

  // Métodos para pagamentos
  async getPayments(params?: PaginationParams & PaymentFilters): Promise<PaginatedResponse<Payment>> {
    const response = await this.api.get('/payments', { params });
    return response.data;
  }

  async getPayment(id: string): Promise<Payment> {
    const response = await this.api.get(`/payments/${id}`);
    return response.data;
  }

  async createPayment(data: CreatePaymentRequest): Promise<Payment> {
    const response = await this.api.post('/payments', data);
    return response.data;
  }

  async deletePayment(id: string): Promise<void> {
    await this.api.delete(`/payments/${id}`);
  }

  async getPaymentStats(loanId: string): Promise<any> {
    const response = await this.api.get(`/payments/loan/${loanId}/stats`);
    return response.data;
  }

  // Métodos para recibos
  async getPaymentReceipt(paymentId: string): Promise<Receipt> {
    const response = await this.api.get(`/receipts/payment/${paymentId}`);
    return response.data;
  }

  async getPaymentReceiptHtml(paymentId: string): Promise<string> {
    const response = await this.api.get(`/receipts/payment/${paymentId}/html`);
    return response.data;
  }

  async downloadPaymentReceiptPdf(paymentId: string): Promise<Blob> {
    const response = await this.api.get(`/api/receipts/payment/${paymentId}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async printPaymentReceipt(paymentId: string): Promise<Blob> {
    const response = await this.api.get(`/receipts/payment/${paymentId}/print`, {
      responseType: 'blob',
    });
    return response.data;
  }

  async getCustomerReceipts(customerId: string): Promise<Receipt[]> {
    const response = await this.api.get(`/receipts/customer/${customerId}`);
    return response.data;
  }

  async getLoanReceipts(loanId: string): Promise<Receipt[]> {
    const response = await this.api.get(`/receipts/loan/${loanId}`);
    return response.data;
  }

  // Métodos para dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await this.api.get('/dashboard/stats');
    return response.data;
  }

  async getMonthlyStats(): Promise<MonthlyStats[]> {
    const response = await this.api.get('/dashboard/monthly-stats');
    return response.data;
  }

  // Métodos para área do cliente
  async getCustomerDashboard(): Promise<any> {
    const response = await this.api.get('/customers/me/dashboard');
    return response.data;
  }

  async getCustomerLoans(): Promise<Loan[]> {
    const response = await this.api.get('/customers/me/loans');
    return response.data;
  }

  async getCustomerPayments(): Promise<Payment[]> {
    const response = await this.api.get('/customers/me/payments');
    return response.data;
  }

  // Método genérico para requisições customizadas
  async request<T = any>(method: string, url: string, data?: any, config?: any): Promise<T> {
    const response = await this.api.request({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;