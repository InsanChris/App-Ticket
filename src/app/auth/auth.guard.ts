import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '../../../node_modules/@angular/router';
import { Observable } from '../../../node_modules/rxjs';
import { Injectable } from '../../../node_modules/@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authservice: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.authservice.getIsAuth();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return true;
  }
}
