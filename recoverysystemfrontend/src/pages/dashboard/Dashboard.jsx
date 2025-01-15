import React from 'react';
import { useAuth } from '../../context/AuthContext';
import CustomerOrders from '../../components/dashboard/CustomerOrders';
import EnrolledCourses from '../../components/courses/EnrolledCourses';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Enrolled Courses Section */}
      <div className="mb-12">
        <EnrolledCourses />
      </div>

      {/* Orders Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Orders</h2>
        <CustomerOrders />
      </div>
    </div>
  );
};

export default Dashboard;
