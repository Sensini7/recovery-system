      {/* Category and Stock Info */}
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
            Stock:
          </span>
          <span className="text-sm font-medium text-green-500">
            {product.quantityInStock} units
          </span>
        </div>
      </div>
