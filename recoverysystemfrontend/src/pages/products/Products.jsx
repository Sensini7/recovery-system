import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import ProductModal from '../../components/products/ProductModal';
import { DataTable } from '../../components/ui/data-table';
import { columns } from './columns';
import { Button } from '../../components/ui/button';
import { Plus } from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import { useCart } from '../../context/CartContext';

const Products = () => {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const isAdmin = user?.role === 'admin';

  // Get columns based on user role
  const getColumns = () => {
    if (isAdmin) {
      return columns({ 
        onEdit: handleEditProduct, 
        onDelete: handleDeleteProduct 
      });
    }
    // Customer view columns (no actions column)
    return columns().filter(column => column.id !== 'actions');
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      console.log('Fetched products:', response);
      
      if (!response || response.length === 0) {
        setError('No products available');
        setProducts([]);
      } else {
        setProducts(response);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      toast.error('Could not load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Update local product stock based on cart items
    setProducts(prevProducts => 
      prevProducts.map(product => {
        const cartItem = cartItems.find(item => item.product._id === product._id);
        return cartItem 
          ? { ...product, quantityInStock: cartItem.product.quantityInStock }
          : product;
      })
    );
  }, [cartItems]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(product._id);
        toast.success('Product deleted successfully');
        await fetchProducts();
      } catch (error) {
        toast.error(error.message || 'Failed to delete product');
      }
    }
  };

  const handleModalSubmit = async (productData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      
      await fetchProducts();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error; // Propagate error to modal for handling
    }
  };

  const renderProducts = () => {
    if (isAdmin) {
      return (
        <div className="bg-white rounded-md shadow">
          <DataTable 
            columns={getColumns()} 
            data={products}
          />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        {isAdmin && (
          <Button onClick={handleAddProduct} className="bg-blue-900 text-white">
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}

      {renderProducts()}

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleModalSubmit}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products; 