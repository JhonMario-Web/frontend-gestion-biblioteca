import { computed, inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Book, BookPayload } from '../core/models/book.model';
import { Page } from '../core/models/pagination.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { OperationTrackerService } from './operation-tracker-service';

@Injectable({
	providedIn: 'root'
})
export class BookService {

	private readonly http = inject(HttpClient);
	private readonly tracker = inject(OperationTrackerService);
	private readonly _books = signal<Page<Book> | null>(null);

	readonly books = computed(() => this._books());

	loadBooks(params: { page?: number; size?: number; term?: string; category?: string; status?: string } = {}) {
		const { page = 0, size = 10, term = '', category = '', status = 'ALL' } = params;
		return this.http
			.get<Page<Book>>(
				`${environment.apiUrl}/libros?page=${page}&size=${size}&term=${term}&category=${category}&status=${status}`
			)
			.pipe(
				tap((response) => this._books.set(response))
			);
	}

	search(term: string) {
		const params = new HttpParams().set('term', term);
		return this.http
			.get<Page<Book>>(`${environment.apiUrl}/libros/buscar-libros`, { params })
			.pipe(tap((response) => this._books.set(response)));
	}

	create(payload: BookPayload) {
		return this.http.post<Book>(`${environment.apiUrl}/libros`, payload).pipe(
			tap((book) =>
				this.tracker.pushRecentAction({
					timestamp: Date.now(),
					type: 'CREATED',
					entity: 'BOOK',
					metadata: { title: book.titulo, author: book.autor }
				})
			)
		);
	}

	getAvailableBooks(limit = 20) {
		let params = new HttpParams().set('size', String(limit)).set('status', 'AVAILABLE');
		return this.http
			.get<Page<Book>>(`${environment.apiUrl}/libros`, { params })
			.pipe(map((response) => response.contenido));
	}

	update(id: number, payload: BookPayload) {
		return this.http.put<Book>(`${environment.apiUrl}/libros/${id}`, payload).pipe(
			tap((book) =>
				this.tracker.pushRecentAction({
					timestamp: Date.now(),
					type: 'UPDATED',
					entity: 'BOOK',
					metadata: { title: book.titulo }
				})
			)
		);
	}

	delete(id: number) {
		return this.http.delete<void>(`${environment.apiUrl}/libros/${id}`).pipe(
			tap(() =>
				this.tracker.pushRecentAction({
					timestamp: Date.now(),
					type: 'DELETED',
					entity: 'BOOK',
					metadata: { id }
				})
			)
		);
	}
}
