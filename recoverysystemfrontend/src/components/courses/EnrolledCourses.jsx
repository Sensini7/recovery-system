import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { formatDate } from '../../lib/utils';

const CourseCard = ({ course }) => {
  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);

    if (now < startDate) {
      return <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full shadow-sm">Upcoming</span>;
    } else if (now > endDate) {
      return <span className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full shadow-sm">Completed</span>;
    } else {
      return <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full shadow-sm">In Progress</span>;
    }
  };

  const getOrderStatusBadge = () => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${statusColors[course.orderStatus] || 'bg-gray-100 text-gray-800'}`}>
        {course.orderStatus}
      </span>
    );
  };

  const getLevelBadge = () => {
    const levelColors = {
      beginner: 'bg-teal-100 text-teal-800',
      intermediate: 'bg-purple-100 text-purple-800',
      advanced: 'bg-pink-100 text-pink-800'
    };

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${levelColors[course.level] || 'bg-gray-100 text-gray-800'}`}>
        {course.level}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {course.imageUrl ? (
        <div className="relative h-48 group">
          <img 
            src={course.imageUrl} 
            alt={course.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 flex gap-2">
            {getLevelBadge()}
            <span className="px-3 py-1 text-xs font-semibold bg-white/90 text-gray-800 rounded-full shadow-sm">
              {course.category}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <h3 className="text-2xl font-bold text-white">{course.name.charAt(0)}</h3>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-gray-900 flex-grow">{course.name}</h3>
            <div className="flex gap-2">
              {getStatusBadge()}
              {getOrderStatusBadge()}
            </div>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Starts: {formatDate(course.startDate)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Ends: {formatDate(course.endDate)}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {course.instructor && (
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{course.instructor}</span>
                </div>
              )}
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Enrolled: {formatDate(course.enrollmentDate)}</span>
              </div>
            </div>
          </div>

          {course.materials && (
            <div className="pt-4 border-t border-gray-100">
              <button 
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => window.open(course.materials, '_blank')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Materials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EnrolledCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await api.get('/api/courses/enrolled');
        if (response.data.success) {
          setCourses(response.data.data);
        } else {
          setError(response.data.message);
          toast.error(response.data.message);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to fetch enrolled courses';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-8 max-w-md mx-auto shadow-sm">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Yet</h3>
          <p className="text-gray-600 mb-6">You haven't enrolled in any courses yet. Start your learning journey today!</p>
          <button 
            onClick={() => window.location.href = '/courses'}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Enrolled Courses</h2>
        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
          {courses.length} {courses.length === 1 ? 'Course' : 'Courses'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default EnrolledCourses;