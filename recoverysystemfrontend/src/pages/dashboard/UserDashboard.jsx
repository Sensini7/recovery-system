import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../../lib/utils';
import CustomerOrders from '../../components/dashboard/CustomerOrders';
import { BookOpen, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import EnrolledCourses from '../../components/courses/EnrolledCourses';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await api.get('/api/user/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Courses"
          value={stats.courses}
          icon={BookOpen}
          description="Enrolled Courses"
        />
        <StatCard
          title="Orders"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          description="Pending Orders"
        />
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">My Courses</h2>
          <Link 
            to="/courses" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Browse more courses →
          </Link>
        </div>
        <EnrolledCourses />
      </div>

      {/* Orders Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Orders</h2>
          <Link 
            to="/dashboard/orders" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            View all orders →
          </Link>
        </div>
        <CustomerOrders />
      </div>
    </div>
  );
};

export default UserDashboard;
