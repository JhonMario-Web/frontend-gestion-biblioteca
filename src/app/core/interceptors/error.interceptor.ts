import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificacionService } from '../../service/notificacion-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notifier = inject(NotificacionService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'Ha ocurrido un error inesperado.';
            if (error.error?.message) {
                message = error.error.message;
            } else if (error.status === 0) {
                message = 'No se pudo contactar al servidor. Verifica tu conexión.';
            } else if (error.status === 401) {
                message = 'Tu sesión ha expirado, ingresa nuevamente.';
            } else if (error.status === 403) {
                message = 'No tienes permisos para ejecutar esta acción.';
            }

            notifier.error(message);
            return throwError(() => error);
        })
    );
};