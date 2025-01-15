import { useState, useEffect } from 'react';
import { getCourses } from '../../services/courseService';
import { format } from 'date-fns';

const CourseStats = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const upcomingCourses = courses.filter(
    course => new Date(course.startDate) > new Date()
  );

  const ongoingCourses = courses.filter(
    course => {
      const now = new Date();
      const start = new Date(course.startDate);
      const end = new Date(course.endDate);
      return now >= start && now <= end;
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Ongoing Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ongoingCourses.map(course => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium">{course.name}</h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>Enrolled: {course.enrolledStudents.length} students</p>
                <p>Spots left: {course.maxStudents - course.enrolledStudents.length}</p>
                <p>Ends: {format(new Date(course.endDate), 'PPP')}</p>
              </div>
            </div>
          ))}
        </div>
        {ongoingCourses.length === 0 && (
          <p className="text-gray-500">No ongoing courses</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Upcoming Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingCourses.map(course => (
            <div key={course._id} className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-medium">{course.name}</h4>
              <div className="mt-2 text-sm text-gray-600">
                <p>Enrolled: {course.enrolledStudents.length} students</p>
                <p>Spots left: {course.maxStudents - course.enrolledStudents.length}</p>
                <p>Starts: {format(new Date(course.startDate), 'PPP')}</p>
              </div>
            </div>
          ))}
        </div>
        {upcomingCourses.length === 0 && (
          <p className="text-gray-500">No upcoming courses</p>
        )}
      </div>
    </div>
  );
};

export default CourseStats; 