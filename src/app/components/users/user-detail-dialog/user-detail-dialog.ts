import { DatePipe, LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/user.model';

@Component({
	selector: 'app-user-detail-dialog',
	standalone: true,
	imports: [
		MatDialogModule, 
		MatIconModule, 
		MatChipsModule, 
		DatePipe,
		LowerCasePipe
	],
	templateUrl: './user-detail-dialog.html',
	styleUrl: './user-detail-dialog.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailDialog {
	constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User }) { }
}
