import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function SchoolDashboard() {
  const stats = {
    totalStudents: 0,
    totalTeachers: 0,
    attendanceToday: 0,
    pendingFees: 0,
  };

  const quickLinks = [
    { title: 'Students', href: '/dashboard/students', icon: '👨‍🎓', color: 'bg-blue-100 text-blue-600' },
    { title: 'Teachers', href: '/dashboard/teachers', icon: '👨‍🏫', color: 'bg-green-100 text-green-600' },
    { title: 'Classes', href: '/dashboard/classes', icon: '🏫', color: 'bg-purple-100 text-purple-600' },
    { title: 'Attendance', href: '/dashboard/attendance', icon: '📝', color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Exams', href: '/dashboard/exams', icon: '📚', color: 'bg-red-100 text-red-600' },
    { title: 'Fees', href: '/dashboard/fees', icon: '💰', color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Timetable', href: '/dashboard/timetable', icon: '🕒', color: 'bg-orange-100 text-orange-600' },
    { title: 'Certificates', href: '/dashboard/certificates', icon: '🎓', color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">School Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/notices/create">
                <Button size="sm">+ Notice</Button>
              </Link>
              <Link href="/dashboard/profile">
                <Button variant="ghost" size="sm">Profile</Button>
              </Link>
              <Button variant="ghost" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
          <p className="text-gray-600">Here&apos;s what&apos;s happening in your school today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTeachers}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Attendance Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.attendanceToday}%</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Fees</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${stats.pendingFees}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className={`${link.color} p-4 rounded-full text-3xl mb-3`}>
                      {link.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900">{link.title}</h4>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Recent Activities">
            <div className="text-center py-8 text-gray-500">
              <p>No recent activities</p>
            </div>
          </Card>

          <Card title="Upcoming Events">
            <div className="text-center py-8 text-gray-500">
              <p>No upcoming events</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
