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

const QuantityModal = ({ isOpen, onClose, product, onAddToCart, onBuyNow }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.quantityInStock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(quantity);
    onClose();
    setQuantity(1);
  };

  const handleBuyNow = () => {
    onBuyNow(quantity);
    onClose();
    setQuantity(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Quantity</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Available: {product.quantityInStock} units</p>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={product.quantityInStock}
            />
          </div>
          <div className="text-sm text-gray-600">
            Total: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'XAF',
              minimumFractionDigits: 0,
            }).format(product.price * quantity)}
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Buy Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityModal; 