import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { take } from 'rxjs';

@Component({
  selector: 'app-callback',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gate">
      <div class="spinner"></div>
      <p>Signing you in…</p>
    </div>
  `,
})
export class CallbackPage implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.auth.handleRedirectCallback().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: () => this.router.navigateByUrl('/'),
    });
  }
}
