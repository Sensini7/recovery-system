import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import api from '../../lib/axios';
import toast from 'react-hot-toast';

const ProductModal = ({ isOpen, onClose, onSuccess, product = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    specifications: {}, // Initialize as empty object
    images: []
  });

  // Effect to update form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        category: product.category || '',
        specifications: product.specifications || {},
        images: product.images || []
      });
    }
  }, [product]);

  const [loading, setLoading] = useState(false);

  const categories = [
    'Solar Panel',
    'Battery',
    'Controller',
    'Cable',
    'Other'
  ];

  const categoryDescriptions = {
    'Solar Panel': 'Photovoltaic panels for converting solar energy to electricity',
    'Battery': 'Energy storage devices for solar power systems',
    'Controller': 'Charge controllers for managing solar power systems',
    'Cable': 'Electrical cables for solar installations',
    'Other': 'Other solar power system components'
  };

  const specificationDescriptions = {
    manufacturer: 'Company that manufactured the product',
    model: 'Product model number or name',
    warranty: 'Warranty period and terms',
    wattage: 'Power output in watts (W)',
    voltage: 'Operating voltage (V)',
    dimensions: 'Physical dimensions (L x W x H)',
    capacity: 'Storage capacity in amp-hours (Ah)',
    type: 'Type of battery (e.g., Lithium, AGM)',
    maxCurrent: 'Maximum current rating in amperes (A)',
    features: 'Special features and capabilities',
    length: 'Cable length in meters (m)',
    gauge: 'Wire gauge (AWG)',
    material: 'Cable material composition'
  };

  const getInputType = (field) => {
    const numberFields = ['wattage', 'voltage', 'capacity', 'maxCurrent', 'length'];
    return numberFields.includes(field) ? 'number' : 'text';
  };

  // Helper function to get specification fields based on category
  const getSpecFields = () => {
    const baseSpecs = {
      manufacturer: formData.specifications?.manufacturer || '',
      model: formData.specifications?.model || '',
      warranty: formData.specifications?.warranty || ''
    };

    switch (formData.category) {
      case 'Solar Panel':
        return {
          ...baseSpecs,
          wattage: formData.specifications?.wattage || '',
          voltage: formData.specifications?.voltage || '',
          dimensions: formData.specifications?.dimensions || ''
        };
      case 'Battery':
        return {
          ...baseSpecs,
          capacity: formData.specifications?.capacity || '',
          voltage: formData.specifications?.voltage || '',
          type: formData.specifications?.type || ''
        };
      case 'Controller':
        return {
          ...baseSpecs,
          maxCurrent: formData.specifications?.maxCurrent || '',
          voltage: formData.specifications?.voltage || '',
          features: formData.specifications?.features || ''
        };
      case 'Cable':
        return {
          ...baseSpecs,
          length: formData.specifications?.length || '',
          gauge: formData.specifications?.gauge || '',
          material: formData.specifications?.material || ''
        };
      default:
        return baseSpecs;
    }
  };

  const handleSpecChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.category || !formData.price || !formData.quantity) {
        throw new Error('Please fill in all required fields');
      }

      // Validate price and quantity
      if (parseFloat(formData.price) < 0) {
        throw new Error('Price cannot be negative');
      }
      if (parseInt(formData.quantity) < 0) {
        throw new Error('Quantity cannot be negative');
      }

      // Submit form data
      await onSuccess(formData);
      toast.success(product ? 'Product updated successfully' : 'Product added successfully');
      onClose();
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error(error.message || 'Failed to save product. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="relative w-full max-w-2xl max-h-[80vh] bg-white rounded-lg shadow-lg m-4">
          {/* Sticky Header */}
          <div className="sticky top-0 z-20 bg-white px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {product ? 'Edit Product' : 'Add New Product'}
              </h2>
              <Button variant="ghost" onClick={onClose} className="h-8 w-8 p-0">
                ×
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(80vh - 140px)' }}>
            <div className="space-y-4">
              {/* Basic Info Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Product name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter product description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.category && (
                    <p className="mt-1 text-sm text-gray-500">
                      {categoryDescriptions[formData.category]}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price (XAF)</label>
                    <Input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      min="0"
                      step="1"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications Section */}
              {formData.category && (
                <div className="space-y-4 pt-4">
                  <h3 className="font-medium text-gray-900 border-t pt-4">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(getSpecFields()).map(([field, value]) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </label>
                        <Input
                          type={getInputType(field)}
                          value={value}
                          onChange={(e) => handleSpecChange(field, e.target.value)}
                          placeholder={`Enter ${field.toLowerCase()}`}
                          className="mt-1"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          {specificationDescriptions[field]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                {loading ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default ProductModal;