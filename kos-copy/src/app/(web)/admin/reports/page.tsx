'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import axios from 'axios';

interface ReportData {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  bookingsPerMonthChartData: { name: string; value: number }[];
  revenuePerMonthChartData: { name: string; value: number }[];
  bookingsPerRoomTypeChartData: { name: string; value: number }[];
  newUsersPerMonthChartData: { name: string; value: number }[];
  averageLengthOfStayByRoomTypeChartData: { name: string; value: number }[];
  occupancyRatePerMonthChartData: { name: string; value: number }[];
  cumulativeUserGrowthChartData?: { name: string; value: number }[]; 
  bookingLeadTimeDistributionChartData?: { name: string; value: number }[]; 
  topPerformingRoomData?: { name: string; value: number };
  averageReviewsPerRoomData?: { value: number };
  revenueByRoomTypeChartData?: { name: string; value: number }[];
  averageReviewsPerRoomTypeChartData?: { name: string; value: number }[];
  // List reports
  upcomingCheckouts?: { userName: string; checkoutDate: string; roomName: string; userId: string }[];
  recentBookings?: { userName: string; checkinDate: string; roomName: string; totalPrice: number; userId: string }[];
  highValueBookings?: { userName: string; roomName: string; totalPrice: number; checkinDate: string; userId: string }[];
  currentGuests?: { userName: string; roomName: string; checkinDate: string; checkoutDate: string; numberOfDays: number; userId: string }[];
  longStayGuests?: { userName: string; roomName: string; checkinDate: string; checkoutDate: string; numberOfDays: number; userId: string }[];
  recentArrivals?: { userName: string; roomName: string; checkinDate: string; totalPrice: number; userId: string }[];
}

const ReportsPage = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reports-data');
        setData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch report data. Please try again later.');
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading reports...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="container mx-auto p-4 text-center">No data available.</div>;
  }

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF', '#FF4500', '#2E8B57'];
  const BAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#F97316', '#22C55E'];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Hotel Management Reports</h1>

      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-center">Total Users</h2>
          <p className="text-4xl font-bold text-center text-blue-500 dark:text-blue-400">{data.totalUsers}</p>
        </div>

        {/* Total Bookings */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-center">Total Bookings</h2>
          <p className="text-4xl font-bold text-center text-green-500 dark:text-green-400">{data.totalBookings}</p>
        </div>

        {/* Total Revenue */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-center">Total Revenue</h2>
          <p className="text-4xl font-bold text-center text-purple-500 dark:text-purple-400">
            ${data.totalRevenue.toLocaleString()}
          </p>
        </div>
        
        {/* Average Booking Value */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-3 text-center">Avg. Booking Value</h2>
          <p className="text-4xl font-bold text-center text-yellow-500 dark:text-yellow-400">
            ${data.averageBookingValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bookings Per Month */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Bookings Per Month</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.bookingsPerMonthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Per Month */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Revenue Per Month</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.revenuePerMonthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bookings by Room Type */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Bookings by Room Type</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={data.bookingsPerRoomTypeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.bookingsPerRoomTypeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value} bookings`, name]}/>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* New Users Per Month */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">New Users Per Month</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.newUsersPerMonthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#FF8042" strokeWidth={2} activeDot={{ r: 8 }} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Occupancy Rate Per Month */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Room Occupancy Rate Per Month</h2>
          <ResponsiveContainer width="100%" height={350}>
            {/* Placeholder for Occupancy Rate Chart - Assuming Line Chart */}
            {data.occupancyRatePerMonthChartData && data.occupancyRatePerMonthChartData.length > 0 ? (
              <LineChart data={data.occupancyRatePerMonthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} name="Occupancy Rate (%)"/>
              </LineChart>
            ) : <p className='text-center text-gray-500'>No occupancy data available.</p>}
          </ResponsiveContainer>
        </div>

        {/* Average Length of Stay by Room Type */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Avg. Length of Stay (Room Type)</h2>
          <ResponsiveContainer width="100%" height={350}>
            {/* Placeholder for Avg. Length of Stay - Assuming Bar Chart */}
            {data.averageLengthOfStayByRoomTypeChartData && data.averageLengthOfStayByRoomTypeChartData.length > 0 ? (
              <BarChart data={data.averageLengthOfStayByRoomTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Avg. Stay (Days)">
                  {data.averageLengthOfStayByRoomTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            ) : <p className='text-center text-gray-500'>No avg. length of stay data.</p>}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 4 - New Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Cumulative User Growth */}
        {data.cumulativeUserGrowthChartData && data.cumulativeUserGrowthChartData.length > 0 && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-center">Cumulative User Growth</h2>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data.cumulativeUserGrowthChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" name="Total Users" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Booking Lead Time Distribution */}
        {data.bookingLeadTimeDistributionChartData && data.bookingLeadTimeDistributionChartData.length > 0 && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-center">Booking Lead Time Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.bookingLeadTimeDistributionChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data.bookingLeadTimeDistributionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 5 - Custom Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue by Room Type (Pie Chart) */}
        {data.revenueByRoomTypeChartData && data.revenueByRoomTypeChartData.length > 0 && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-center">Revenue by Room Type</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={data.revenueByRoomTypeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => `${name}: $${value.toLocaleString()} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                >
                  {data.revenueByRoomTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Average Reviews Per Room Type */}
        {data.averageReviewsPerRoomTypeChartData && data.averageReviewsPerRoomTypeChartData.length > 0 && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-center">Average Reviews per Room Type</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.averageReviewsPerRoomTypeChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Avg. Reviews">
                  {data.averageReviewsPerRoomTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Charts Row 6 - Single Stat Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Performing Room Chart */}
        {data.topPerformingRoomData && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-center">Top Performing Room (by Revenue)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[data.topPerformingRoomData]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="value" name="Revenue" unit="$" />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="value" name="Revenue" fill={BAR_COLORS[0]}>
                  <Cell fill={BAR_COLORS[0]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Average Reviews Per Room (All Rooms) Chart */}
        {data.averageReviewsPerRoomData && (
          <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3 text-center">Average Reviews Per Room (All Rooms)</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={[{ name: 'Avg Reviews', value: data.averageReviewsPerRoomData.value }]} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="value" name="Average Reviews" />
                <YAxis type="category" dataKey="name" width={150}/>
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Average Reviews" fill={PIE_COLORS[1]}>
                   <Cell fill={PIE_COLORS[1]} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>        )}
      </div>

      {/* List Reports Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-200">List Reports</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Upcoming Checkouts */}
          {data.upcomingCheckouts && data.upcomingCheckouts.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">Upcoming Checkouts (Next 7 Days)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Checkout Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.upcomingCheckouts.slice(0, 10).map((checkout, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{checkout.userName}</td>
                        <td className="px-3 py-2">{checkout.roomName}</td>
                        <td className="px-3 py-2">{new Date(checkout.checkoutDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Arrivals */}
          {data.recentArrivals && data.recentArrivals.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">Recent Arrivals (Last 7 Days)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Check-in Date</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentArrivals.slice(0, 10).map((arrival, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{arrival.userName}</td>
                        <td className="px-3 py-2">{arrival.roomName}</td>
                        <td className="px-3 py-2">{new Date(arrival.checkinDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2">${arrival.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Current Guests */}
          {data.currentGuests && data.currentGuests.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">Current Guests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Check-in</th>
                      <th className="px-3 py-2">Check-out</th>
                      <th className="px-3 py-2">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.currentGuests.slice(0, 10).map((guest, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{guest.userName}</td>
                        <td className="px-3 py-2">{guest.roomName}</td>
                        <td className="px-3 py-2">{new Date(guest.checkinDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{new Date(guest.checkoutDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{guest.numberOfDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Long Stay Guests */}
          {data.longStayGuests && data.longStayGuests.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">Long Stay Guests (7+ Days)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Check-in</th>
                      <th className="px-3 py-2">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.longStayGuests.slice(0, 10).map((guest, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{guest.userName}</td>
                        <td className="px-3 py-2">{guest.roomName}</td>
                        <td className="px-3 py-2">{new Date(guest.checkinDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2">{guest.numberOfDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* High Value Bookings */}
          {data.highValueBookings && data.highValueBookings.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">High Value Bookings ($500+)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Amount</th>
                      <th className="px-3 py-2">Check-in</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.highValueBookings.slice(0, 10).map((booking, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{booking.userName}</td>
                        <td className="px-3 py-2">{booking.roomName}</td>
                        <td className="px-3 py-2 font-bold text-green-600">${booking.totalPrice}</td>
                        <td className="px-3 py-2">{new Date(booking.checkinDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Recent Bookings */}
          {data.recentBookings && data.recentBookings.length > 0 && (
            <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-3 py-2">Guest Name</th>
                      <th className="px-3 py-2">Room</th>
                      <th className="px-3 py-2">Check-in</th>
                      <th className="px-3 py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentBookings.slice(0, 10).map((booking, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td className="px-3 py-2 font-medium">{booking.userName}</td>
                        <td className="px-3 py-2">{booking.roomName}</td>
                        <td className="px-3 py-2">{new Date(booking.checkinDate).toLocaleDateString()}</td>
                        <td className="px-3 py-2">${booking.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;
