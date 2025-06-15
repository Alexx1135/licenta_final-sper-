'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AdminPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (!session || !session.user?.isAdmin) {
      // Not authenticated or not an admin, redirect to auth page
      router.push('/auth');
      return;
    }
  }, [session, status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (!session || !session.user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You need admin privileges to access this page.</p>
          <button
            onClick={() => router.push('/auth')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/reports" className="block p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2">View Reports</h2>
          <p className="text-gray-600 dark:text-gray-400">Access detailed reports on bookings, revenue, users, and more.</p>
        </Link>
        
        <Link href="/studio" className="block p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2">Content Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Access Sanity CMS to manage content, rooms, bookings, and users.</p>
        </Link>
          {/* Add more links to other admin sections here */}
      </div>
    </div>
  );
};

export default AdminPage;
