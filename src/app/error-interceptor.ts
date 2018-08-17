import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from '../../node_modules/rxjs/operators';
import { throwError } from '../../node_modules/rxjs';
import { Injectable } from '../../node_modules/@angular/core';
import { MatDialog } from '../../node_modules/@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur inconnue est survenue!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.dialog.open(ErrorComponent, { data: { message: errorMessage }});
        return throwError(error);
      })
    );
  }
}
