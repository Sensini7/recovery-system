import { useState, useEffect } from 'react';
import { getMyOrders } from '../../services/orderService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Package, BookOpen } from 'lucide-react';

const PurchasedProducts = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'product', 'course'

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders();
        if (response.success) {
          setOrders(response.data);
        } else {
          toast.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error(error.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.orderType === filter;
  });

  const getStatusColor = (status, type) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Purchases</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('product')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              filter === 'product' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Package className="h-4 w-4" />
            Products
          </button>
          <button
            onClick={() => setFilter('course')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              filter === 'course' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Courses
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {order.orderType === 'product' ? (
                    <Package className="h-5 w-5 text-gray-500" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-gray-500" />
                  )}
                  <span className="font-medium capitalize">
                    {order.orderType}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Order Date: {format(new Date(order.createdAt), 'PPP')}
                </p>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  getStatusColor(order.status)
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  getStatusColor(order.paymentStatus)
                }`}>
                  Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-t pt-4">
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'XAF',
                      minimumFractionDigits: 0
                    }).format(item.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Total Amount:</span>
                <span className="font-bold text-lg">
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'XAF',
                    minimumFractionDigits: 0
                  }).format(order.totalAmount)}
                </span>
              </div>
              {order.orderType === 'product' && (
                <p className="text-sm text-gray-600">
                  Delivery to: {order.client.location}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      {filteredOrders.length === 0 && (
        <p className="text-center text-gray-500">
          {filter === 'all' 
            ? "You haven't made any purchases yet."
            : `No ${filter} orders found.`}
        </p>
      )}
    </div>
  );
};

export default PurchasedProducts; 