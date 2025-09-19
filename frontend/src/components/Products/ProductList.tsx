import React from 'react';
import ProductCard from './ProductCard';

interface ProductListProps {
  products: any[];
  type: 'capsule' | 'machine';
  title?: string;
  isLoading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  type,
  title,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card-holo animate-pulse">
            <div className="bg-cosmic-space h-48 rounded-cyber mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-cosmic-space rounded w-3/4"></div>
              <div className="h-3 bg-cosmic-space rounded w-1/2"></div>
              <div className="h-3 bg-cosmic-space rounded"></div>
              <div className="flex justify-between">
                <div className="h-6 bg-cosmic-space rounded w-20"></div>
                <div className="h-8 bg-cosmic-space rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-cosmic-cyan text-6xl mb-4">🚀</div>
        <h3 className="text-cyber text-xl mb-2">No {type}s Found</h3>
        <p className="text-cosmic-cyan">
          Check back later for new superpower {type}s!
        </p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="mb-8">
          <h2 className="text-cyber text-3xl mb-2">{title}</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-cosmic-cyan to-cosmic-neonGreen"></div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            type={type}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;