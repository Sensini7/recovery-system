import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Users, Calendar, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders');
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);
  };

  const getCourseStatus = (startDate, endDate) => {
    const now = new Date();
    const courseStart = new Date(startDate);
    const courseEnd = new Date(endDate);

    if (now < courseStart) {
      return { 
        status: 'upcoming',
        color: 'bg-purple-100 text-purple-800',
        text: 'Upcoming'
      };
    } else if (now > courseEnd) {
      return { 
        status: 'completed',
        color: 'bg-green-100 text-green-800',
        text: 'Completed'
      };
    } else if (now >= courseStart && now <= courseEnd) {
      return { 
        status: 'ongoing',
        color: 'bg-blue-100 text-blue-800',
        text: 'Ongoing'
      };
    } else {
      const daysUntilStart = Math.ceil((courseStart - now) / (1000 * 60 * 60 * 24));
      if (daysUntilStart <= 7) {
        return { 
          status: 'beginning-soon',
          color: 'bg-yellow-100 text-yellow-800',
          text: 'Beginning Soon'
        };
      }
      return { 
        status: 'upcoming',
        color: 'bg-purple-100 text-purple-800',
        text: 'Upcoming'
      };
    }
  };

  const renderOrderDetails = (order) => {
    if (order.orderType === 'course') {
      const courseDetails = order.items[0]?.course;
      if (!courseDetails) return null;

      const { color, text } = getCourseStatus(
        courseDetails.startDate,
        courseDetails.endDate
      );

      return (
        <Card key={order._id} className="overflow-hidden transition-all hover:shadow-lg border-purple-200">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-lg text-purple-800">
                  {courseDetails.name}
                </CardTitle>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
                {text}
              </span>
            </div>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(courseDetails.startDate)} - {formatDate(courseDetails.endDate)}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">
                {order.enrolledStudents?.length || 0} Enrolled Students
              </span>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {order.client.name}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.client.email}</p>
                        <p className="text-gray-500">{order.client.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{order.client.location}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>

          <CardFooter className="px-4 py-3 border-t bg-purple-50">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm font-medium text-gray-600">Course Fee:</span>
              <span className="font-semibold text-purple-600">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </CardFooter>
        </Card>
      );
    }

    return (
      <Card key={order._id} className={`overflow-hidden transition-all hover:shadow-lg ${
        order.orderType === 'product' ? 'border-blue-200' : 'border-green-200'
      }`}>
        <CardHeader className={`${
          order.orderType === 'product' 
            ? 'bg-gradient-to-r from-blue-50 to-blue-100'
            : 'bg-gradient-to-r from-green-50 to-green-100'
        }`}>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">
              {order.orderType === 'product' ? 'Product Order' : 'Service Installation'}
            </CardTitle>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <CardDescription className="flex items-center gap-2">
            <span className="text-xs">Order #{order._id.slice(-6)}</span>
            <span className="text-xs">•</span>
            <span className="text-xs">{formatDate(order.createdAt)}</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Client</h4>
              <div className="space-y-1">
                <p className="text-sm">{order.client.name}</p>
                <p className="text-xs text-gray-500">{order.client.email}</p>
                <p className="text-xs text-gray-500">{order.client.phone}</p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2 text-gray-700">Details</h4>
              <div className="space-y-1">
                {order.items.map((item, index) => (
                  <div key={index} className="text-sm">
                    {item.product && (
                      <p className="text-sm font-medium text-blue-600">
                        {item.product.name} × {item.quantity}
                      </p>
                    )}
                    {item.service && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-green-600">
                          Solar Installation × {item.quantity}
                        </p>
                        {order.preferredDates && (
                          <div className="text-xs text-gray-500">
                            <p>Start: {formatDate(order.preferredDates.startDate)}</p>
                            <p>End: {formatDate(order.preferredDates.endDate)}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={`px-4 py-3 border-t ${
          order.orderType === 'product' ? 'bg-blue-50' : 'bg-green-50'
        }`}>
          <div className="flex justify-between items-center w-full">
            <span className="text-sm font-medium text-gray-600">Total Amount:</span>
            <span className={`font-semibold ${
              order.orderType === 'product' ? 'text-blue-600' : 'text-green-600'
            }`}>
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </CardFooter>
      </Card>
    );
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.orderType === activeTab;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex gap-4 mb-4 flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded ${
              activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-4 py-2 rounded ${
              activeTab === 'product' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Product Orders
          </button>
          <button
            onClick={() => setActiveTab('service')}
            className={`px-4 py-2 rounded ${
              activeTab === 'service' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Service Orders
          </button>
          <button
            onClick={() => setActiveTab('course')}
            className={`px-4 py-2 rounded ${
              activeTab === 'course' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Course Orders
          </button>
        </div>

        <div>
          <CardHeader>
            <CardTitle>
              {activeTab === 'all' ? 'All Orders' : 
               activeTab === 'product' ? 'Product Orders' : 
               activeTab === 'service' ? 'Service Orders' :
               'Course Orders'}
            </CardTitle>
            <CardDescription>
              View {activeTab === 'all' ? 'all' : activeTab} orders
            </CardDescription>
          </CardHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-3 text-center py-8">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No {activeTab === 'all' ? '' : activeTab} orders found
              </div>
            ) : (
              filteredOrders.map(order => renderOrderDetails(order))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 