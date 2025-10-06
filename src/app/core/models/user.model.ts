export type UserRole = 'ROLE_ADMIN' | 'ROLE_LIBRARIAN' | 'ROLE_READER';

export interface User {
    id: number;
    nombreCompleto: string;
    correo: string;
    activo: boolean;
    roles: UserRole[];
    fechaRegistro: string;

    // role: UserRole;
    // active: boolean;
    // createdAt: string;
    // updatedAt?: string;
    // loansActive: number;
    // totalLoans: number;
}

export interface UpdateUserStatusRequest {
    active: boolean;
}