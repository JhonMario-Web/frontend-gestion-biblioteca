export type LoanStatus = 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'QUEUED';

export interface Loan {
  id: number;
  libroId: number;
  usuarioId: number;
  tituloLibro: string;
  nombreUsuario: string;
  fechaPrestamo: string;
  fechaVencimiento: string;
  fechaDevolucion?: string;
  estado: LoanStatus;
  queuePosition?: number;
}

export interface CreateLoanRequest {
  usuarioId: number;
  libroId: number;
  diasPrestamo: number;
}