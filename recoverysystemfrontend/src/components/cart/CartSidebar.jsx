import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { createProductOrder } from '../../services/orderService';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Input } from '../ui/input';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, updateProductStock } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.address || ''
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  // Update form data when user data becomes available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.address || ''
      });
    }
  }, [user]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      // If not authenticated and not in checkout mode, show form
      if (!isAuthenticated && !isCheckingOut) {
        setIsCheckingOut(true);
        return;
      }

      setLoading(true);

      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        // For authenticated users, just send email to help backend lookup
        ...(isAuthenticated ? {
          email: user.email
        } : {
          // For non-authenticated users, send all info
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location
        })
      };

      const response = await createProductOrder(orderData);
      
      if (response.success) {
        // Update local stock for each product in the cart
        cartItems.forEach(item => {
          const newStock = item.product.quantityInStock - item.quantity;
          updateProductStock(item.product._id, newStock);
        });

        clearCart();
        onClose();
        setIsCheckingOut(false);
        toast.success('Order placed successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <ShoppingBag className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full"
            disabled={loading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center gap-4 p-2 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={item.product.quantityInStock}
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.product._id, parseInt(e.target.value))}
                      className="w-16 p-1 border rounded text-center"
                      disabled={loading}
                    />
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      disabled={loading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Form for Non-authenticated Users */}
        {isCheckingOut && !isAuthenticated && (
          <div className="p-4 border-t">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total:</span>
            <span className="font-semibold">{formatPrice(getCartTotal())}</span>
          </div>
          <Button
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
          >
            {loading ? 'Processing...' : isCheckingOut && !isAuthenticated ? 'Complete Purchase' : 'Checkout'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar; 