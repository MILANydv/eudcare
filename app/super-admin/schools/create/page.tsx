'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';

export default function CreateSchoolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: 'Primary',
    country: '',
    email: '',
    phone: '',
    adminName: '',
    adminEmail: '',
    planId: 'trial',
  });

  const schoolTypes = [
    'Primary',
    'Secondary',
    'Higher Secondary',
    'K-12',
    'College',
    'University',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/super-admin/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create school');
      }

      router.push('/super-admin/dashboard');
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/super-admin/dashboard">
                <Button variant="ghost">← Back</Button>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Create New School</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="School Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Springfield High School"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    {schoolTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., United States"
                  required
                />

                <Input
                  label="School Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contact@school.edu"
                />

                <Input
                  label="School Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Admin Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Admin Name"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Admin Email"
                  name="adminEmail"
                  type="email"
                  value={formData.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@school.edu"
                  helperText="Login credentials will be sent to this email"
                  required
                />
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan <span className="text-red-500">*</span>
                </label>
                <select
                  name="planId"
                  value={formData.planId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="trial">Trial (30 days, 50 students)</option>
                  <option value="basic">Basic (100 students)</option>
                  <option value="premium">Premium (500 students)</option>
                  <option value="enterprise">Enterprise (Unlimited)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4 pt-6">
              <Link href="/super-admin/dashboard">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" isLoading={isLoading}>
                Create School
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
