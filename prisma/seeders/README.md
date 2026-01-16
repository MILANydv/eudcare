# Authentication Seeder System

A modular, type-safe, and robust authentication seeder system for the School Management System built with Next.js, TypeScript, and Prisma.

## Overview

This seeder system provides a clean and professional way to seed authentication data including users with different roles (Super Admin, School Admin, Teachers, Students, Staff, Parents) and their respective profiles.

## Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Secure**: Uses bcrypt for password hashing (12 salt rounds)
- **Robust Error Handling**: Comprehensive error handling and validation
- **Database Integrity**: Uses Prisma transactions for data consistency
- **Professional Code**: Follows best practices and coding standards

## Directory Structure

```
prisma/seeders/
├── types.ts              # Type definitions and interfaces
├── factory.ts            # Main factory and exports
├── index.ts              # Main seeder entry point
├── examples.ts           # Usage examples and test utilities
├── modules/
│   └── auth.seeder.ts    # Core authentication seeding logic
└── utils/
    └── password.ts       # Password hashing utilities
```

## Usage

### Quick Start

Run the basic seeder:

```bash
# Install dependencies
npm install

# Run main seeder
npm run seed

# Run development environment seeder
npm run seed:dev

# Run test seeders
npm run seed:test
```

### Seeding Functions

#### Create a Super Admin

```typescript
import { seedSuperAdmin } from './prisma/seeders/factory';

const result = await seedSuperAdmin({
  email: 'super.admin@example.com',
  password: 'SecurePassword123!',
  name: 'Super Administrator'
});

console.log(result.user); // Created user
```

#### Create a School Admin

```typescript
import { seedSchoolAdmin } from './prisma/seeders/factory';

const result = await seedSchoolAdmin({
  email: 'admin@school1.example.com',
  password: 'SecurePassword123!',
  name: 'School Admin',
  schoolId: 'school_12345' // Required
});

console.log(result.user); // Created user
```

#### Create a Teacher with Profile

```typescript
import { seedTeacher } from './prisma/seeders/factory';

const result = await seedTeacher({
  userEmail: 'teacher@example.com',
  userPassword: 'SecurePassword123!',
  userName: 'John Doe',
  schoolId: 'school_12345',
  employeeId: 'T001',
  phone: '+1234567890',
  joiningDate: new Date(),
  qualification: 'B.Ed',
  designation: 'Senior Teacher'
});

console.log(result.user);     // Created user account
console.log(result.profile);  // Created teacher profile
```

#### Create a Student with Profile

```typescript
import { seedStudent } from './prisma/seeders/factory';

const result = await seedStudent({
  userEmail: 'student@example.com',
  userPassword: 'SecurePassword123!',
  userName: 'Jane Smith',
  schoolId: 'school_12345',
  classId: 'class_001',
  sectionId: 'section_A',
  admissionNo: 'STU001',
  dateOfBirth: new Date('2010-01-01'),
  gender: 'Female'
});

console.log(result.user);     // Created user account
console.log(result.profile);  // Created student profile
```

#### Create Staff with Profile

```typescript
import { seedStaff } from './prisma/seeders/factory';

const result = await seedStaff({
  userEmail: 'staff@example.com',
  userPassword: 'SecurePassword123!',
  userName: 'Mike Johnson',
  schoolId: 'school_12345',
  employeeId: 'S001',
  phone: '+9876543210',
  designation: 'Librarian',
  joiningDate: new Date()
});

console.log(result.user);     // Created user account
console.log(result.profile);  // Created staff profile
```

#### Create a Parent with Profile

```typescript
import { seedParent } from './prisma/seeders/factory';

const result = await seedParent({
  userEmail: 'parent@example.com',
  userPassword: 'SecurePassword123!',
  userName: 'Sarah Williams',
  schoolId: 'school_12345',
  phone: '+1122334455',
  occupation: 'Doctor'
});

console.log(result.user);     // Created user account
console.log(result.profile);  // Created parent profile
```

### Password Utilities

The seeder includes secure password handling utilities:

```typescript
import { utils } from './prisma/seeders/factory';

// Hash a password
const hashedPassword = await utils.hashPassword('mySecretPassword', 12);

// Compare passwords
const isValid = await utils.comparePassword('mySecretPassword', hashedPassword);

// Generate a random password
const randomPassword = utils.generatePassword(16); // 16 characters
```

### Test Utilities

For testing scenarios, use the provided test utilities:

```typescript
import { AuthSeederTestUtils } from './prisma/seeders/examples';

// Create a test user for any role
const testTeacher = await AuthSeederTestUtils.createTestUser('TEACHER', schoolId);
const testStudent = await AuthSeederTestUtils.createTestUser('STUDENT', schoolId);

// Cleanup test users
await AuthSeederTestUtils.cleanupTestUsers();

// Get a secure test password
const testPassword = AuthSeederTestUtils.generateSecurePassword();
```

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt with 12 salt rounds
2. **Unique Emails**: Built-in validation prevents duplicate email addresses
3. **Clean Data**: Test utilities help clean up test data after use
4. **Environment Variables**: Use environment variables for sensitive data in production

## API Reference

### Types

- `CreateUserData` - Base user creation data
- `CreateStudentData` - Student-specific data
- `CreateTeacherData` - Teacher-specific data
- `CreateParentData` - Parent-specific data
- `CreateStaffData` - Staff-specific data
- `CreateSchoolAdminData` - School admin-specific data
- `AuthSeederResult` - Result from seeding operations

### Functions

#### `createAuthSeed(userData, options?)`
Creates a basic user account with authentication

#### `seedSuperAdmin(data)`
Creates a super admin user

#### `seedSchoolAdmin(data)`
Creates a school admin user (requires schoolId)

#### `seedStudent(data)`
Creates a student with user account and profile

#### `seedTeacher(data)`
Creates a teacher with user account and profile

#### `seedStaff(data)`
Creates a staff member with user account and profile

#### `seedParent(data)`
Creates a parent with user account and profile

## Examples

See `examples.ts` for comprehensive examples including:

- Complete school seeding
- Development environment setup
- Testing utilities
- Individual component testing

Run examples with:

```bash
# Complete school example
npm run seed:dev

# Test seeders
npm run seed:test

# Specific example
ts-node prisma/seeders/examples.ts complete-school
```

## Best Practices

1. **Always use the factory functions** instead of direct Prisma operations
2. **Handle errors properly** with try-catch blocks
3. **Use test utilities** for testing scenarios to ensure cleanup
4. **Validate school existence** before creating school-specific users
5. **Use strong passwords** and consider generating them with `utils.generatePassword()`
6. **Clean up test data** after testing to avoid database pollution

## Troubleshooting

### Common Issues

**"User with email X already exists"**
- Emails must be unique across the entire system
- Use timestamps or unique identifiers in test emails

**"No school found"**
- School-specific users require an existing school
- Create a school first or use super admin seeders

**"Password hashing failed"**
- Ensure bcryptjs is properly installed
- Check Node.js version compatibility

**Database connection errors**
- Verify database is running
- Check DATABASE_URL environment variable
- Run `npx prisma generate` if schema changed

## Contributing

When adding new seeding functions:

1. Add types to `types.ts`
2. Implement in `modules/auth.seeder.ts`
3. Export from `factory.ts`
4. Add tests and examples
5. Update this documentation

## License

MIT
