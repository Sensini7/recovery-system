import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

const CourseCard = ({ course }) => {
  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (now < startDate) {
      return {
        text: 'Upcoming',
        style: 'text-yellow-600 bg-yellow-50'
      };
    } else if (now > endDate) {
      return {
        text: 'Completed',
        style: 'text-gray-600 bg-gray-50'
      };
    } else {
      return {
        text: 'Ongoing',
        style: 'text-green-600 bg-green-50'
      };
    }
  };

  const getAvailabilityStatus = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
    const isFull = course.enrolledStudents.length >= course.maxStudents;

    if (now > endDate) {
      return {
        text: 'Not Available',
        style: 'text-gray-600'
      };
    }
    
    if (isFull) {
      return {
        text: 'Full',
        style: 'text-red-600'
      };
    }

    return {
      text: 'Available',
      style: 'text-green-600'
    };
  };

  const status = getStatusBadge();
  const availability = getAvailabilityStatus();

  return (
    <Card className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {course.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {course.category}
            </CardDescription>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.style}`}>
            {status.text}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-sm text-gray-600 mb-2">Duration</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Start:</span>
                <span className="font-medium text-blue-600">
                  {formatDate(course.startDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">End:</span>
                <span className="font-medium text-indigo-600">
                  {formatDate(course.endDate)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 rounded-lg bg-gray-50">
            <span className="text-sm text-gray-600">Enrollment</span>
            <span className="font-medium text-gray-900">
              {course.enrolledStudents.length} / {course.maxStudents}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-gray-100 pt-3">
        <div className="flex justify-between items-center w-full">
          <span className={`text-sm font-medium ${availability.style}`}>
            {availability.text}
          </span>
          <div className="text-lg font-semibold text-blue-600">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'XAF',
            }).format(course.price)}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/api/courses');
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch courses';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default AdminCourses; 