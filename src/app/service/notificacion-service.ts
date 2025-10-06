import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export class NotificacionService {


	private readonly snackBar = inject(MatSnackBar);

	success(message: string, action = 'Aceptar'): void {
		this.snackBar.open(message, action, {
			duration: 3500,
			panelClass: ['bg-emerald-600', 'text-white']
		});
	}

	error(message: string, action = 'Cerrar'): void {
		this.snackBar.open(message, action, {
			duration: 4500,
			panelClass: ['bg-rose-600', 'text-white']
		});
	}

	info(message: string, action = 'Entendido'): void {
		this.snackBar.open(message, action, {
			duration: 3000,
			panelClass: ['bg-slate-900', 'text-white']
		});
	}
}
