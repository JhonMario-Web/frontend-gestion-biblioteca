import { Component, computed, inject, signal } from '@angular/core';
import { Book, BookFilters, BookPayload } from '../../../core/models/book.model';
import { BookDialog, BookDialogData } from '../book-dialog/book-dialog';
import { finalize } from 'rxjs';
import { NotificacionService } from '../../../service/notificacion-service';
import { BookService } from '../../../service/book-service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';

@Component({
	selector: 'app-books',
	standalone: true,
	imports: [
		DatePipe,
		LowerCasePipe,
		NgClass,
		NgIf,
		NgFor,
		ReactiveFormsModule,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatDialogModule
	],
	templateUrl: './books.html',
	styleUrl: './books.scss'
})
export class Books {

	private readonly fb = inject(FormBuilder);
	private readonly dialog = inject(MatDialog);
	private readonly bookService = inject(BookService);
	private readonly notifications = inject(NotificacionService);

	readonly books = this.bookService.books;
	readonly displayedColumns = ['title', 'author', 'category', 'copies', 'actions'];

	readonly filterForm = this.fb.group({
		term: this.fb.control('', { nonNullable: true }),
		category: this.fb.control('', { nonNullable: true }),
		status: this.fb.control<BookFilters['status']>('ALL', { nonNullable: true })
	});

	readonly isLoading = signal(false);
	readonly totalBooks = computed(() => this.books()?.totalElementos ?? 0);

	constructor() {
		this.loadBooks();
	}

	loadBooks(filters: BookFilters = {}): void {
		this.isLoading.set(true);
		const { term, category, status } = this.filterForm.getRawValue();
		const request: BookFilters = {
			page: filters.page ?? 0,
			size: filters.size ?? 10,
			term,
			category,
			status: status as BookFilters['status']
		};

		this.bookService
			.loadBooks(request)
			.pipe(finalize(() => this.isLoading.set(false)))
			.subscribe();
	}

	applyFilters(): void {
		this.loadBooks({ page: 0 });
	}

	clearFilters(): void {
		this.filterForm.reset({ term: '', category: '', status: 'ALL' as BookFilters['status'] });
		this.loadBooks({ page: 0 });
	}

	openDialog(book?: Book): void {
		const data: BookDialogData = {
			title: book ? 'Editar libro' : 'Registrar libro',
			book
		};

		this.dialog
			.open<BookDialog, BookDialogData, BookPayload>(BookDialog, {
				width: '700px',
				data
			})
			.afterClosed()
			.subscribe((payload) => {
				if (!payload) {
					return;
				}

				if (book) {
					this.bookService.update(book.id, payload).subscribe(() => {
						this.notifications.success('Libro actualizado correctamente.');
						this.loadBooks();
					});
				} else {
					this.bookService.create(payload).subscribe(() => {
						this.notifications.success('Libro registrado con éxito.');
						this.loadBooks();
					});
				}
			});
	}

	deleteBook(book: Book): void {
		this.bookService.delete(book.id).subscribe(() => {
			this.notifications.success('Libro eliminado.');
			this.loadBooks();
		});
	}
}
