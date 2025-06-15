'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import LoadingSpinner from '../loading';
import { Booking } from '@/models/booking';
import { User } from '@/models/user';
import InvoiceDownload from '@/components/InvoiceDownload/InvoiceDownload';

const BookingConfirmation = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const sessionId = searchParams.get('session_id');
  
  const [booking, setBooking] = useState<Booking | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth');
      return;
    }

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    fetchBookingDetails();
  }, [session, sessionId, status]);
  const fetchBookingDetails = async () => {
    if (!session?.user?.id) {
      setError('User session not found');
      setLoading(false);
      return;
    }

    try {
      // Fetch user data
      const userResponse = await fetch('/api/users');
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      const userData = await userResponse.json();
      setUser(userData);

      // Get the most recent booking for this user
      // In a real app, you'd want to match the booking with the session ID
      const bookingsResponse = await fetch(`/api/user-bookings/${session.user.id}`);
      if (!bookingsResponse.ok) throw new Error('Failed to fetch booking data');
      const bookingsData = await bookingsResponse.json();
      
      // Get the most recent booking (assuming it's the one just created)
      if (bookingsData && bookingsData.length > 0) {
        const latestBooking = bookingsData.sort((a: Booking, b: Booking) => 
          new Date(b.checkinDate).getTime() - new Date(a.checkinDate).getTime()
        )[0];
        setBooking(latestBooking);
      } else {
        setError('No booking found');
      }
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!booking || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-600 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find your booking details.</p>
          <Link href="/" className="btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }
  const formatDate = (dateString: string) => {
    // Create date object and avoid timezone issues by using the date parts directly
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">Thank you for your reservation. Your booking has been successfully processed.</p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Guest Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Guest Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Adults:</span>
                  <span className="font-medium">{booking.adults}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Children:</span>
                  <span className="font-medium">{booking.children}</span>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{booking.hotelRoom.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-medium">{formatDate(booking.checkinDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-medium">{formatDate(booking.checkoutDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Days:</span>
                  <span className="font-medium">{booking.numberOfDays}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Rate (per night):</span>
                <span className="font-medium">${booking.hotelRoom.price}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({booking.discount}%):</span>
                  <span>-${((booking.hotelRoom.price * booking.discount) / 100 * booking.numberOfDays).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total Amount Paid:</span>
                <span className="text-green-600">${booking.totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <InvoiceDownload booking={booking} user={user} />          <Link 
            href={`/users/${session?.user?.id || ''}`}
            className="btn-secondary text-center"
          >
            View All Bookings
          </Link>
          <Link 
            href="/"
            className="btn-primary text-center"
          >
            Continue Browsing
          </Link>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Please arrive at the hotel with a valid photo ID and the credit card used for booking</li>
            <li>• Check-in time is 3:00 PM and check-out time is 11:00 AM</li>
            <li>• For any changes or cancellations, please contact our support team</li>
            <li>• You will receive a confirmation email shortly</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
