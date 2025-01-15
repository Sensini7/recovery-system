import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/axios';
import { formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';
import ProductOrderDetails from './ProductOrderDetails';

const OrderCard = ({ order, onViewDetails }) => {
  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')}\u00A0FCFA`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'confirmed':
        return 'text-purple-600 bg-purple-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              #{order.orderId.substring(order.orderId.length - 6)}
            </h3>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Items */}
      <div className="p-4 flex-1">
        <div className="space-y-3">
          {order.items.map((item, index) => {
            const product = item.product || item.course;
            if (!product) return null;

            const unitPrice = product.price;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div key={index} className="text-sm">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-900">{product.name}</span>
                  <button
                    onClick={() => onViewDetails(product)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                
                {/* Category and Quantity Info */}
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      Category:
                    </span>
                    <span className="text-sm font-medium text-blue-500">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                      Quantity:
                    </span>
                    <span className="text-sm font-medium text-blue-500">
                      {item.quantity} units
                    </span>
                  </div>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Unit Price:</span>
                    <span className="text-sm text-gray-600">{formatPrice(unitPrice)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-xs font-medium ${
              order.paymentStatus === 'paid' ? 'text-green-600' : 
              order.paymentStatus === 'pending' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              Payment Status: {order.paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500">Total Amount:</span>
            <span className="text-sm font-semibold text-gray-900">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productOrders, setProductOrders] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders/my-orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (product) => {
    try {
      // Fetch all orders for this product
      const response = await api.get(`/api/orders/product/${product._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSelectedProduct(product);
        setProductOrders(response.data.data);
        setIsDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product orders:', error);
      toast.error('Failed to fetch product orders');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Start shopping to see your orders here.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard 
            key={order._id} 
            order={order}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      <ProductOrderDetails
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        product={selectedProduct}
        orders={productOrders}
      />
    </div>
  );
};

export default CustomerOrders;