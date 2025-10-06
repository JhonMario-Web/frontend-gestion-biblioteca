export interface PageRequest {
    page?: number;
    size?: number;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export interface Page<T> {
    contenido: T[];
    totalElementos: number;
    totalPaginas: number;
    numeroPagina: number;
    tamanioPagina: number;
    primera: boolean;
    ultima: boolean;
}