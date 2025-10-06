import { Component, Inject, inject } from '@angular/core';
import { Book, BookPayload } from '../../../core/models/book.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgIf } from '@angular/common';

export interface BookDialogData {
  title: string;
  book?: Book;
}

@Component({
	selector: 'app-book-dialog',
	imports: [
		NgIf,
		MatDialogModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './book-dialog.html',
	styleUrl: './book-dialog.scss'
})
export class BookDialog {

	private readonly fb = inject(FormBuilder);
	private readonly dialogRef = inject(MatDialogRef<BookDialog>);

	constructor(@Inject(MAT_DIALOG_DATA) public data: BookDialogData) { }

	readonly form = this.fb.nonNullable.group({
		titulo: ['', [Validators.required, Validators.minLength(3)]],
		autor: ['', [Validators.required]],
		isbn: ['', [Validators.required, Validators.minLength(6)]],
		categoria: ['', Validators.required],
		anioPublicacion: [0, [Validators.required, Validators.min(1900)]],
		copiasTotales: [0, [Validators.required, Validators.min(1)]],
		copiasDisponibles: [0, [Validators.required, Validators.min(1)]],
	});

	ngOnInit(): void {
		if (this.data.book) {
			this.form.patchValue({
				...this.data.book,
				copiasDisponibles: this.data.book.copiasDisponibles
			});
		}

		this.form.controls.copiasTotales.valueChanges.subscribe((value) => {
			if (!this.data.book) {
				this.form.controls.copiasDisponibles.setValue(value ?? 1, { emitEvent: false });
			}
		});
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.getRawValue();
		const payload: BookPayload = {
			titulo: value.titulo,
			autor: value.autor,
			isbn: value.isbn,
			categoria: value.categoria,
			anioPublicacion: value.anioPublicacion,
			copiasTotales: value.copiasTotales,
			copiasDisponibles: value.copiasDisponibles,
		};

		this.dialogRef.close(payload);
	}
}
