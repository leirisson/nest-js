import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../services/api';
import {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  Loan,
  CreateLoanRequest,
  UpdateLoanRequest,
  Payment,
  CreatePaymentRequest,
  Installment,
  UpdateInstallmentRequest,
  PaginationParams,
  LoanFilters,
  PaymentFilters,
} from '../types';

// Query Keys
export const QUERY_KEYS = {
  customers: 'customers',
  customer: 'customer',
  customerLoans: 'customerLoans',
  loans: 'loans',
  loan: 'loan',
  loanInstallments: 'loanInstallments',
  loanPayments: 'loanPayments',
  installments: 'installments',
  installment: 'installment',
  overdueInstallments: 'overdueInstallments',
  payments: 'payments',
  payment: 'payment',
  paymentStats: 'paymentStats',
  receipts: 'receipts',
  dashboardStats: 'dashboardStats',
  monthlyStats: 'monthlyStats',
} as const;

// Hooks para Clientes
export const useCustomers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.customers, params],
    queryFn: () => apiService.getCustomers(params),
  });
};



export const useCustomer = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.customer, id],
    queryFn: () => apiService.getCustomer(id),
    enabled: !!id,
  });
};

export const useCustomerLoans = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.customerLoans, customerId],
    queryFn: () => apiService.getCustomerLoans(customerId),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCustomerRequest) => apiService.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) => 
      apiService.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customer, id] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customers] });
    },
  });
};

// Hooks para Empréstimos
export const useLoans = (params?: PaginationParams & LoanFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.loans, params],
    queryFn: () => apiService.getLoans(params),
  });
};

export const useLoan = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.loan, id],
    queryFn: () => apiService.getLoan(id),
    enabled: !!id,
  });
};

export const useLoanInstallments = (loanId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.loanInstallments, loanId],
    queryFn: () => apiService.getLoanInstallments(loanId),
    enabled: !!loanId,
  });
};

export const useLoanPayments = (loanId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.loanPayments, loanId],
    queryFn: () => apiService.getLoanPayments(loanId),
    enabled: !!loanId,
  });
};

export const useCreateLoan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateLoanRequest) => apiService.createLoan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.customerLoans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

export const useUpdateLoan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLoanRequest }) => 
      apiService.updateLoan(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loan, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

export const useDeleteLoan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deleteLoan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

// Hooks para Parcelas
export const useInstallments = (params?: PaginationParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.installments, params],
    queryFn: () => apiService.getInstallments(params),
  });
};

export const useInstallment = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.installment, id],
    queryFn: () => apiService.getInstallment(id),
    enabled: !!id,
  });
};

export const useOverdueInstallments = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.overdueInstallments],
    queryFn: () => apiService.getOverdueInstallments(),
  });
};

export const useUpdateInstallment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInstallmentRequest }) => 
      apiService.updateInstallment(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.installments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.installment, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loanInstallments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.overdueInstallments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

// Hooks para Pagamentos
export const usePayments = (params?: PaginationParams & PaymentFilters) => {
  return useQuery({
    queryKey: [QUERY_KEYS.payments, params],
    queryFn: () => apiService.getPayments(params),
  });
};

export const usePayment = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.payment, id],
    queryFn: () => apiService.getPayment(id),
    enabled: !!id,
  });
};

export const usePaymentStats = (loanId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.paymentStats, loanId],
    queryFn: () => apiService.getPaymentStats(loanId),
    enabled: !!loanId,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => apiService.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loanPayments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.installments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loanInstallments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiService.deletePayment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loanPayments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.installments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dashboardStats] });
    },
  });
};

// Hooks para Recibos
export const usePaymentReceipt = (paymentId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.receipts, 'payment', paymentId],
    queryFn: () => apiService.getPaymentReceipt(paymentId),
    enabled: !!paymentId,
  });
};

export const useCustomerReceipts = (customerId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.receipts, 'customer', customerId],
    queryFn: () => apiService.getCustomerReceipts(customerId),
    enabled: !!customerId,
  });
};

export const useLoanReceipts = (loanId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.receipts, 'loan', loanId],
    queryFn: () => apiService.getLoanReceipts(loanId),
    enabled: !!loanId,
  });
};

// Hooks para Dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.dashboardStats],
    queryFn: () => apiService.getDashboardStats(),
  });
};

// Hooks para Recibos
export const useReceipts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.receipts, params],
    queryFn: () => apiService.getReceipts(params),
  });
};

export const useReceipt = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.receipts, id],
    queryFn: () => apiService.getReceipt(id),
    enabled: !!id,
  });
};

// Hook para atualizar pagamento
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Payment> }) =>
      apiService.updatePayment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.payments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.installments] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.loans] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.receipts] });
    },
  });
};

export const useMonthlyStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.monthlyStats],
    queryFn: () => apiService.getMonthlyStats(),
  });
};

// Alias para compatibilidade
export const useClients = useCustomers;
export const useCreateClient = useCreateCustomer;
export const useUpdateClient = useUpdateCustomer;
export const useDeleteClient = useDeleteCustomer;
export const useDashboard = useDashboardStats;