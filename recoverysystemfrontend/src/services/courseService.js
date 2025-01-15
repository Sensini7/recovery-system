import api from './api';

export const getCourses = async () => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch courses' };
  }
};

export const getCourse = async (id) => {
  try {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch course' };
  }
};

export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create course' };
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update course' };
  }
};

export const deleteCourse = async (id) => {
  try {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete course' };
  }
};

export const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post(`/courses/${courseId}/enroll`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to enroll in course' };
  }
};

export const createCourseOrder = async (orderData) => {
  try {
    const response = await api.post('/courses/order', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create course order' };
  }
};

export const getEnrolledCourses = async () => {
  try {
    const response = await api.get('/courses/enrolled');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch enrolled courses');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    throw error.response?.data || { message: 'Failed to fetch enrolled courses' };
  }
}; 