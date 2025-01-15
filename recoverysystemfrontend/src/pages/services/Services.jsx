import React, { useState, useEffect } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import ServiceCard from '../../components/services/ServiceCard';
import ServiceModal from '../../components/services/ServiceModal';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import ServiceOrderModal from '../../components/services/ServiceOrderModal';
import { useAuth } from '../../context/AuthContext';

const Services = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const fetchServices = async () => {
    try {
      const response = await api.get('/api/services');
      if (response.data.success) {
        setServices(response.data.data);
      }
    } catch (error) {
      console.error('Fetch services error:', error);
      toast.error('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleEdit = async (service) => {
    console.log('Edit clicked for service:', service);
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId) => {
    console.log('Delete clicked for service:', serviceId);
    
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/services/${serviceId}`);
      
      if (response.data.success) {
        toast.success('Service deleted successfully');
        // Refresh the services list
        await fetchServices();
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleModalClose = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const handleModalSuccess = async () => {
    await fetchServices(); // Refresh the services list
    handleModalClose();
  };

  const handleOrder = (service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solar Installation Services</h1>
        {user?.role === 'admin' && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Service
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service._id}
            service={service}
            onEdit={user?.role === 'admin' ? handleEdit : undefined}
            onDelete={user?.role === 'admin' ? handleDelete : undefined}
            onOrder={user?.role !== 'admin' ? handleOrder : undefined}
          />
        ))}
      </div>

      {/* Admin Modal */}
      {isModalOpen && (
        <ServiceModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
          service={selectedService}
        />
      )}

      {/* Customer Order Modal */}
      {isOrderModalOpen && (
        <ServiceOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => {
            setIsOrderModalOpen(false);
            setSelectedService(null);
          }}
          service={selectedService}
        />
      )}
    </div>
  );
};

export default Services; 