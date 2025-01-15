import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { 
  deleteCourse, 
  createCourseOrder
} from '../../services/courseService';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CourseEnrollModal from './CourseEnrollModal';

const CourseCard = ({ course, isAdmin, onEdit, onRefresh }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const isEnrolled = course.enrolledStudents.includes(user?._id);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    try {
      return format(new Date(date), 'PPP');
    } catch (error) {
      // Fallback date formatting if date-fns fails
      return new Date(date).toLocaleDateString();
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(course._id);
        toast.success('Course deleted successfully');
        onRefresh();
      } catch (error) {
        toast.error(error.message || 'Failed to delete course');
      }
    }
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll in this course');
      navigate('/login');
      return;
    }
    setIsEnrollModalOpen(true);
  };

  const handleEnrollConfirm = async (formData) => {
    try {
      const orderData = {
        items: [{
          courseId: course._id,
          quantity: 1,
          price: course.price
        }],
        totalAmount: course.price,
        orderType: 'course',
        client: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          user: user._id
        }
      };

      const response = await createCourseOrder(orderData);
      
      if (response.success) {
        toast.success('Payment successful! You are now enrolled.');
        onRefresh();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to enroll in course');
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{course.name}</h3>
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getLevelColor(course.level)}`}>
              {course.level}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4">{course.description}</p>
          
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Category:</span>
              <span className="ml-2">{course.category}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Price:</span>
              <span className="ml-2 text-blue-600 font-semibold">{formatPrice(course.price)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Start Date:</span>
              <span className="ml-2">{formatDate(course.startDate)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">End Date:</span>
              <span className="ml-2">{formatDate(course.endDate)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-700">Spots Available:</span>
              <span className={`ml-2 ${
                course.maxStudents - course.enrolledStudents.length <= 5 
                  ? 'text-red-600 font-semibold' 
                  : 'text-green-600'
              }`}>
                {course.maxStudents - course.enrolledStudents.length}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            {isAdmin ? (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onEdit}
                  className="hover:bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-300"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDelete}
                  className="hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleEnrollClick}
                disabled={isEnrolled || course.enrolledStudents.length >= course.maxStudents}
                className={`w-full ${
                  isEnrolled 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : course.enrolledStudents.length >= course.maxStudents
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <CourseEnrollModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        course={course}
        onConfirm={handleEnrollConfirm}
      />
    </>
  );
};

export default CourseCard;
