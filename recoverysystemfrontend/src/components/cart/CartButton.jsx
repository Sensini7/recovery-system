import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/button';

const CartButton = ({ onClick }) => {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <Button
      variant="ghost"
      className="fixed top-4 right-4 z-40"
      onClick={onClick}
    >
      <div className="relative">
        <ShoppingBag className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-blue-900 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
        )}
      </div>
    </Button>
  );
};

export default CartButton; 