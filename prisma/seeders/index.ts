/**
 * Main Seeder Entry Point
 * 
 * Run seeders with: npm run seed
 * or directly: ts-node prisma/seeders/index.ts
 * 
 * This seeder creates initial authentication data for the school management system including:
 * - Super Admin
 * - School Admin
 * - Teachers
 * - Students
 * - Staff
 * - Parents
 */

import { PrismaClient } from '@prisma/client';
import { seedSuperAdmin } from './factory';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting authentication seeder...');

  try {
    // Clean existing data (optional - uncomment if needed)
    // await prisma.student.deleteMany();
    // await prisma.teacher.deleteMany();
    // await prisma.staff.deleteMany();
    // await prisma.parent.deleteMany();
    // await prisma.user.deleteMany({ where: { role: { not: 'SUPER_ADMIN' } } });

    // Create Super Admin
    console.log('👑 Creating Super Admin...');
    const superAdminResult = await seedSuperAdmin({
      email: 'super.admin@schoolms.com',
      password: 'SuperAdmin2024!',
      name: 'Super Administrator',
    });
    console.log(`✅ Super Admin created: ${superAdminResult.user.email}`);

    // Note: In a real scenario, we'd need an existing school to create school-specific users
    // For now, we'll show the usage patterns

    console.log('\n🎯 Seeder completed successfully!');
    console.log('\n📋 Authentication Seeder Summary:');
    console.log(`   - Super Admin: 1 created`);
    console.log('\n💡 Note: School-specific users (School Admin, Teachers, Students, etc.) require an existing school.');
    console.log('   Use the seeding functions in your tests or specific school setup flows.');

  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
