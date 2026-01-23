import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-employee',
  templateUrl: './add-employee.html',
  imports: [CommonModule, ReactiveFormsModule],
  styleUrl: './add-employee.scss',
})




export class AddEmployeePage {

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private resetForm() {
  this.form.reset({
    username: '',
    first_name: '',
    last_name: '',
    full_name: '',
    phone: '',
    date_of_birth: '',
    gender: '',

    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: ''
    },

    employment: {
      role: '',
      department: '',
      joiningDate: ''
    },

    salary: {
      base: 0,
      currency: ''
    },

    emergency_contact: {
      name: '',
      phone: ''
    },

    skills: ['']
  });

  // Ensure pristine state
  this.form.markAsPristine();
  this.form.markAsUntouched();
}

  form = this.fb.nonNullable.group({
    username: [''],

    first_name: [''],
    last_name: [''],
    full_name: [''],
    email: [''],
    phone: [''],
    date_of_birth: [''],
    gender: ['male'],

    address: this.fb.nonNullable.group({
      city: [''],
      state: [''],
      street: [''],
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

  // submit() {
  //   const { username, ...payload } = this.form.getRawValue();

  //   this.http.post(
  //     `http://localhost:5000/api/post/employee/${username}`,
  //     payload
  //   ).subscribe();
  // }

  submit() {
  console.log('SUBMIT FIRED');

  const { username, ...payload } = this.form.getRawValue();
  payload.email = username;
  

  console.log('USERNAME:', username);
  console.log('PAYLOAD:', payload);

  this.http.post(
    `http://localhost:5000/api/post/employee/${username}`,
    payload
  ).subscribe({
    next: res => {window.alert('SUCCESS' + res)
      this.resetForm()
    },
    error: err => console.error('ERROR', err)
  });
}


}
