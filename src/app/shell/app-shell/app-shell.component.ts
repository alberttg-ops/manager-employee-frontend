import {
  Component,
  ChangeDetectionStrategy,
  effect,
  inject
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { AuthStateService } from '../../services/auth-state.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, SidebarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './app-shell.component.scss',
  template: `
    <div class="layout">
      <app-sidebar />
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class AppShellComponent {
  private readonly authState = inject(AuthStateService);
  private readonly router = inject(Router);

  constructor() {
    // existing behavior — DO NOT REMOVE
    this.authState.init();

    // added behavior — safe, non-breaking
    effect(() => {
      const user = this.authState.user();
      if (!user) return;

      // name === email === employee id
      if (this.router.url === '/') {
        this.router.navigate(['/employees', user.name]);
      }
    });
  }
}
