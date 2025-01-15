import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { createProductOrder } from '../../services/orderService';
import toast from 'react-hot-toast';

const CheckoutModal = ({ isOpen, onClose, product, quantity, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.address || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const orderData = {
        items: [{
          product: product._id,
          quantity
        }],
        ...formData
      };

      await createProductOrder(orderData);
      toast.success('Order placed successfully');
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Purchase</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label>Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!!user}
              required
            />
          </div>
          <div className="grid gap-2">
            <label>Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!!user}
              required
            />
          </div>
          <div className="grid gap-2">
            <label>Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!!user}
              required
            />
          </div>
          <div className="grid gap-2">
            <label>Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              disabled={!!user}
              required
            />
          </div>
          <div className="text-right text-sm text-gray-600">
            Total: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'XAF',
              minimumFractionDigits: 0,
            }).format(product.price * quantity)}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Complete Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal; 