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
            <BarChart data={data.occupancyRatePerMonthChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" domain={[0, 100]} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="value" fill="#FFC658" name="Occupancy Rate" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Average Length of Stay by Room Type */}
        <div className="p-4 border rounded-lg shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-center">Avg. Length of Stay by Room Type</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data.averageLengthOfStayByRoomTypeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit=" nights" allowDecimals={true} />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)} nights`} />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Avg. Stay" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default ReportsPage;
