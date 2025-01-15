import React from 'react';
import { Dialog } from "../ui/dialog";
import { Table } from "../ui/table";

const ProductOrderDetails = ({ isOpen, onClose, product, orders }) => {
  if (!product || !orders) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] m-4 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold">
              Orders for {product.name}
            </h2>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <h3 className="font-medium">Product Details</h3>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Price:</span> {formatPrice(product.price)}</p>
                  <p><span className="font-medium">Stock:</span> {product.quantity} units</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Specifications</h3>
                <div className="text-sm space-y-1">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <p key={key}>
                      <span className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>{' '}
                      {value}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Orders */}
            <div>
              <h3 className="font-medium mb-2">Customer Orders</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-left">Location</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Total</th>
                      <th className="px-4 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="px-4 py-2">{order.customer.name}</td>
                        <td className="px-4 py-2">
                          <div>{order.customer.email}</div>
                          <div className="text-sm text-gray-500">{order.customer.phone}</div>
                        </td>
                        <td className="px-4 py-2">{order.shippingAddress}</td>
                        <td className="px-4 py-2">{order.quantity}</td>
                        <td className="px-4 py-2">{formatPrice(order.totalAmount)}</td>
                        <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductOrderDetails;
