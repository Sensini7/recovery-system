import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from '../ui/button';
import { Badge } from "../ui/badge";
import { CalendarIcon, Clock, Wrench, Banknote, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { useAuth } from '../../context/AuthContext';

const ServiceCard = ({ service, onEdit, onDelete, onOrder }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Convert products object to array for mapping
  const productsList = Object.entries(service.products).map(([type, item]) => ({
    type,
    ...item
  }));

  const getProductColor = (type) => {
    const colors = {
      panel: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      battery: 'bg-green-100 text-green-800 border-green-200',
      controller: 'bg-blue-100 text-blue-800 border-blue-200',
      cable: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Handle edit with error checking
  const handleEdit = (e) => {
    e.preventDefault(); // Prevent event bubbling
    console.log('Edit button clicked for service:', service._id);
    try {
      if (typeof onEdit !== 'function') {
        throw new Error('Edit handler is not properly configured');
      }
      onEdit(service);
    } catch (error) {
      console.error('Edit error:', error);
      toast.error('Unable to edit service');
    }
  };

  // Handle delete with error checking
  const handleDelete = (e) => {
    e.preventDefault(); // Prevent event bubbling
    console.log('Delete button clicked for service:', service._id);
    try {
      if (typeof onDelete !== 'function') {
        throw new Error('Delete handler is not properly configured');
      }
      onDelete(service._id);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Unable to delete service');
    }
  };

  const handleOrder = (e) => {
    e.preventDefault();
    console.log('Order button clicked for service:', service._id);
    try {
      if (typeof onOrder !== 'function') {
        throw new Error('Order handler is not properly configured');
      }
      onOrder(service);
    } catch (error) {
      console.error('Order error:', error);
      toast.error('Unable to process order request');
    }
  };

  return (
    <Card className="overflow-hidden border-2 hover:border-blue-500 transition-all duration-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-blue-600" />
          Solar Installation Service
        </CardTitle>
        <CardDescription className="text-gray-600">
          {service.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Products</h4>
          <div className="grid gap-2">
            {productsList.map(({ type, product, quantity }) => (
              <div key={type} className={`flex justify-between items-center p-2 rounded-lg border ${getProductColor(type)}`}>
                <span className="capitalize font-medium">{type}</span>
                <Badge variant="outline" className="ml-2">
                  {product?.name} × {quantity}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-green-700 bg-green-50 p-2 rounded-lg">
            <Banknote className="h-4 w-4" />
            <div>
              <p className="text-xs">Labor Cost</p>
              <p className="font-semibold">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF'
                }).format(service.laborCost)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-2 rounded-lg">
            <Banknote className="h-4 w-4" />
            <div>
              <p className="text-xs">Total Cost</p>
              <p className="font-semibold">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'XAF'
                }).format(service.totalCost)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-orange-700">
            <CalendarIcon className="h-4 w-4" />
            <div>
              <p className="text-xs">Installation Date</p>
              <p className="font-medium">
                {new Date(service.installationDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-purple-700">
            <Clock className="h-4 w-4" />
            <div>
              <p className="text-xs">Duration</p>
              <p className="font-medium">{service.estimatedDuration}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 gap-2 justify-end">
        {isAdmin ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="hover:bg-red-600"
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={handleOrder}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order Service
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    products: PropTypes.object.isRequired,
    laborCost: PropTypes.number.isRequired,
    totalCost: PropTypes.number.isRequired,
    installationDate: PropTypes.string.isRequired,
    estimatedDuration: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onOrder: PropTypes.func,
};

export default ServiceCard;
