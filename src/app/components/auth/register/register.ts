import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { UserRole } from '../../../core/models/user.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationTrackerService } from '../../../service/operation-tracker-service';
import { NotificacionService } from '../../../service/notificacion-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../service/auth-service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { LowerCasePipe } from '@angular/common';

@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		ReactiveFormsModule,
		LowerCasePipe,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatSelectModule,
		MatIconModule
	],
	templateUrl: './register.html',
	styleUrl: './register.scss'
})
export class Register {

	private readonly fb = inject(FormBuilder);
	private readonly auth = inject(AuthService);
	private readonly router = inject(Router);
	private readonly notifications = inject(NotificacionService);
	private readonly tracker = inject(OperationTrackerService);

	isLoading = false;
	readonly roles: UserRole[] = ['ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_READER'];

	readonly form = this.fb.nonNullable.group({
		nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
		correo: ['', [Validators.required, Validators.email]],
		clave: ['', [Validators.required, Validators.minLength(6)]],
		role: ['READER' as UserRole]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		this.isLoading = true;
		this.auth
			.register(this.form.getRawValue())
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: (response) => {
					this.notifications.success('Cuenta creada con éxito, inicia sesión para continuar.');
					this.tracker.pushRecentAction({
						timestamp: Date.now(),
						entity: 'USER',
						type: 'CREATED',
						metadata: { email: response.usuario.correo }
					});
					this.router.navigate(['/']);
				}
			});
	}
}
