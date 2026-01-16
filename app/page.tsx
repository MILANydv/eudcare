import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            School Management System
          </h1>
          <p className="text-xl text-gray-600">
            Complete solution for managing your educational institution
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">School Admin</h2>
            <p className="text-gray-600 mb-6">
              Manage students, teachers, attendance, exams, fees, and more
            </p>
            <Link href="/login">
              <Button className="w-full">Login as School Admin</Button>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Super Admin</h2>
            <p className="text-gray-600 mb-6">
              Create and manage schools, subscription plans, and templates
            </p>
            <Link href="/super-admin/login">
              <Button variant="secondary" className="w-full">Login as Super Admin</Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">👨‍🎓</div>
            <p className="text-sm font-semibold text-gray-700">Student Management</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm font-semibold text-gray-700">Attendance Tracking</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm font-semibold text-gray-700">Exam Management</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm font-semibold text-gray-700">Fee Collection</p>
          </div>
        </div>
      </div>
    </div>
  );
}
