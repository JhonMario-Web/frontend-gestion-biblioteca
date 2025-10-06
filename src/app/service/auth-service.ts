import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { User } from '../core/models/user.model';
import { AuthResponse, LoginRequest, RegisterRequest } from '../core/models/auth.model';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage-service';

const TOKEN_KEY = 'library.auth.token';
const USER_KEY = 'library.auth.user';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private readonly http = inject(HttpClient);
	private readonly storage = inject(StorageService);
	private readonly router = inject(Router);

	private readonly _token = signal<string | null>(this.storage.getItem<string>(TOKEN_KEY));
	private readonly _user = signal<User | null>(this.storage.getItem<User>(USER_KEY));

	readonly token = computed(() => this._token());
	readonly currentUser = computed(() => this._user());
	readonly isLoggedIn = computed(() => Boolean(this._token()));

	login(payload: LoginRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
			tap((response) => this.persistSession(response))
		);
	}

	register(payload: RegisterRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/registrar-usuario`, payload).pipe(
			tap((response) => this.persistSession(response))
		);
	}

	logout(): void {
		this._token.set(null);
		this._user.set(null);
		this.storage.removeItem(TOKEN_KEY);
		this.storage.removeItem(USER_KEY);
		this.router.navigate(['/auth/login']);
	}

	updateStoredUser(user: User): void {
		this._user.set(user);
		this.storage.setItem(USER_KEY, user);
	}

	private persistSession(response: AuthResponse): void {
		this._token.set(response.token);
		this._user.set(response.usuario);
		this.storage.setItem(TOKEN_KEY, response.token);
		this.storage.setItem(USER_KEY, response.usuario);
	}
}
