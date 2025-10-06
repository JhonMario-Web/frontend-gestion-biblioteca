import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { Loan } from '../../core/models/loan.model';
import { BookService } from '../../service/book-service';
import { LoanService } from '../../service/loan-service';
import { UserService } from '../../service/user-service';
import { NotificacionService } from '../../service/notificacion-service';
import { OperationTrackerService } from '../../service/operation-tracker-service';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DatePipe, LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

@Component({
	selector: 'app-dashboard',
	imports: [
		DatePipe,
		NgClass,
		NgIf,
		NgFor,
		LowerCasePipe,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		MatProgressBarModule,
		MatTooltipModule,
		MatDividerModule,
		BaseChartDirective
	],
	providers: [provideCharts(withDefaultRegisterables())],
	templateUrl: './dashboard.html',
	styleUrl: './dashboard.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {

	private readonly bookService = inject(BookService);
	private readonly loanService = inject(LoanService);
	private readonly userService = inject(UserService);
	private readonly notifications = inject(NotificacionService);
	private readonly tracker = inject(OperationTrackerService);
	private readonly destroyRef = inject(DestroyRef);

	readonly books = this.bookService.books;
	readonly loans = this.loanService.loans;
	readonly queueSize = this.tracker.queueSize;

	readonly userCount = signal(0);
	readonly inactiveUsers = signal(0);
	readonly highlightedBooks = computed(() => (this.books()?.contenido ?? []).slice(0, 4));
	readonly topCategories = computed(() => {
		const counter = new Map<string, number>();
		(this.books()?.contenido ?? []).forEach((book) => {
			counter.set(book.category, (counter.get(book.category) ?? 0) + 1);
		});
		return Array.from(counter.entries())
			.map(([category, count]) => ({ category, count }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 3);
	});

	readonly activeLoans = computed(() => this.countLoansByStatus('ACTIVE'));
	readonly overdueLoans = computed(() => this.countLoansByStatus('OVERDUE'));
	readonly returnedToday = computed(() =>
		(this.loans()?.contenido ?? []).filter((loan) =>
			loan.fechaDevolucion && new Date(loan.fechaDevolucion).toDateString() === new Date().toDateString()
		).length
	);

	readonly loansChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
		const active = this.activeLoans();
		const overdue = this.overdueLoans();
		const returned = this.countLoansByStatus('RETURNED');

		return {
			labels: ['Activos', 'Atrasados', 'Devueltos'],
			datasets: [
				{
					data: [active, overdue, returned],
					backgroundColor: ['#6366f1', '#f97316', '#22c55e'],
					hoverOffset: 8
				}
			]
		};
	});

	readonly loansChartOptions: ChartOptions<'doughnut'> = {
		responsive: true,
		plugins: {
			legend: {
				position: 'bottom',
				labels: {
					color: '#1f2937',
					usePointStyle: true
				}
			}
		}
	};

	constructor() {
		this.bookService.loadBooks({ page: 0, size: 6 });
		this.loanService.load(0, 8);
		this.loadUsers();
	}

	refresh(): void {
		this.bookService.loadBooks({ page: 0, size: 6 });
		this.loanService.load(0, 8);
		this.loadUsers();
		this.notifications.info('Indicadores actualizados');
	}

	simulateDeferredProcessing(): void {
		this.tracker.enqueueDeferred({
			entity: 'LOAN',
			type: 'QUEUED',
			metadata: { createdAt: new Date().toISOString() },
			timestamp: Date.now()
		});
		this.notifications.success('Se agregó una operación a la cola de procesamiento.');
	}

	processQueue(): void {
		const processed = this.tracker.consumeNextDeferred();
		if (processed) {
			this.notifications.success('Se procesó la operación en espera.');
		} else {
			this.notifications.info('No hay operaciones pendientes en la cola.');
		}
	}

	private loadUsers(): void {
		this.userService
			.list(0, 20)
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((page) => {
				this.userCount.set(page.totalElementos);
				this.inactiveUsers.set(page.contenido.filter((user) => !user.activo).length);
			});
	}

	private countLoansByStatus(status: Loan['estado']): number {
		return (this.loans()?.contenido ?? []).filter((loan) => loan.estado === status).length;
	}
}
