import { DatePipe, LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../../../service/user-service';
import { NotificacionService } from '../../../service/notificacion-service';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserDetailDialog } from '../user-detail-dialog/user-detail-dialog';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [
		DatePipe,
		LowerCasePipe,
		NgClass,
		NgIf,
		NgFor,
		MatTableModule,
		MatIconModule,
		MatButtonModule,
		MatChipsModule,
		MatMenuModule
	],
	templateUrl: './users.html',
	styleUrl: './users.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class Users {
	private readonly userService = inject(UserService);
	private readonly notifications = inject(NotificacionService);
	private readonly dialog = inject(MatDialog);
	private readonly destroyRef = inject(DestroyRef);

	readonly displayedColumns = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];
	readonly users = signal<User[]>([]);
	readonly totalUsers = signal(0);
	readonly inactiveUsers = computed(() => this.users().filter((user) => !user.activo).length);

	constructor() {
		this.loadUsers();
	}

	loadUsers(): void {
		this.userService
			.list()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((page) => {
				console.log(page);
				this.users.set(page.contenido);
				this.totalUsers.set(page.totalElementos);
			});
	}

	showDetails(user: User): void {
		this.dialog.open(UserDetailDialog, {
			width: '480px',
			data: { user }
		});
	}

	deactivate(user: User): void {
		this.userService.deactivate(user.id).subscribe(() => {
			this.notifications.success(`${user.nombreCompleto} ha sido desactivado.`);
			this.loadUsers();
		});
	}

	isArray(value: any): boolean {
		return Array.isArray(value);
	} 
}
