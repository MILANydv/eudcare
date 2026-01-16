'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function SetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [academicYear, setAcademicYear] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  const [schoolProfile, setSchoolProfile] = useState({
    address: '',
    phone: '',
    principalName: '',
  });

  const handleAcademicYearSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/setup/academic-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(academicYear),
      });

      if (!response.ok) {
        throw new Error('Failed to create academic year');
      }

      setStep(2);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSchoolProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/setup/school-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update school profile');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome! Let&apos;s Set Up Your School</h1>
          <p className="mt-2 text-gray-600">Complete these steps to start using the system</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                1
              </div>
              <span className="ml-2 font-medium">Academic Year</span>
            </div>
            <div className={`w-16 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                2
              </div>
              <span className="ml-2 font-medium">School Profile</span>
            </div>
          </div>
        </div>

        <Card>
          {step === 1 && (
            <form onSubmit={handleAcademicYearSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Set Up Academic Year</h2>
              
              <Input
                label="Academic Year Name"
                value={academicYear.name}
                onChange={(e) => setAcademicYear({ ...academicYear, name: e.target.value })}
                placeholder="e.g., 2024-2025"
                required
                helperText="This will be your current academic year"
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={academicYear.startDate}
                  onChange={(e) => setAcademicYear({ ...academicYear, startDate: e.target.value })}
                  required
                />

                <Input
                  label="End Date"
                  type="date"
                  value={academicYear.endDate}
                  onChange={(e) => setAcademicYear({ ...academicYear, endDate: e.target.value })}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full">
                Continue
              </Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSchoolProfileSubmit} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 2: Complete School Profile</h2>
              
              <Input
                label="School Address"
                value={schoolProfile.address}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, address: e.target.value })}
                placeholder="Enter complete address"
                required
              />

              <Input
                label="School Phone"
                type="tel"
                value={schoolProfile.phone}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, phone: e.target.value })}
                placeholder="+1234567890"
                required
              />

              <Input
                label="Principal / Authority Name"
                value={schoolProfile.principalName}
                onChange={(e) => setSchoolProfile({ ...schoolProfile, principalName: e.target.value })}
                placeholder="Enter principal's name"
                required
              />

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" isLoading={isLoading} className="flex-1">
                  Complete Setup
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
