import React, { useState } from 'react';
import { useCart } from '../../hooks/useCart';
import type { SuperpowerCapsule, FuturisticMachine } from '../../types';

interface ProductCardProps {
  product: SuperpowerCapsule | FuturisticMachine;
  type: 'capsule' | 'machine';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, type }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getPowerTypeClass = (powerType: string) => {
    return `power-${powerType}`;
  };

  const getRarityClass = (rarity: string) => {
    return `rarity-${rarity}`;
  };

  return (
    <div className="card-holo transform hover:scale-105 transition-all duration-300">
      {/* Product Image */}
      <div className="relative mb-4">
        <img
          src={!imageError && product.imageUrl ? product.imageUrl : '/images/placeholder.svg'}
          alt={product.name}
          className="w-full h-48 object-cover rounded-cyber"
          onError={() => {
            if (!imageError) {
              setImageError(true);
            }
          }}
        />
        {type === 'capsule' && (
          <span className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${getRarityClass((product as SuperpowerCapsule).rarity)} border`}>
            {(product as SuperpowerCapsule).rarity.toUpperCase()}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-cyber text-lg font-bold">{product.name}</h3>

        {type === 'capsule' ? (
          <>
            <p className={`text-sm ${getPowerTypeClass((product as SuperpowerCapsule).powerType)}`}>
              {(product as SuperpowerCapsule).superpower}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cosmic-cyan">Duration: {(product as SuperpowerCapsule).duration}</span>
              <span className="text-cosmic-energy">Intensity: {(product as SuperpowerCapsule).intensity}/10</span>
            </div>
          </>
        ) : (
          <>
            <p className="text-cosmic-cyan text-sm">{(product as FuturisticMachine).model}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-cosmic-cyan">Type: {(product as FuturisticMachine).type}</span>
              <span className="text-cosmic-energy">Power: {(product as FuturisticMachine).specifications.maxPowerOutput}</span>
            </div>
          </>
        )}

        <p className="text-cosmic-cyan text-sm line-clamp-2">{product.description}</p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-cosmic-cyan border-opacity-20">
          <span className="text-xl font-bold text-cosmic-energy">
            ${product.price.toLocaleString()}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-cosmic-cyan">
              {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === 0}
              className={`px-4 py-2 text-sm font-bold rounded-cyber transition-all ${
                product.inStock > 0
                  ? 'btn-neon hover:shadow-lg'
                  : 'bg-cosmic-common text-cosmic-common border border-cosmic-common opacity-50 cursor-not-allowed'
              }`}
            >
              {product.inStock > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {type === 'capsule' && (product as SuperpowerCapsule).warnings && (product as SuperpowerCapsule).warnings.length > 0 && (
          <div className="text-xs text-cosmic-plasma">
            ⚠️ {(product as SuperpowerCapsule).warnings[0]}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;