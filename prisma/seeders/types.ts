import type { User, Student, Teacher, Parent, Staff } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role: 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT' | 'STAFF';
  schoolId?: string;
  isActive?: boolean;
}

export interface CreateStudentData {
  userEmail: string;
  userPassword: string;
  userName: string;
  schoolId: string;
  admissionNo: string;
  classId: string;
  dateOfBirth: Date;
  gender: string;
  // Optional fields
  rollNo?: string | null;
  sectionId?: string | null;
  bloodGroup?: string | null;
  address?: string | null;
  photo?: string | null;
  isActive?: boolean | null;
}

export interface CreateTeacherData {
  userEmail: string;
  userPassword: string;
  userName: string;
  schoolId: string;
  employeeId: string;
  phone: string;
  joiningDate: Date;
  // Optional fields
  dateOfBirth?: Date | null;
  gender?: string | null;
  address?: string | null;
  photo?: string | null;
  qualification?: string | null;
  designation?: string | null;
  isActive?: boolean | null;
}

export interface CreateParentData {
  userEmail: string;
  userPassword: string;
  userName: string;
  phone: string;
  // Optional fields
  schoolId?: string | null;
  occupation?: string | null;
}

export interface CreateStaffData {
  userEmail: string;
  userPassword: string;
  userName: string;
  schoolId: string;
  employeeId: string;
  phone: string;
  designation: string;
  joiningDate: Date;
  // Optional fields
  isActive?: boolean | null;
}

export interface CreateSchoolAdminData extends Omit<CreateUserData, 'role'> {
  schoolId: string;
}

export interface AuthSeederResult {
  user: User;
  profile?: Student | Teacher | Parent | Staff;
}

export interface CreateAuthSeedOptions {
  skipHash?: boolean;
}
