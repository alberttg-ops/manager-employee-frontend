import { inject, Injectable, signal, computed } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

type Role = 'manager' | 'employee';

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly auth = inject(AuthService);

  readonly user = signal<{ name: string; role: Role } | null>(null);

  readonly isManager = computed(
    () => this.user()?.role =ger'
  );

  init(): void {
    this.auth.user$.subscribe(profile => {
      if (!profile) return;

      const roles = profile['https://employee-manager.app/roles'] as Role[];
      this.user.set({
        name: profile.name ?? 'User',
        role: roles?.[0] ?? 'employee'
      });
    });
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: window.location.origin } });
  }
}
