import { Injectable, inject } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, filter, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private auth = inject(AuthService);

  canActivate() {
    return combineLatest([
      this.auth.isLoading$,
      this.auth.isAuthenticated$,
    ]).pipe(
      filter(([isLoading]) => !isLoading),
      take(1),
      map(([, isAuthenticated]) => {
        if (!isAuthenticated) {
          this.auth.loginWithRedirect();
          return false;
        }
        return true;
      })
    );
  }
}
