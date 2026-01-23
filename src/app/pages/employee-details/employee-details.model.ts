export interface EmployeeDetails {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';

  address: {
    city: string;
    state: string;
    street: string;
    country: string;
    postalCode: string;
  };

  employment: {
    role: string;
    status: 'active' | 'inactive';
    department: string;
    joiningDate: string;
  };

  salary: {
    base: number;
    currency: string;
  };

  emergency_contact: {
    name: string;
    phone: string;
  };

  skills: string[];
  performance_rating: string;

  created_at: string;
  updated_at: string;

  department_incharge: string | null;
  team_member_ids: string[] | null;
}
