import React, { useState, useEffect, useCallback } from 'react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ServiceModal = ({ isOpen, onClose, onSuccess, service = null }) => {
  const [formData, setFormData] = useState({
    description: service?.description || '',
    products: {
      panel: { product: null, quantity: 1 },
      battery: { product: null, quantity: 1 },
      controller: { product: null, quantity: 1 },
      cable: { product: null, quantity: 1 }
    },
    laborCost: service?.laborCost || '',
    estimatedDuration: service?.estimatedDuration || '',
    installationDate: service?.installationDate ? new Date(service.installationDate).toISOString().split('T')[0] : ''
  });

  const [availableProducts, setAvailableProducts] = useState({
    panel: [],
    battery: [],
    controller: [],
    cable: []
  });
  const [loading, setLoading] = useState(false);

  const [totalCost, setTotalCost] = useState({
    products: {
      panel: 0,
      battery: 0,
      controller: 0,
      cable: 0
    },
    labor: 0,
    total: 0
  });

  useEffect(() => {
    fetchAvailableProducts();
  }, []);

  const fetchAvailableProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await api.get('/api/services/available-products');
      console.log('API Response:', response.data);

      if (response.data.success) {
        // Categorize products
        const categorizedProducts = {
          panel: response.data.data.filter(p => p.category === 'Solar Panel'),
          battery: response.data.data.filter(p => p.category === 'Battery'),
          controller: response.data.data.filter(p => p.category === 'Controller'),
          cable: response.data.data.filter(p => p.category === 'Cable')
        };

        console.log('Categorized products:', categorizedProducts);
        setAvailableProducts(categorizedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch available products');
    }
  };

  const calculateCosts = useCallback((products, laborCost) => {
    const costs = {
      products: {
        panel: 0,
        battery: 0,
        controller: 0,
        cable: 0
      },
      labor: parseFloat(laborCost) || 0,
      total: 0
    };

    // Calculate cost for each product type
    Object.keys(products).forEach(type => {
      const item = products[type];
      const product = availableProducts[type]?.find(p => p._id === item.product);
      if (product) {
        costs.products[type] = product.price * item.quantity;
      }
    });

    // Calculate total cost
    costs.total = Object.values(costs.products).reduce((sum, cost) => sum + cost, 0) + costs.labor;

    setTotalCost(costs);
  }, [availableProducts]);

  useEffect(() => {
    if (Object.values(availableProducts).some(arr => arr.length > 0)) {
      calculateCosts(formData.products, formData.laborCost);
    }
  }, [availableProducts, formData.products, formData.laborCost, calculateCosts]);

  const handleProductChange = (type, field, value) => {
    if (field === 'product') {
      const product = availableProducts[type]?.find(p => p._id === value);
      if (!product) return;
    }

    const updatedFormData = {
      ...formData,
      products: {
        ...formData.products,
        [type]: {
          ...formData.products[type],
          [field]: field === 'product' ? value : parseInt(value) || 1
        }
      }
    };
    
    setFormData(updatedFormData);
    calculateCosts(updatedFormData.products, formData.laborCost);
  };

  const handleLaborCostChange = (e) => {
    const newLaborCost = e.target.value;
    setFormData(prev => ({
      ...prev,
      laborCost: newLaborCost
    }));
    calculateCosts(formData.products, newLaborCost);
  };

  const validateProducts = () => {
    const productTypes = ['panel', 'battery', 'controller', 'cable'];
    for (const type of productTypes) {
      if (!formData.products[type].product || formData.products[type].quantity < 1) {
        toast.error(`Please select ${type} and specify quantity`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProducts()) return;
    setLoading(true);

    try {
      const endpoint = service ? `/api/services/${service._id}` : '/api/services';
      const method = service ? 'put' : 'post';
      
      const response = await api[method](endpoint, formData);

      if (response.data.success) {
        toast.success(`Service ${service ? 'updated' : 'created'} successfully`);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
        onClose();
      }
    } catch (error) {
      console.error('Service operation error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Available Products Updated:', availableProducts);
  }, [availableProducts]);

  useEffect(() => {
    console.log('Form Data Updated:', formData);
  }, [formData]);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        description: '',
        products: {
          panel: { product: null, quantity: 1 },
          battery: { product: null, quantity: 1 },
          controller: { product: null, quantity: 1 },
          cable: { product: null, quantity: 1 }
        },
        laborCost: '',
        estimatedDuration: '',
        installationDate: ''
      });
      setTotalCost({
        products: {
          panel: 0,
          battery: 0,
          controller: 0,
          cable: 0
        },
        labor: 0,
        total: 0
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        description: service.description,
        products: {
          panel: {
            product: service.products.panel.product._id,
            quantity: service.products.panel.quantity
          },
          battery: {
            product: service.products.battery.product._id,
            quantity: service.products.battery.quantity
          },
          controller: {
            product: service.products.controller.product._id,
            quantity: service.products.controller.quantity
          },
          cable: {
            product: service.products.cable.product._id,
            quantity: service.products.cable.quantity
          }
        },
        laborCost: service.laborCost,
        estimatedDuration: service.estimatedDuration,
        installationDate: new Date(service.installationDate).toISOString().split('T')[0]
      });
    }
  }, [service, isOpen]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF'
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-lg shadow-lg m-4">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
              ×
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(80vh - 140px)' }}>
          <div className="space-y-6">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Service description"
                className="w-full"
              />
            </div>

            {/* Products Selection */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(availableProducts).map(([type, products]) => (
                  <div key={type} className="border rounded-lg p-4">
                    <h4 className="font-medium capitalize mb-2">{type}</h4>
                    <div className="space-y-2">
                      <Select
                        value={formData.products[type].product || ''}
                        onValueChange={(value) => handleProductChange(type, 'product', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${type}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name} - {formatPrice(product.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Quantity:</label>
                        <Input
                          type="number"
                          min="1"
                          value={formData.products[type].quantity}
                          onChange={(e) => handleProductChange(type, 'quantity', e.target.value)}
                          className="w-20"
                        />
                      </div>
                      <div className="text-sm text-gray-500">
                        Cost: {formatPrice(totalCost.products[type])}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Labor and Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Labor Cost (XAF)
                </label>
                <Input
                  type="number"
                  value={formData.laborCost}
                  onChange={(e) => handleLaborCostChange(e)}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Duration (days)
                </label>
                <Input
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                  min="1"
                />
              </div>
            </div>

            {/* Installation Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Date
              </label>
              <Input
                type="date"
                value={formData.installationDate}
                onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
              />
            </div>

            {/* Total Cost Summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-gray-900">Cost Summary</h3>
              <div className="space-y-1 text-sm">
                {Object.entries(totalCost.products).map(([type, cost]) => (
                  <div key={type} className="flex justify-between">
                    <span className="capitalize">{type}:</span>
                    <span>{formatPrice(cost)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span>Labor:</span>
                  <span>{formatPrice(totalCost.labor)}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatPrice(totalCost.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="sticky bottom-0 z-20 bg-white px-6 py-4 border-t">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-blue-900 text-white hover:bg-blue-800"
            >
              {loading ? 'Saving...' : (service ? 'Update Service' : 'Add Service')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;