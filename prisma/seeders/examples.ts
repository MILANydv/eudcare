/**
 * Authentication Seeder Examples
 * 
 * This file demonstrates how to use the authentication seeder system
 * in various scenarios including tests, development setup, and seeding data.
 */

import { seedSuperAdmin, seedSchoolAdmin, seedStudent, seedTeacher, seedStaff, seedParent, utils } from './factory';
import { PrismaClient } from '@prisma/client';
import type { AuthSeederResult } from './types';

const prisma = new PrismaClient();

type SeededRecord = AuthSeederResult & {
profile: { id: string }
};

// ============================================================================
// EXAMPLE 1: Seeding a Complete School Environment
// ============================================================================

export async function seedCompleteSchoolExample() {
  // First, ensure you have a school and academic year created
  // This is just an example - adjust based on your actual data structure
  
  const school = await prisma.school.findFirst();
  if (!school) {
    throw new Error('No school found. Please create a school first.');
  }

  const academicYear = await prisma.academicYear.findFirst({
    where: { schoolId: school.id, isCurrent: true }
  });

  if (!academicYear) {
    throw new Error('No current academic year found. Please create one first.');
  }

  const createdData: {
    school: unknown;
    schoolAdmin: unknown;
    teachers: SeededRecord[];
    students: SeededRecord[];
    staff: SeededRecord[];
    parents: SeededRecord[];
  } = {
    school: null,
    schoolAdmin: null,
    teachers: [],
    students: [],
    staff: [],
    parents: [],
  };

  try {
    // Create School Admin
    createdData.schoolAdmin = await seedSchoolAdmin({
      email: `admin.${Date.now()}@${school.slug}.com`,
      password: 'SchoolAdmin2024!',
      name: 'School Administrator',
      schoolId: school.id,
    });
    console.log('✅ School Admin created');

    // Create Teachers
    for (let i = 1; i <= 3; i++) {
      const teacher = await seedTeacher({
        userEmail: `teacher.${i}.${Date.now()}@school.com`,
        userPassword: 'Teacher2024!',
        userName: `Teacher ${i}`,
        schoolId: school.id,
        employeeId: `T${Date.now()}_${i}`,
        phone: `+123456789${i}`,
        joiningDate: new Date(),
        qualification: 'B.Ed',
        designation: 'Class Teacher',
      });
      createdData.teachers.push(teacher);
      console.log(`✅ Teacher ${i} created`);
    }

    // Get available classes for students
    const classes = await prisma.class.findMany({ 
      where: { schoolId: school.id },
      take: 2 
    });

    // Create Students
    for (let i = 1; i <= 5; i++) {
      const studentClass = classes[i % classes.length];
      const sections = await prisma.section.findMany({ 
        where: { classId: studentClass.id },
        take: 1 
      });
      
      const student = await seedStudent({
        userEmail: `student.${i}.${Date.now()}@school.com`,
        userPassword: 'Student2024!',
        userName: `Student ${i}`,
        schoolId: school.id,
        admissionNo: `S${Date.now()}_${i}`,
        classId: studentClass.id,
        sectionId: sections[0]?.id || null,
        dateOfBirth: new Date('2010-01-01'),
        gender: i % 2 === 0 ? 'Female' : 'Male',
        bloodGroup: 'O+',
      });
      createdData.students.push(student);
      console.log(`✅ Student ${i} created`);
    }

    // Create Staff
    for (let i = 1; i <= 2; i++) {
      const staff = await seedStaff({
        userEmail: `staff.${i}.${Date.now()}@school.com`,
        userPassword: 'Staff2024!',
        userName: `Staff ${i}`,
        schoolId: school.id,
        employeeId: `ST${Date.now()}_${i}`,
        phone: `+987654321${i}`,
        designation: i === 1 ? 'Librarian' : 'Accountant',
        joiningDate: new Date(),
      });
      createdData.staff.push(staff);
      console.log(`✅ Staff ${i} created`);
    }

    // Create Parents and link to first 3 students
    for (let i = 1; i <= 3; i++) {
      const parent = await seedParent({
        userEmail: `parent.${i}.${Date.now()}@school.com`,
        userPassword: 'Parent2024!',
        userName: `Parent ${i}`,
        schoolId: school.id,
        phone: `+11223344${i}`,
        occupation: 'Engineer',
      });
      createdData.parents.push(parent);
      console.log(`✅ Parent ${i} created`);
      
      // Link parent to student
      if (createdData.students[i - 1]) {
        await prisma.studentParent.create({
          data: {
            studentId: createdData.students[i - 1].profile.id,
            parentId: parent.profile.id,
            relationship: i === 1 ? 'Father' : i === 2 ? 'Mother' : 'Guardian',
            isPrimary: true,
          },
        });
        console.log(`✅ Linked Parent ${i} to Student ${i}`);
      }
    }

    createdData.school = school;
    return createdData;

  } catch (error) {
    console.error('❌ School seeding failed:', error);
    throw error;
  }
}

// ============================================================================
// EXAMPLE 2: Development Environment Setup
// ============================================================================

export async function seedDevelopmentEnvironment() {
  console.log('🌱 Seeding development environment...');

  // Check if we already have a super admin
  const existingSuperAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' }
  });

  if (!existingSuperAdmin) {
    await seedSuperAdmin({
      email: 'super.admin@dev.schoolms.local',
      password: 'dev-super-admin-2024',
      name: 'Development Super Admin',
    });
    console.log('✅ Development Super Admin created');
  } else {
    console.log('⚠️  Super Admin already exists, skipping...');
  }

  // Check if we have schools
  const schools = await prisma.school.findMany();
  if (schools.length === 0) {
    console.log('📢 No schools found. Create a school first to seed school-specific users.');
    return;
  }

  // Seed a test school with basic users
  const testSchool = schools[0];
  console.log(`🏫 Seeding test data for school: ${testSchool.name}`);

  // Create a test school admin
  const schoolAdminResult = await seedSchoolAdmin({
    email: `test.admin@${testSchool.slug}.local`,
    password: 'test-school-admin-2024',
    name: 'Test School Admin',
    schoolId: testSchool.id,
  });
  console.log('✅ Test School Admin created');

  // Create a test teacher
  const testTeacherResult = await seedTeacher({
    userEmail: `test.teacher.${Date.now()}@${testSchool.slug}.local`,
    userPassword: 'test-teacher-2024',
    userName: 'Test Teacher',
    schoolId: testSchool.id,
    employeeId: `TEST_TEACHER_${Date.now()}`,
    phone: '+1234567890',
    joiningDate: new Date(),
  });
  console.log('✅ Test Teacher created');

  // Create a test student
  const testStudentResult = await seedStudent({
    userEmail: `test.student.${Date.now()}@${testSchool.slug}.local`,
    userPassword: 'test-student-2024',
    userName: 'Test Student',
    schoolId: testSchool.id,
    admissionNo: `TEST_STUDENT_${Date.now()}`,
    classId: (await prisma.class.findFirst({ where: { schoolId: testSchool.id } }))?.id || '',
    dateOfBirth: new Date('2008-01-01'),
    gender: 'Male',
  });
  console.log('✅ Test Student created');

  console.log('✨ Development environment seeded successfully!');
  return { schoolAdminResult, testTeacherResult, testStudentResult };
}

// ============================================================================
// EXAMPLE 3: Testing Utilities
// ============================================================================

export class AuthSeederTestUtils {
  private static testCounter = 0;

  static async createTestUser(role: string, schoolId?: string) {
    const timestamp = Date.now();
    this.testCounter++;

    switch (role) {
      case 'SUPER_ADMIN':
        return seedSuperAdmin({
          email: `test.superadmin.${timestamp}@test.com`,
          password: 'TestPassword123!',
          name: `Test Super Admin ${this.testCounter}`,
        });

      case 'SCHOOL_ADMIN':
        if (!schoolId) throw new Error('School ID required for school admin');
        return seedSchoolAdmin({
          email: `test.admin.${timestamp}@test.com`,
          password: 'TestPassword123!',
          name: `Test School Admin ${this.testCounter}`,
          schoolId,
        });

      case 'TEACHER':
        if (!schoolId) throw new Error('School ID required for teacher');
        return seedTeacher({
          userEmail: `test.teacher.${timestamp}@test.com`,
          userPassword: 'TestPassword123!',
          userName: `Test Teacher ${this.testCounter}`,
          schoolId,
          employeeId: `TEST_TEACHER_${timestamp}_${this.testCounter}`,
          phone: '+1234567890',
          joiningDate: new Date(),
        });

      case 'STUDENT':
        if (!schoolId) throw new Error('School ID required for student');
        const studentClass = await prisma.class.findFirst({ where: { schoolId } });
        if (!studentClass) throw new Error('No class found for school');
        
        return seedStudent({
          userEmail: `test.student.${timestamp}@test.com`,
          userPassword: 'TestPassword123!',
          userName: `Test Student ${this.testCounter}`,
          schoolId,
          admissionNo: `TEST_STUDENT_${timestamp}_${this.testCounter}`,
          classId: studentClass.id,
          dateOfBirth: new Date('2010-01-01'),
          gender: 'Male',
        });

      case 'STAFF':
        if (!schoolId) throw new Error('School ID required for staff');
        return seedStaff({
          userEmail: `test.staff.${timestamp}@test.com`,
          userPassword: 'TestPassword123!',
          userName: `Test Staff ${this.testCounter}`,
          schoolId,
          employeeId: `TEST_STAFF_${timestamp}_${this.testCounter}`,
          phone: '+1234567890',
          designation: 'Test Staff',
          joiningDate: new Date(),
        });

      case 'PARENT':
        if (!schoolId) throw new Error('School ID required for parent');
        return seedParent({
          userEmail: `test.parent.${timestamp}@test.com`,
          userPassword: 'TestPassword123!',
          userName: `Test Parent ${this.testCounter}`,
          schoolId,
          phone: '+1234567890',
          occupation: 'Test Occupation',
        });

      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  static async cleanupTestUsers() {
    // Delete test users created during the session
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@test.com'
        }
      }
    });
  }

  static generateSecurePassword(length: number = 16): string {
    return utils.generatePassword(length);
  }
}

// ============================================================================
// EXAMPLE 4: Individual Component Testing
// ============================================================================

export async function testIndividualSeeders() {
  console.log('🔬 Testing individual seeders...');

  // Test password utilities
  const plainPassword = 'TestPassword123!';
  const hashedPassword = await utils.hashPassword(plainPassword);
  const isValid = await utils.comparePassword(plainPassword, hashedPassword);
  console.log(`✅ Password hashing test: ${isValid ? 'PASS' : 'FAIL'}`);

  // Test random password generation
  const randomPass = utils.generatePassword(20);
  console.log(`✅ Random password generated: ${randomPass.length} characters`);

  // Create a test super admin
  const superAdmin = await seedSuperAdmin({
    email: `test.superadmin.${Date.now()}@example.com`,
    password: 'TestSuperAdmin2024!',
    name: 'Test Super Admin',
  });
  console.log(`✅ Super Admin created: ${superAdmin.user.email}`);

  // Clean up
  await prisma.user.deleteMany({
    where: { email: { contains: '@testseed.com' } }
  });

  console.log('🧪 All tests completed!');
}

// Run examples if called directly
if (require.main === module) {
  (async () => {
    try {
      const args = process.argv.slice(2);
      const exampleType = args[0];

      switch (exampleType) {
        case 'complete-school':
          await seedCompleteSchoolExample();
          break;
        case 'dev-environment':
          await seedDevelopmentEnvironment();
          break;
        case 'test-seeders':
          await testIndividualSeeders();
          break;
        case 'test-utils':
          const testSchool = await prisma.school.findFirst();
          if (testSchool) {
            await AuthSeederTestUtils.createTestUser('TEACHER', testSchool.id);
            console.log('✅ Test user created using test utils');
          }
          break;
        default:
          console.log('Usage: ts-node examples.ts [complete-school|dev-environment|test-seeders|test-utils]');
          console.log('Running default: test-seeders');
          await testIndividualSeeders();
      }
    } catch (error) {
      console.error('❌ Example execution failed:', error);
      process.exit(1);
    } finally {
      await prisma.$disconnect();
    }
  })();
}

export { utils } from './factory';
