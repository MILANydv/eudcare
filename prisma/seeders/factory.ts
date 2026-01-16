/**
 * Authentication Seeder Factory
 * 
 * This module provides a clean, unified interface for seeding authentication data.
 * Use these functions to create users with their respective profiles in the database.
 * 
 * @example
 * // Seed a student
 * const result = await seedStudent({
 *   userEmail: "student@example.com",
 *   userPassword: "SecurePass123!",
 *   userName: "John Doe",
 *   schoolId: "school_123",
 *   admissionNo: "A001",
 *   classId: "class_001",
 *   dateOfBirth: new Date("2010-01-01"),
 *   gender: "Male"
 * });
 * 
 * @example
 * // Seed a teacher
 * const result = await seedTeacher({
 *   userEmail: "teacher@example.com",
 *   userPassword: "SecurePass123!",
 *   userName: "Jane Smith",
 *   schoolId: "school_123",
 *   employeeId: "T001",
 *   phone: "+1234567890",
 *   joiningDate: new Date()
 * });
 */

import {
  createAuthSeed as _createAuthSeed,
  seedSuperAdmin as _seedSuperAdmin,
  seedSchoolAdmin as _seedSchoolAdmin,
  seedStudent as _seedStudent,
  seedTeacher as _seedTeacher,
  seedStaff as _seedStaff,
  seedParent as _seedParent,
} from './modules/auth.seeder';

import { hashPassword, comparePassword, generatePassword } from './utils/password';

import type {
  CreateUserData,
  CreateStudentData,
  CreateTeacherData,
  CreateParentData,
  CreateStaffData,
  CreateSchoolAdminData,
  CreateAuthSeedOptions,
  AuthSeederResult,
} from './types';

// Re-export all seeder functions with clean naming
export const createAuthSeed = _createAuthSeed;
export const seedSuperAdmin = _seedSuperAdmin;
export const seedSchoolAdmin = _seedSchoolAdmin;
export const seedStudent = _seedStudent;
export const seedTeacher = _seedTeacher;
export const seedStaff = _seedStaff;
export const seedParent = _seedParent;

// Re-export utility functions
export const utils = {
  hashPassword,
  comparePassword,
  generatePassword,
};

// Re-export all types
export type {
  CreateUserData,
  CreateStudentData,
  CreateTeacherData,
  CreateParentData,
  CreateStaffData,
  CreateSchoolAdminData,
  CreateAuthSeedOptions,
  AuthSeederResult,
};

// Default export for convenience
export default {
  createAuthSeed,
  seedSuperAdmin,
  seedSchoolAdmin,
  seedStudent,
  seedTeacher,
  seedStaff,
  seedParent,
  utils,
};
