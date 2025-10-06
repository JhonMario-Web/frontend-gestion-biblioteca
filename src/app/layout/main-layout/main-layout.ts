import { AsyncPipe, DatePipe, LowerCasePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../service/auth-service';
import { OperationTrackerService } from '../../service/operation-tracker-service';
import { map, shareReplay } from 'rxjs';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

interface NavItem {
	label: string;
	icon: string;
	route: string;
	roles?: string[];
}

@Component({
	selector: 'app-main-layout',
	standalone: true,
	imports: [
		NgIf,
		NgFor,
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		NgClass,
		AsyncPipe,
		DatePipe,
		LowerCasePipe,
		MatSidenavModule,
		MatToolbarModule,
		MatIconModule,
		MatListModule,
		MatButtonModule,
		MatMenuModule,
		MatTooltipModule,
		MatDividerModule,
		MatSnackBarModule
	],
	templateUrl: './main-layout.html',
	styleUrl: './main-layout.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayout {
	private readonly breakpoints = inject(BreakpointObserver);
	private readonly auth = inject(AuthService);
	private readonly tracker = inject(OperationTrackerService);

	readonly user = this.auth.currentUser;
	readonly isHandset$ = this.breakpoints
		.observe(Breakpoints.Handset)
		.pipe(
			map((result) => result.matches),
			shareReplay({ bufferSize: 1, refCount: true })
		);

	readonly navItems: NavItem[] = [
		{ label: 'Panel principal', icon: 'dashboard', route: '/' },
		{ label: 'Libros', icon: 'menu_book', route: '/books' },
		// { label: 'Préstamos', icon: 'import_contacts', route: '/loans', roles: ['ROLE_ADMIN', 'ROLE_LIBRARIAN'] },
		{ label: 'Préstamos', icon: 'import_contacts', route: '/loans'},
		{ label: 'Usuarios', icon: 'group', route: '/users'}
	];

	readonly history = this.tracker.recentHistory;
	readonly queueSize = this.tracker.queueSize;
	readonly colorScheme = computed(() => (this.user()?.roles.includes('ROLE_ADMIN') ? 'primary' : 'accent'));

	expanded = signal(false);

	toggleNavigation(): void {
		this.expanded.update((value) => !value);
	}

	shouldDisplay(item: NavItem): boolean {
		const currentUser = this.user();
		if (!item.roles) {
			return true;
		}
		return Boolean(currentUser && item.roles.includes(currentUser.roles[0]));
	}

	logout(): void {
		this.tracker.pushRecentAction({
			timestamp: Date.now(),
			entity: 'AUTH',
			type: 'LOGOUT',
			metadata: { email: this.user()?.correo }
		});
		this.auth.logout();
	}
}
