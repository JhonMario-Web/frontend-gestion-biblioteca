import { Component, inject, Inject } from '@angular/core';
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
import { LowerCasePipe } from '@angular/common';


export interface LoanDialogData {
  users: User[];
  books: Book[];
}

@Component({
	selector: 'app-loan-dialog',
	imports: [
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
	styleUrl: './loan-dialog.scss'
})
export class LoanDialog {

	private readonly fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<LoanDialog>);

	constructor(@Inject(MAT_DIALOG_DATA) public data: LoanDialogData) { }

	readonly form = this.fb.nonNullable.group({
		userId: [null as number | null, Validators.required],
		bookId: [null as number | null, Validators.required],
		dueDate: [new Date(new Date().setDate(new Date().getDate() + 7)), Validators.required]
	});

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const { userId, bookId, dueDate } = this.form.getRawValue();
		const payload: CreateLoanRequest = {
			userId: userId!,
			bookId: bookId!,
			dueDate: new Date(dueDate!).toISOString()
		};
		this.dialogRef.close(payload);
	}
}
