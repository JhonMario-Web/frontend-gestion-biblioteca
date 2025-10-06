import { inject, Injectable } from '@angular/core';
import { UpdateUserStatusRequest, User } from '../core/models/user.model';
import { environment } from '../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { Page } from '../core/models/pagination.model';
import { OperationTrackerService } from './operation-tracker-service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class UserService {

	private readonly http = inject(HttpClient);
	private readonly tracker = inject(OperationTrackerService);

	list(page = 0, size = 20): Observable<Page<User>> {
		const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
		return this.http.get<Page<User>>(`${environment.apiUrl}/usuarios`, { params });
	}

	getById(id: number): Observable<User> {
		return this.http.get<User>(`${environment.apiUrl}/usuarios/${id}`);
	}

	deactivate(id: number): Observable<void> {
		const payload: UpdateUserStatusRequest = { active: false };
		return this.http
			.put<void>(`${environment.apiUrl}/usuarios/${id}/desactivar-usuario`, payload)
			.pipe(
				tap(() =>
					this.tracker.pushRecentAction({
						timestamp: Date.now(),
						entity: 'USER',
						type: 'UPDATED',
						metadata: { id, action: 'DEACTIVATED' }
					})
				)
			);
	}
}
