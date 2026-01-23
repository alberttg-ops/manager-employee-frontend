import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EmployeeDetails } from './employee-details.model';

@Injectable({ providedIn: 'root' })
export class EmployeeDetailsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5000/api/get/employee';

  getById(id: string) {
  return this.http.get<EmployeeDetails>(
    `http://localhost:5000/api/get/employee/${encodeURIComponent(id)}`
  );
}

}
