# School Management System - Phase 1

A comprehensive multi-tenant school management system built with Next.js 16, React 19, TypeScript, Prisma, and PostgreSQL.

## Features

### Super Admin Features (Phase 1)
- **School Registration Flow**
  - Create schools with auto-generated slugs
  - Assign subscription plans (Trial, Basic, Premium, Enterprise)
  - Create school admin accounts with auto-generated credentials
  - Manage school profiles

- **Subscription Management**
  - Student limit enforcement based on plan
  - Certificate printing capabilities
  - Trial period tracking

- **Template Management**
  - Create global templates (ID Cards, Admit Cards, Result Cards, Certificates)
  - Assign templates to plans
  - Auto-available to schools based on subscription

- **Analytics Dashboard**
  - Total schools count
  - Active vs trial schools
  - Certificates printed tracking

### School Admin Features (Phase 1)

#### Initial Setup (Mandatory)
- Academic year configuration
- School profile completion (logo, address, principal details)
- System locked until setup is complete

#### Academic Structure
- **Classes & Sections**
  - Manual class creation
  - Section management
  - Subject mapping

- **User Management**
  - Students (with parent linking)
  - Teachers (with subject/class assignment)
  - Non-teaching staff (Office, Librarian, Accountant)

#### Operations
- **Attendance Management**
  - Daily attendance marking
  - Same-day edit capability
  - Locked after 24 hours
  - Admin monitoring dashboard

- **Timetable/Routine**
  - Period-based scheduling
  - Teacher-subject-class assignment
  - Overlap prevention

- **Exam Management**
  - Exam creation and scheduling
  - Marks entry by teachers
  - Result publication workflow
  - Admit card generation
  - Result card printing

- **Certificate Printing**
  - Bonafide certificates
  - Exam completion certificates
  - Auto-generated certificate numbers
  - Audit logging

- **Library Management**
  - Book catalog
  - Library card generation (Phase 1 - printing only)

- **Fee Management**
  - Fee structure setup by class
  - Payment collection
  - Receipt generation
  - Financial dashboard with drill-down
  - Due tracking

- **Communication**
  - Notice creation with audience targeting
  - In-app delivery
  - Calendar integration

- **Unified Calendar**
  - Auto-synced exams
  - Notices
  - Holidays
  - Events

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Form Handling:** React Hook Form + Zod validation
- **Date Handling:** date-fns

## Project Structure

```
/app
  /api
    /auth/[...nextauth]     # NextAuth API routes
    /super-admin            # Super admin API endpoints
    /setup                  # School setup API endpoints
  /super-admin
    /login                  # Super admin login
    /dashboard              # Super admin dashboard
    /schools                # School management
    /plans                  # Plan management
    /templates              # Template management
  /login                    # School admin/teacher/student login
  /setup                    # First-time school setup flow
  /dashboard                # School admin dashboard
    /students               # Student management
    /teachers               # Teacher management
    /classes                # Class & section management
    /attendance             # Attendance tracking
    /exams                  # Exam management
    /fees                   # Fee management
    /timetable              # Timetable management
    /certificates           # Certificate generation
    /notices                # Notice management
    /library                # Library management
/components
  /ui                       # Reusable UI components
  /forms                    # Form components
  /layout                   # Layout components
/lib
  /prisma.ts               # Prisma client singleton
  /auth.ts                 # Auth utilities
  /auth-options.ts         # NextAuth configuration
/prisma
  /schema.prisma           # Database schema
```

## Database Models

### Core Models
- **SuperAdmin** - Super admin users
- **Plan** - Subscription plans
- **School** - School instances
- **Template** - Document templates
- **User** - All system users

### Academic Models
- **AcademicYear** - Academic year configuration
- **Class** - Grade/class levels
- **Section** - Class sections
- **Subject** - Subjects
- **ClassSubject** - Subject-class mapping

### User Profile Models
- **Student** - Student profiles
- **Teacher** - Teacher profiles
- **Parent** - Parent profiles
- **Staff** - Non-teaching staff
- **TeacherAssignment** - Teacher-subject-section assignments

### Operations Models
- **Attendance** - Daily attendance records
- **Routine** - Timetables
- **RoutinePeriod** - Individual periods
- **Exam** - Exam definitions
- **ExamSubject** - Exam subjects
- **ExamResult** - Student results
- **AdmitCard** - Exam admit cards
- **Certificate** - Certificates issued
- **Fee** - Fee structures
- **FeeCollection** - Payment records
- **Notice** - Notices/announcements
- **CalendarEvent** - Calendar entries
- **Book** - Library books
- **LibraryCard** - Library cards

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables in `.env`:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. Start the Prisma dev server (for development):
```bash
npx prisma dev &
```

5. Push the database schema:
```bash
npx prisma db push
```

6. Generate Prisma client:
```bash
npx prisma generate
```

7. Start the development server:
```bash
npm run dev
```

8. Open [http://localhost:3000](http://localhost:3000)

## User Roles

- **SUPER_ADMIN** - System administrator
- **SCHOOL_ADMIN** - School administrator
- **TEACHER** - Teaching staff
- **STUDENT** - Students
- **PARENT** - Parents/guardians
- **STAFF** - Non-teaching staff

## Development Phases

### Phase 1 (Current)
- ✅ Super admin dashboard
- ✅ School registration
- ✅ Basic subscription management
- ✅ School admin setup flow
- ✅ Academic structure
- ✅ User management foundation
- 🔨 Attendance system
- 🔨 Exam management
- 🔨 Fee management
- 🔨 Certificate generation

### Phase 2 (Planned)
- Custom domains
- Advanced timetable (room management, substitutions)
- Book issue/return workflow
- Payment gateway integration
- Elective subject logic
- Advanced reporting
- SMS/Email notifications
- Parent portal
- Student portal
- Teacher portal

## API Routes

### Super Admin
- `POST /api/super-admin/schools` - Create school
- `GET /api/super-admin/schools` - List schools

### Setup
- `POST /api/setup/academic-year` - Create academic year
- `POST /api/setup/school-profile` - Update school profile

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth handlers

## Contributing

This is Phase 1 implementation. Follow the sprint order for feature development:
1. Auth & tenancy
2. Users & academic structure
3. Attendance & communication
4. Exams & certificates
5. Fees & reporting

## License

Proprietary
