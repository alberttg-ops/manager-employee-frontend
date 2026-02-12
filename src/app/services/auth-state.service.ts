import { inject, Injectable, signal, computed } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';


type Role = 'Manager' | 'Employee';

@Injectable({ providedIn: 'root' })
export class AuthStateService {

  private readonly auth = inject(AuthService);
  private readonly ROLE_NAMESPACE = 'https://employee-manager.app/roles';

  // store full user info including sub
  readonly user = signal<{
    id: string;
    name: string;
    role: Role;
  } | null>(null);

  readonly isManager = computed(
    () => this.user()?.role === 'Manager'
  );

  init(): void {
    this.auth.idTokenClaims$.subscribe(claims => {
      if (!claims) return;

      const roles = claims[this.ROLE_NAMESPACE] as Role[] | undefined;

      this.user.set({
        id: claims['name'] as string,  // 🔥 REQUIRED
        name: (claims['name'] as string) ?? 'User',
        role: roles?.[0] ?? 'Employee',
      });
    });
  }

  // 🔥 REQUIRED FOR WEBSOCKET
async getAccessToken(): Promise<string> {
  const token = await firstValueFrom(
    this.auth.getAccessTokenSilently()
  );

  if (!token) {
    throw new Error("Access token not available");
  }

  return token;
}


  logout(): void {
    this.auth.logout({
      logoutParams: { returnTo: window.location.origin },
    });
  }
}
