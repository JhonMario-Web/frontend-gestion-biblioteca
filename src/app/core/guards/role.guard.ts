import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth-service';

export const roleGuard: CanActivateFn = (route) => {
	const auth = inject(AuthService);
	const router = inject(Router);
	const roles = route.data?.['roles'] as string[] | undefined;
	const user = auth.currentUser();

	if (!roles || roles.length === 0) {
		return true;
	}

	if (user && user.roles.some(role => roles.includes(role))) {
        return true;
    }

	return router.createUrlTree(['/']);
};