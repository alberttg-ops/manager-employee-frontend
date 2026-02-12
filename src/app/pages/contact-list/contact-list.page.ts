import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface EmployeeListItem {
  id: string;
  full_name: string;
}

@Component({
  selector: 'contact-list',
  imports: [RouterLink],
  templateUrl: './contact-list.page.html',
  styleUrls: ['./contact-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactListPage {
  private readonly http = inject(HttpClient);

  readonly employees = signal<EmployeeListItem[]>([]);
  readonly loading = signal(true);

  constructor() {
    this.loadEmployees();
  }

  private loadEmployees(): void {
    this.http
      .get<EmployeeListItem[]>('http://localhost:5000/api/get/employees')
      .subscribe({
        next: (data) => {
          this.employees.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
   
}

