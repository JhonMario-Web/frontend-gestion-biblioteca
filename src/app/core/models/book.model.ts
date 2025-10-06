export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'INACTIVE';

export interface Book {
	id: number;
	titulo: string;
	autor: string;
	isbn: string;
	categoria: string;
	anioPublicacion: number;
	copiasTotales: number;
	copiasDisponibles: number;
}

export interface BookPayload {
	titulo: string;
	autor: string;
	isbn: string;
	categoria: string;
	anioPublicacion: number;
	copiasTotales: number;
	copiasDisponibles: number;
}
