import { inject, Injectable, signal, computed } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

type Role = 'Manager' | 'Employee';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly auth = inject(AuthService);

  private readonly ROLE_NAMESPACE = 'https://employee-manager.app/roles';

  readonly user = signal<{ name: string; role: Role } | null>(null);

  readonly isManager = computed(
    () => this.user()?.role === 'Manager'
  );

  init(): void {
    this.auth.idTokenClaims$.subscribe(claims => {
      if (!claims) return;

      const roles = claims[this.ROLE_NAMESPACE] as Role[] | undefined;

      this.user.set({
        name: (claims['name'] as string) ?? 'User',
        role: roles?.[0] ?? 'Employee',
      });
    });
  }

  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
