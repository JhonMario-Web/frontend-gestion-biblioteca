import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreateLoanRequest, Loan } from '../core/models/loan.model';
import { environment } from '../../environments/environment.development';
import { Page } from '../core/models/pagination.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { OperationTrackerService } from './operation-tracker-service';

@Injectable({
	providedIn: 'root'
})
export class LoanService {

	private readonly http = inject(HttpClient);
	private readonly tracker = inject(OperationTrackerService);
	private readonly _loans = signal<Page<Loan> | null>(null);

	readonly loans = computed(() => this._loans());

	list(page = 0, size = 20): Observable<Page<Loan>> {
		const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
		return this.http.get<Page<Loan>>(`${environment.apiUrl}/prestamos`, { params });
	}

	load(page = 0, size = 20): void {
		this.list(page, size).subscribe((response) => this._loans.set(response));
	}

	create(payload: CreateLoanRequest): Observable<Loan> {
		return this.http.post<Loan>(`${environment.apiUrl}/prestamos`, payload).pipe(
			tap((loan) =>
				this.tracker.pushRecentAction({
					timestamp: Date.now(),
					entity: 'LOAN',
					type: 'CREATED',
					metadata: { bookTitle: loan.tituloLibro, userName: loan.nombreUsuario }
				})
			)
		);
	}

	registerReturn(loanId: number): Observable<Loan> {
		return this.http.put<Loan>(`${environment.apiUrl}/prestamos/${loanId}/retornar-libro`, {}).pipe(
			tap((loan) =>
				this.tracker.pushRecentAction({
					timestamp: Date.now(),
					entity: 'LOAN',
					type: 'RETURNED',
					metadata: { bookTitle: loan.tituloLibro, userName: loan.nombreUsuario }
				})
			)
		);
	}
}
