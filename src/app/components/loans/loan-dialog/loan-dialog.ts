import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { CreateLoanRequest } from '../../../core/models/loan.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';
import { Book } from '../../../core/models/book.model';
import { LowerCasePipe, NgFor, NgIf } from '@angular/common';


export interface LoanDialogData {
	users: User[];
	books: Book[];
}

@Component({
	standalone: true,
	selector: 'app-loan-dialog',
	imports: [
		NgFor,
		NgIf,
		MatDialogModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		LowerCasePipe,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './loan-dialog.html',
	styleUrl: './loan-dialog.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoanDialog {

	private readonly fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<LoanDialog>);

	constructor(@Inject(MAT_DIALOG_DATA) public data: LoanDialogData) { }

	readonly form = this.fb.nonNullable.group({
		usuarioId: [null as number | null, Validators.required],
		libroId: [null as number | null, Validators.required],
		diasPrestamo: [7, [Validators.required, Validators.min(1)]]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const { usuarioId, libroId, diasPrestamo } = this.form.getRawValue();
		const payload: CreateLoanRequest = {
			usuarioId: usuarioId!,
			libroId: libroId!,
			diasPrestamo: diasPrestamo!
		};
		this.dialogRef.close(payload);
	}
}
