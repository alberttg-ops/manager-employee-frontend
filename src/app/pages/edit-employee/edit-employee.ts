import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.html',
  styleUrl: './edit-employee.scss',
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditEmployeeComponent implements OnInit {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  employeeId!: string;
  loading = false;

  /* =================================================
     FORM — EXACT STRUCTURE MATCHES ADD-EMPLOYEE
     ================================================= */
  form = this.fb.nonNullable.group({
    username: [{ value: '', disabled: true }],

    first_name: [''],
    last_name: [''],
    full_name: [''],
    phone: [''],
    date_of_birth: [''],
    gender: ['male'],

    address: this.fb.nonNullable.group({
      street: [''],
      city: [''],
      state: [''],
      country: ['India'],
      postalCode: ['']
    }),

    employment: this.fb.nonNullable.group({
      role: [''],
      status: ['active'],
      department: [''],
      joiningDate: ['']
    }),

    salary: this.fb.nonNullable.group({
      base: [0],
      currency: ['INR']
    }),

    emergency_contact: this.fb.nonNullable.group({
      name: [''],
      phone: ['']
    }),

    skills: [[] as string[]]
  });

  /* =================================================
     INIT
     ================================================= */
  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id')!;
    this.loadEmployee();
  }

  /* =================================================
     LOAD EMPLOYEE (GET)
     ================================================= */
  loadEmployee() {
    this.loading = true;

    this.http
      .get<any>(`http://localhost:5000/api/get/employee/${this.employeeId}`)
      .subscribe({
        next: emp => {
          this.form.patchValue({
            username: emp.username ?? emp.email ?? '',

            first_name: emp.first_name ?? '',
            last_name: emp.last_name ?? '',
            full_name: emp.full_name ?? '',
            phone: emp.phone ?? '',
            date_of_birth: emp.date_of_birth ?? '',
            gender: emp.gender ?? 'male',

            address: emp.address ?? {},
            employment: emp.employment ?? {},
            salary: emp.salary ?? {},
            emergency_contact: emp.emergency_contact ?? {},

            skills: emp.skills ?? []
          });

          this.loading = false;
        },
        error: err => {
          console.error('GET EMPLOYEE FAILED', err);
          this.loading = false;
        }
      });
  }

  /* =================================================
     SKILLS (string[] — same as AddEmployee)
     ================================================= */
  get skills(): string[] {
    return this.form.controls.skills.value;
  }

  addSkill(skill: string) {
    if (!skill.trim()) return;
    this.form.controls.skills.setValue([...this.skills, skill.trim()]);
  }

  removeSkill(index: number) {
    const updated = [...this.skills];
    updated.splice(index, 1);
    this.form.controls.skills.setValue(updated);
  }

  /* =================================================
     CLEAR FORM (KEEP USERNAME)
     ================================================= */
  clearAll() {
    const username = this.form.getRawValue().username;

    this.form.reset({
      username,
      first_name: '',
      last_name: '',
      full_name: '',
      phone: '',
      date_of_birth: '',
      gender: 'male',

      address: {
        street: '',
        city: '',
        state: '',
        country: 'India',
        postalCode: ''
      },

      employment: {
        role: '',
        status: 'active',
        department: '',
        joiningDate: ''
      },

      salary: {
        base: 0,
        currency: 'INR'
      },

      emergency_contact: {
        name: '',
        phone: ''
      },

      skills: []
    });

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  /* =================================================
     UPDATE EMPLOYEE (PATCH)
     INFER email = username (same as AddEmployee)
     ================================================= */
  submit() {
    if (this.form.invalid) return;

    const raw = this.form.getRawValue();

    const payload = {
      ...raw,
      email: raw.username   // inference rule from AddEmployee
    };

    delete (payload as any).username;

     this.http
    .put(
      `http://localhost:5000/api/update/employee/${this.employeeId}`,
      payload
    )
    .subscribe({
      next: () => window.alert('UPDATE SUCCESS'),
      error: err => console.error('UPDATE FAILED', err)
    });
  }
}
