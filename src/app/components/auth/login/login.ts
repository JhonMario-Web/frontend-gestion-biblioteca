import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { OperationTrackerService } from '../../../service/operation-tracker-service';
import { NotificacionService } from '../../../service/notificacion-service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgFor, NgIf } from '@angular/common';


@Component({
	selector: 'app-login',
	imports: [
		NgIf,
		NgFor,
		ReactiveFormsModule,
		RouterLink,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatCheckboxModule
	],
	templateUrl: './login.html',
	styleUrl: './login.scss'
})
export class Login {

	private readonly fb = inject(FormBuilder);
	private readonly auth = inject(AuthService);
	private readonly router = inject(Router);
	private readonly notifications = inject(NotificacionService);
	private readonly tracker = inject(OperationTrackerService);

	hidePassword = true;
	isLoading = false;

	readonly form = this.fb.nonNullable.group({
		correo: ['', [Validators.required, Validators.email]],
		clave: ['', [Validators.required, Validators.minLength(6)]],
		remember: [true]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isLoading = true;
		const { remember, ...payload } = this.form.getRawValue();

		this.auth
			.login(payload)
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (response) => {
					console.log(response);
					this.notifications.success(`¡Hola de nuevo, ${response.usuario}!`);
					this.tracker.pushRecentAction({
						timestamp: Date.now(),
						entity: 'AUTH',
						type: 'LOGIN',
						metadata: { email: response.usuario.correo }
					});
					this.router.navigate(['/']);
				},
				error: () => {
					this.form.patchValue({ clave: '' });
				}
			});
	}
}
