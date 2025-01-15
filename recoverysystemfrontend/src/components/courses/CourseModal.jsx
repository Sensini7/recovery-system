import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createCourse, updateCourse } from '../../services/courseService';
import toast from 'react-hot-toast';

const CourseModal = ({ isOpen, onClose, course, onRefresh }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    level: 'beginner',
    category: '',
    price: '',
    startDate: '',
    endDate: '',
    maxStudents: '',
    courseMaterial: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        name: course.name,
        description: course.description,
        level: course.level,
        category: course.category,
        price: course.price,
        startDate: new Date(course.startDate).toISOString().split('T')[0],
        endDate: new Date(course.endDate).toISOString().split('T')[0],
        maxStudents: course.maxStudents,
        courseMaterial: course.courseMaterial || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        level: 'beginner',
        category: '',
        price: '',
        startDate: '',
        endDate: '',
        maxStudents: '',
        courseMaterial: ''
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate dates
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end <= start) {
        toast.error('End date must be after start date');
        return;
      }

      // Validate price and max students
      if (formData.price <= 0) {
        toast.error('Price must be greater than 0');
        return;
      }
      if (formData.maxStudents <= 0) {
        toast.error('Maximum students must be greater than 0');
        return;
      }

      const data = {
        ...formData,
        price: Number(formData.price),
        maxStudents: Number(formData.maxStudents)
      };

      if (course) {
        await updateCourse(course._id, data);
        toast.success('Course updated successfully');
      } else {
        await createCourse(data);
        toast.success('Course created successfully');
      }

      onRefresh();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-3 py-2 border rounded-md"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Input
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (XAF)
            </label>
            <Input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Students
              </label>
              <Input
                type="number"
                name="maxStudents"
                value={formData.maxStudents}
                onChange={handleChange}
                required
                min="1"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course Material URL
              </label>
              <Input
                name="courseMaterial"
                value={formData.courseMaterial}
                onChange={handleChange}
                disabled={loading}
                placeholder="Optional"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="hover:bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseModal; 