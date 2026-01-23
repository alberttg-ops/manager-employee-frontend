import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { combineLatest, filter, take } from 'rxjs';

@Component({
  selector: 'app-auth-gate',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gate">
      <div class="spinner"></div>
      <p>Redirecting to login…</p>
    </div>
  `,
})
export class AuthGatePage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    combineLatest([
      this.auth.isLoading$,
      this.auth.isAuthenticated$,
    ])
      .pipe(
        filter(([isLoading]) => !isLoading),
        take(1) // ✅ prevents re-execution
      )
      .subscribe(([, isAuthenticated]) => {
        if (isAuthenticated) {
          this.router.navigateByUrl('/employees');
        } else {
          this.auth.loginWithRedirect({
            appState: { target: '/employees' },
          });
        }
      });
  }
}
