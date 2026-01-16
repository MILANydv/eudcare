# Authentication Seeder - Integration Guide

This document explains how to integrate the authentication seeder system into your existing Next.js School Management System.

## Prerequisites Checklist

Before using the seeder system, ensure the following:

- [ ] Prisma schema is up to date (`npx prisma db push`)
- [ ] Prisma Client is generated (`npx prisma generate`)
- [ ] Database is running and accessible
- [ ] `DATABASE_URL` environment variable is configured
- [ ] Dependencies are installed (`npm install`)

## Quick Integration Steps

### 1. Verify Database Connection

```bash
# Test the database connection
npx prisma db execute --stdin <<EOF
SELECT current_database();
EOF
```

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Run the Basic Seeder

```bash
# This creates a super admin user
npm run seed
```

### 4. Run Development Seeder (Optional)

```bash
# This seeds test data for development
npm run seed:dev
```

## Integration Points

### 1. NextAuth.js Integration

The seeder creates users with hashed passwords that work seamlessly with NextAuth.js:

```typescript
// @/app/api/auth/[...nextauth]/route.ts
import { comparePassword } from '@/prisma/seeders/utils/password';

const credentialsProvider = CredentialsProvider({
  name: 'credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { email: credentials.email }
    });

    if (!user || !user.isActive) {
      return null;
    }

    // Use the same password comparison as the seeder
    const isPasswordValid = await comparePassword(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      schoolId: user.schoolId
    };
  }
});
```

### 2. Using Seeders in API Routes

```typescript
// @/app/api/admin/seed-test-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { seedTeacher, seedStudent } from '@/prisma/seeders/factory';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const session = await auth();
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { schoolId, userType, count = 1 } = await request.json();

    if (!schoolId) {
      return NextResponse.json(
        { error: 'School ID is required' },
        { status: 400 }
      );
    }

    const createdUsers = [];

    for (let i = 0; i < count; i++) {
      const timestamp = Date.now();
      
      if (userType === 'TEACHER') {
        const result = await seedTeacher({
          userEmail: `seeded.teacher.${timestamp}@${schoolId}.com`,
          userPassword: 'ChangeMe123!',
          userName: `Seeded Teacher ${i + 1}`,
          schoolId,
          employeeId: `SEED_T_${timestamp}_${i}`,
          phone: `+123456789${i}`,
          joiningDate: new Date()
        });
        createdUsers.push(result);
      } else if (userType === 'STUDENT') {
        // Find a class for the student
        const studentClass = await prisma.class.findFirst({
          where: { schoolId }
        });

        if (studentClass) {
          const result = await seedStudent({
            userEmail: `seeded.student.${timestamp}@${schoolId}.com`,
            userPassword: 'ChangeMe123!',
            userName: `Seeded Student ${i + 1}`,
            schoolId,
            admissionNo: `SEED_S_${timestamp}_${i}`,
            classId: studentClass.id,
            dateOfBirth: new Date('2010-01-01'),
            gender: i % 2 === 0 ? 'Male' : 'Female'
          });
          createdUsers.push(result);
        }
      }
    }

    return NextResponse.json({
      success: true,
      createdUsers: createdUsers.map(u => ({
        id: u.user.id,
        email: u.user.email,
        name: u.user.name
      }))
    });

  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 3. In Tests (Jest/Vitest)

```typescript
// @/__tests__/auth/authentication.test.ts
import { seedTeacher, AuthSeederTestUtils } from '@/prisma/seeders';

describe('Authentication', () => {
  let testTeacher: any;

  beforeAll(async () => {
    // Create a test teacher
    testTeacher = await AuthSeederTestUtils.createTestUser('TEACHER', 'school_123');
  });

  afterAll(async () => {
    // Clean up
    await AuthSeederTestUtils.cleanupTestUsers();
  });

  test('should authenticate with correct credentials', async () => {
    const authResult = await authenticateUser({
      email: testTeacher.user.email,
      password: 'TestPassword123!' // Default test password
    });

    expect(authResult.success).toBe(true);
    expect(authResult.user.role).toBe('TEACHER');
  });
});
```

### 4. In Setup Scripts

```typescript
// @/scripts/setup-dev-environment.ts
import { seedSuperAdmin, seedDevelopmentEnvironment } from '@/prisma/seeders';

async function setupDevEnvironment() {
  console.log('🌱 Setting up development environment...');

  // Create super admin
  const superAdmin = await seedSuperAdmin({
    email: process.env.SUPER_ADMIN_EMAIL || 'dev.admin@schoolms.local',
    password: process.env.SUPER_ADMIN_PASSWORD || 'dev-super-admin-2024',
    name: 'Development Super Admin'
  });

  console.log(`
✨ Environment setup complete!

Credentials:
- Super Admin Email: ${superAdmin.user.email}
- Super Admin Password: ${process.env.SUPER_ADMIN_PASSWORD || 'dev-super-admin-2024'}

You can now log in to the application.
`);
}

setupDevEnvironment().catch(console.error);
```

## Database Constraints

The seeder respects the following database constraints:

1. **Unique Emails**: All user emails must be unique (case-insensitive)
2. **School Existence**: School-specific users require a valid `schoolId`
3. **Referential Integrity**: Profiles are linked to users via `userId`
4. **Role Validation**: Roles must be one of: `SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `PARENT`, `STAFF`

## Error Handling

The seeder includes comprehensive error handling:

```typescript
try {
  const result = await seedTeacher(teacherData);
  console.log(`Created teacher: ${result.user.email}`);
} catch (error) {
  if (error.message.includes('already exists')) {
    // Handle duplicate email
    console.error('Email already in use');
  } else if (error.message.includes('schoolId')) {
    // Handle invalid school reference
    console.error('Invalid school ID');
  } else {
    // Handle other errors
    console.error('Seeding failed:', error);
  }
}
```

## Security Best Practices

1. **Always use encrypted passwords** (handled automatically by the seeder)
2. **Use unique emails** for each seeded user
3. **Clean up test data** after testing
4. **Use environment variables** for sensitive data
5. **Avoid seeding production databases** with test data
6. **Implement proper authentication** in API routes using the seeded data

## Performance Considerations

- Password hashing uses 12 salt rounds (balanced security/performance)
- Use transactions for bulk operations
- Consider batching for large seeding operations
- Use `Promise.all()` for parallel creation of independent records

## Troubleshooting

### TypeScript Errors

If you encounter TypeScript errors:

```bash
# Ensure all types are properly imported
npx tsc --noEmit

# If using strict mode, ensure optional fields are handled
interface SeededUser {
  user?: User;
  profile?: Student | Teacher | Parent | Staff;
}
```

### Database Errors

Common database errors and solutions:

1. **Foreign key violation**: Ensure referenced schools/classes exist
2. **Unique constraint error**: Use unique emails/timestamps
3. **Connection error**: Verify DATABASE_URL and database status

## Common Seed Patterns

### Pattern 1: Idempotent Seeding

```typescript
// Run multiple times without duplicates
const existingUser = await prisma.user.findUnique({
  where: { email: 'admin@example.com' }
});

if (!existingUser) {
  await seedSuperAdmin({
    email: 'admin@example.com',
    password: 'password123',
    name: 'Admin'
  });
}
```

### Pattern 2: Bulk Seeding with Progress

```typescript
const teachers = teacherData.map((data, index) => ({
  ...data,
  userEmail: `teacher.${index}.${Date.now()}@school.com`
}));

console.log(`Seeding ${teachers.length} teachers...`);

for (let i = 0; i < teachers.length; i++) {
  try {
    await seedTeacher(teachers[i]);
    console.log(`Teacher ${i + 1}/${teachers.length} created`);
  } catch (error) {
    console.error(`Failed to create teacher ${i + 1}:`, error);
  }
}
```

### Pattern 3: Cleanup Before Seeding

```typescript
// Clean up existing test data
await prisma.user.deleteMany({
  where: {
    email: {
      contains: '@test.com'
    }
  }
});

// Now seed fresh data
await seedDevelopmentEnvironment();
```

## Next Steps

1. Run `npm run seed` to create your first super admin
2. Create a school through the UI or API
3. Use `seed:dev` to populate test data
4. Integrate seeders into your CI/CD pipeline for automated testing
5. Customize seed data for your specific use cases

## Support

For issues or questions:
1. Check the seeder logs for detailed error messages
2. Verify database connection and schema
3. Review the troubleshooting section above
4. Check the Prisma documentation for ORM-specific issues

## Version History

- **v1.0.0**: Initial release
  - Super Admin seeding
  - School Admin seeding
  - Teacher/Student/Staff/Parent seeding with profiles
  - Password hashing utilities
  - Comprehensive error handling
  - TypeScript support
