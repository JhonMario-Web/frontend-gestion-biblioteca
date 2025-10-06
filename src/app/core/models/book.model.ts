export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'RESERVED' | 'INACTIVE';

export interface Book {
	id: number;
	title: string;
	author: string;
	isbn: string;
	category: string;
	publishedYear: number;
	totalCopies: number;
	availableCopies: number;
	synopsis?: string;
	tags?: string[];
	status: BookStatus;
	createdAt: string;
	updatedAt?: string;
}

export interface BookPayload {
	title: string;
	author: string;
	isbn: string;
	category: string;
	publishedYear: number;
	totalCopies: number;
	synopsis?: string;
	tags?: string[];
}

export interface BookFilters {
	page?: number;
	size?: number;
	term?: string;
	category?: string;
	status?: BookStatus | 'ALL';
}