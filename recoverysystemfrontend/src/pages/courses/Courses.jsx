import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCourses } from '../../services/courseService';
import CourseCard from '../../components/courses/CourseCard';
import CourseModal from '../../components/courses/CourseModal';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import ErrorBoundary from '../../components/ErrorBoundary';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const isAdmin = user?.role === 'admin';

  const fetchCourses = async () => {
    try {
      setLoading(true);
      console.log('Fetching courses...');
      const response = await getCourses();
      console.log('Courses response:', response);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          {isAdmin && (
            <Button 
              onClick={handleAddCourse}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course}
              isAdmin={isAdmin}
              onEdit={() => {
                setSelectedCourse(course);
                setIsModalOpen(true);
              }}
              onRefresh={fetchCourses}
            />
          ))}
        </div>

        {isAdmin && (
          <CourseModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            course={selectedCourse}
            onRefresh={fetchCourses}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Courses; 