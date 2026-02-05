import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface EmployeeListItem {
  id: string;
  full_name: string;
}

@Component({
  selector: 'app-employee',
  imports: [RouterLink],
  templateUrl: './employee.page.html',
  styleUrls: ['./employee.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesListPage {
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
    deleteEmployee(employeeId: string) {
  if (!confirm('Are you sure you want to delete this employee?')) {
    return;
  }

  this.http
    .delete(`http://localhost:5000/api/delete/employee/${employeeId}`)
    .subscribe({
      next: () => {
        alert('Employee deleted');
        // remove locally so UI updates immediately
        this.employees.update(list =>
          list.filter(e => e.id !== employeeId)
        );
      },
      error: err => {
        console.error('Delete failed', err);
        alert('Delete failed');
      }
    });
}

}

