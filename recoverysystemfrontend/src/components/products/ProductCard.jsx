import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { Plus, Minus } from "lucide-react"
import CheckoutModal from './CheckoutModal';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const getSpecifications = () => {
    const specs = [];
    const { specifications } = product;

    switch (product.category) {
      case 'panel':
        if (specifications.wattage) specs.push(`Wattage: ${specifications.wattage}W`);
        if (specifications.voltage) specs.push(`Voltage: ${specifications.voltage}V`);
        if (specifications.dimensions) {
          specs.push(`Dimensions: ${specifications.dimensions.length}x${specifications.dimensions.width}m`);
        }
        if (specifications.weight) specs.push(`Weight: ${specifications.weight}kg`);
        break;
      case 'battery':
        if (specifications.capacity) specs.push(`Capacity: ${specifications.capacity}Ah`);
        if (specifications.voltage) specs.push(`Voltage: ${specifications.voltage}V`);
        if (specifications.chemistry) specs.push(`Type: ${specifications.chemistry}`);
        break;
      case 'controller':
        if (specifications.maxCurrent) specs.push(`Max Current: ${specifications.maxCurrent}A`);
        if (specifications.systemVoltage) specs.push(`System Voltage: ${specifications.systemVoltage}V`);
        break;
      case 'cable':
        if (specifications.length) specs.push(`Length: ${specifications.length}m`);
        if (specifications.wireGauge) specs.push(`Wire Gauge: ${specifications.wireGauge}`);
        break;
      default:
        break;
    }

    return specs;
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleBuyClick = () => {
    setIsCheckoutModalOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Added to cart');
  };

  const specifications = getSpecifications();

  return (
    <>
      <Card className="w-full max-w-sm hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-blue-900">{product.name}</CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                <span className="inline-block px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  Category: {product.category}
                </span>
              </CardDescription>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              !product.quantity || product.quantity === 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'
            }`}>
              {!product.quantity || product.quantity === 0 
                ? 'Out of stock' 
                : `${product.quantity} units left`}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500">Description:</label>
              <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            </div>
            
            {specifications.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Specifications:</label>
                <ul className="list-none space-y-1">
                  {specifications.map((spec, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4">
              <p className="text-lg font-semibold text-blue-900">{formatPrice(product.price)}</p>
            </div>

            {/* Quantity Controls */}
            {product.quantity > 0 && (
              <div className="flex items-center space-x-4 mt-4">
                <label className="text-sm font-medium text-gray-600">Quantity:</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.quantity}
                    className="h-8 w-8"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between space-x-4 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!product.quantity}
          >
            Add to Cart
          </Button>
          <Button
            className="flex-1"
            onClick={handleBuyClick}
            disabled={!product.quantity}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        product={product}
        quantity={quantity}
      />
    </>
  );
};

export default ProductCard;
