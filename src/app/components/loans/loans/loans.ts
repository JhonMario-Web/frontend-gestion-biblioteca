import { DatePipe, LowerCasePipe, NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { LoanService } from '../../../service/loan-service';
import { BookService } from '../../../service/book-service';
import { UserService } from '../../../service/user-service';
import { NotificacionService } from '../../../service/notificacion-service';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../../core/models/book.model';
import { User } from '../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LoanDialog } from '../loan-dialog/loan-dialog';
import { Loan } from '../../../core/models/loan.model';

@Component({
	selector: 'app-loans',
	standalone: true,
	imports: [
		DatePipe,
		NgClass,
		NgIf,
		LowerCasePipe,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		MatMenuModule],
	templateUrl: './loans.html',
	styleUrl: './loans.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Loans {

	private readonly loanService = inject(LoanService);
	private readonly bookService = inject(BookService);
	private readonly userService = inject(UserService);
	private readonly notifications = inject(NotificacionService);
	private readonly dialog = inject(MatDialog);
	private readonly destroyRef = inject(DestroyRef);

	readonly loans = signal<Loan[]>([]);
	readonly displayedColumns = ['book', 'user', 'startDate', 'dueDate', 'status', 'actions'];
	readonly availableBooks = signal<Book[]>([]);
	readonly activeUsers = signal<User[]>([]);
	readonly queuedLoans = computed(() => (this.loans() ?? []).filter((loan) => loan.estado === 'QUEUED').length);

	constructor() {
		this.loadLoans();
		this.prefetchResources();
	}

	loadLoans(): void {
		this.loanService
			.list()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((page) => {
				console.log(page);
				this.loans.set(page.contenido);
			});
	}

	prefetchResources(): void {
		this.bookService
			.getAvailableBooks(50)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((books) => this.availableBooks.set(books));

		this.userService
			.list(0, 50)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((page) => this.activeUsers.set(page.contenido.filter((user) => user.activo)));
	}

	openCreateDialog(): void {
		this.dialog
			.open(LoanDialog, {
				width: '520px',
				data: { users: this.activeUsers(), books: this.availableBooks() }
			})
			.afterClosed()
			.subscribe((payload) => {
				if (!payload) {
					return;
				}

				this.loanService.create(payload).subscribe(() => {
					this.notifications.success('Préstamo registrado con éxito.');
					this.loadLoans();
				});
			});
	}

	registerReturn(loan: Loan): void {
		this.loanService.registerReturn(loan.id).subscribe(() => {
			this.notifications.success('Devolución registrada correctamente.');
			this.loadLoans();
		});
	}
}
