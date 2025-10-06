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

export interface BookDialogData {
  title: string;
  book?: Book;
}

@Component({
	selector: 'app-book-dialog',
	imports: [
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
		title: ['', [Validators.required, Validators.minLength(3)]],
		author: ['', [Validators.required]],
		isbn: ['', [Validators.required, Validators.minLength(6)]],
		category: ['', Validators.required],
		publishedYear: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
		totalCopies: [1, [Validators.required, Validators.min(1)]],
		availableCopies: [{ value: 1, disabled: true }],
		synopsis: [''],
		tags: [[] as string[]]
	});

	ngOnInit(): void {
		if (this.data.book) {
			this.form.patchValue({
				...this.data.book,
				tags: this.data.book.tags ?? [],
				availableCopies: this.data.book.availableCopies
			});
		}

		this.form.controls.totalCopies.valueChanges.subscribe((value) => {
			if (!this.data.book) {
				this.form.controls.availableCopies.setValue(value ?? 1, { emitEvent: false });
			}
		});
	}

	addTag(event: Event): void {
		event.preventDefault();
		const input = event.target as HTMLInputElement;
		const value = input.value.trim();
		if (!value) {
			return;
		}
		const tags = [...this.form.controls.tags.value, value];
		this.form.controls.tags.setValue(tags);
		input.value = '';
	}

	removeTag(tag: string): void {
		const tags = this.form.controls.tags.value.filter((item) => item !== tag);
		this.form.controls.tags.setValue(tags);
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}

		const value = this.form.getRawValue();
		const payload: BookPayload = {
			title: value.title,
			author: value.author,
			isbn: value.isbn,
			category: value.category,
			publishedYear: value.publishedYear,
			totalCopies: value.totalCopies,
			synopsis: value.synopsis,
			tags: value.tags
		};

		this.dialogRef.close(payload);
	}
}
