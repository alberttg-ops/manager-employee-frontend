import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EmployeeDetailsService } from './employee-details.service';
import { EmployeeDetails } from './employee-details.model';

@Component({
  selector: 'app-employee-details-page',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-details.page.html',
  styleUrls: ['./employee-details.page.scss']
})
export class EmployeeDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EmployeeDetailsService);

  readonly employee = signal<EmployeeDetails | null>(null);
  readonly loading = signal(true);

  readonly id = computed(() => this.route.snapshot.paramMap.get('id'));

  constructor() {
    effect(() => {
      const id = this.id();
      if (!id) return;

      this.loading.set(true);

      this.service.getById(id).subscribe({
        next: data => {
          this.employee.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.employee.set(null);
          this.loading.set(false);
        }
      });
    });
  }
}
