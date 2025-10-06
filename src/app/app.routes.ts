import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AuthLayout } from './layout/auth-layout/auth-layout';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './components/dashboard/dashboard';
import { Books } from './components/books/books/books';
import { Loans } from './components/loans/loans/loans';
import { Users } from './components/users/users/users';

export const routes: Routes = [
	{
		path: 'auth',
		component: AuthLayout,
		children: [
			{ path: 'login', component: Login },
			{ path: 'register', component: Register },
			{ path: '', pathMatch: 'full', redirectTo: 'login' }
		]
	},
	{
		path: '',
		component: MainLayout,
		canActivate: [],
		children: [
			{ path: '', component: Dashboard },
			{ path: 'books', component: Books },
			{ path: 'loans', component: Loans, canActivate: [], data: { roles: ['ADMIN', 'LIBRARIAN'] } },
			{ path: 'users', component: Users, canActivate: [], data: { roles: ['ADMIN'] } }
		]
	},
	{ path: '**', redirectTo: '' }
];