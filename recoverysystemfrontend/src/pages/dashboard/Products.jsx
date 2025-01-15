import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../lib/axios';
import ProductCard from '../../components/products/ProductCard';

const Products = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.get('/api/orders/my-purchases');
        if (response.data.success) {
          setPurchases(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching purchases:', error);
        setError(error.response?.data?.message || 'Failed to fetch purchases');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPurchases();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Purchases</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (purchases.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Purchases</h2>
        <p className="text-gray-600">You haven't made any purchases yet.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">My Purchases</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.map(product => (
          <ProductCard 
            key={product._id} 
            product={product}
            isPurchased={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Products;
