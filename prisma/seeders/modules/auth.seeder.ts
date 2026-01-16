import { prisma } from '../../../lib/prisma';
import { hashPassword } from '../utils/password';
import type { CreateUserData, CreateStudentData, CreateTeacherData, CreateParentData, CreateStaffData, CreateSchoolAdminData, CreateAuthSeedOptions, AuthSeederResult } from '../types';

/**
 * Creates a basic user for authentication
 */
export async function createAuthSeed(userData: CreateUserData, options: CreateAuthSeedOptions = {}): Promise<AuthSeederResult> {
  try {
    const { skipHash = false } = options;
    const hashedPassword = skipHash ? userData.password : await hashPassword(userData.password);

    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        name: userData.name.trim(),
        role: userData.role,
        schoolId: userData.schoolId,
        isActive: userData.isActive ?? true,
      },
    });

    return { user };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint failed on the fields: (`email`)')) {
        throw new Error(`User with email ${userData.email} already exists`);
      }
    }
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a student with both User account and Student profile
 */
export async function seedStudent(data: CreateStudentData): Promise<AuthSeederResult> {
  try {
    // Create the user account first
    const { user } = await createAuthSeed({
      email: data.userEmail,
      password: data.userPassword,
      name: data.userName,
      role: 'STUDENT',
      schoolId: data.schoolId,
    });

    // Create the student profile
    const profile = await prisma.student.create({
      data: {
        userId: user.id,
        schoolId: data.schoolId,
        admissionNo: data.admissionNo,
        rollNo: data.rollNo ?? null,
        classId: data.classId,
        sectionId: data.sectionId ?? null,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        bloodGroup: data.bloodGroup ?? null,
        address: data.address ?? null,
        photo: data.photo ?? null,
        isActive: data.isActive ?? true,
      },
    });

    return { user, profile };
  } catch (error) {
    throw new Error(`Failed to seed student: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a teacher with both User account and Teacher profile
 */
export async function seedTeacher(data: CreateTeacherData): Promise<AuthSeederResult> {
  try {
    // Create the user account first
    const { user } = await createAuthSeed({
      email: data.userEmail,
      password: data.userPassword,
      name: data.userName,
      role: 'TEACHER',
      schoolId: data.schoolId,
    });

    // Create the teacher profile
    const profile = await prisma.teacher.create({
      data: {
        userId: user.id,
        schoolId: data.schoolId,
        employeeId: data.employeeId,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        phone: data.phone,
        address: data.address,
        photo: data.photo,
        qualification: data.qualification,
        designation: data.designation,
        joiningDate: new Date(data.joiningDate),
      },
    });

    return { user, profile };
  } catch (error) {
    throw new Error(`Failed to seed teacher: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a staff member with both User account and Staff profile
 */
export async function seedStaff(data: CreateStaffData): Promise<AuthSeederResult> {
  try {
    // Create the user account first
    const { user } = await createAuthSeed({
      email: data.userEmail,
      password: data.userPassword,
      name: data.userName,
      role: 'STAFF',
      schoolId: data.schoolId,
    });

    // Create the staff profile
    const profile = await prisma.staff.create({
      data: {
        userId: user.id,
        schoolId: data.schoolId,
        employeeId: data.employeeId,
        phone: data.phone,
        designation: data.designation,
        joiningDate: new Date(data.joiningDate),
      },
    });

    return { user, profile };
  } catch (error) {
    throw new Error(`Failed to seed staff: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a parent with both User account and Parent profile
 */
export async function seedParent(data: CreateParentData): Promise<AuthSeederResult> {
  try {
    // Create the user account first
    const { user } = await createAuthSeed({
      email: data.userEmail,
      password: data.userPassword,
      name: data.userName,
      role: 'PARENT',
      schoolId: data.schoolId,
    });

    // Create the parent profile
    const profile = await prisma.parent.create({
      data: {
        userId: user.id,
        phone: data.phone,
        occupation: data.occupation,
      },
    });

    return { user, profile };
  } catch (error) {
    throw new Error(`Failed to seed parent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Creates a super admin user
 */
export async function seedSuperAdmin(data: Omit<CreateUserData, 'role' | 'schoolId'>): Promise<AuthSeederResult> {
  return createAuthSeed({
    ...data,
    role: 'SUPER_ADMIN',
    schoolId: undefined,
  });
}

/**
 * Creates a school admin user
 */
export async function seedSchoolAdmin(data: CreateSchoolAdminData): Promise<AuthSeederResult> {
  return createAuthSeed({
    ...data,
    role: 'SCHOOL_ADMIN',
    schoolId: data.schoolId,
  });
}
