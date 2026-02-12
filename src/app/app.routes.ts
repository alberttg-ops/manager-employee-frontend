import { Routes } from '@angular/router';
import {AuthGatePage} from "../app/pages/auth-gate/auth-gate.page"
import {CallbackPage} from "../app/pages/callback/callback.page"
import {AuthGuard} from "../app/auth/auth-guard"
import {EmployeesListPage} from "./pages/employee/employee.page"
import {EmployeeDetailsPage} from "../app/pages/employee-details/employee-details.page"
import {AppShellComponent} from "./shell/app-shell/app-shell.component"
import {AddEmployeePage} from "./pages/add-employee/add-employee"
import {EditEmployeeComponent} from "./pages/edit-employee/edit-employee"
import {ChatPageComponent} from "./components/chat/chat-page.component"
import {ContactListPage} from "./pages/contact-list/contact-list.page"

export const routes: Routes = [
  {
    path: 'callback',
    component: CallbackPage
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EmployeeDetailsPage
      },
      {
        path: 'employees',
        component: EmployeesListPage
      },
      {
        path: 'employees/:id',
        component: EmployeeDetailsPage
      },
      {
        path:'add-employee',
        component:AddEmployeePage
      },
      {
        path:'edit-employee/:id',
        component:EditEmployeeComponent
      },
      {
        path:'chat/:id',
        component:ChatPageComponent 
      },
      {
        path:'contact-list',
        component:ContactListPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
