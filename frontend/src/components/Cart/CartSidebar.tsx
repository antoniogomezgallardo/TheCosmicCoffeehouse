import React from 'react';
import { useCart } from '../../contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Simple checkout - just navigate to checkout page
    window.location.href = '/checkout';
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-cosmic-space border-l border-cosmic-cyan z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cosmic-cyan">
            <h2 className="text-cyber text-xl">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="text-cosmic-cyan hover:text-cosmic-neonGreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-cosmic-cyan text-4xl mb-4">🛒</div>
                <p className="text-cosmic-cyan">Your cart is empty</p>
                <p className="text-sm text-cosmic-cyan opacity-75 mt-2">
                  Add some superpower products to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product._id || item.product.id} className="flex items-center space-x-4 p-4 border border-cosmic-cyan border-opacity-20 rounded-cyber">
                    <img
                      src={item.product.imageUrl || '/images/placeholder.jpg'}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="text-cosmic-cyan font-semibold">{item.product.name}</h4>
                      <p className="text-cosmic-energy">${item.product.price}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product._id || item.product.id, item.quantity - 1)}
                          className="w-6 h-6 bg-cosmic-space border border-cosmic-cyan text-cosmic-cyan rounded text-sm hover:bg-cosmic-cyan hover:text-cosmic-void"
                        >
                          -
                        </button>
                        <span className="text-cosmic-cyan">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product._id || item.product.id, item.quantity + 1)}
                          className="w-6 h-6 bg-cosmic-space border border-cosmic-cyan text-cosmic-cyan rounded text-sm hover:bg-cosmic-cyan hover:text-cosmic-void"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product._id || item.product.id)}
                      className="text-cosmic-plasma hover:text-cosmic-energy"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-cosmic-cyan p-6 space-y-4">
              <div className="flex items-center justify-between text-cyber text-xl">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full btn-plasma py-3"
                >
                  Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full btn-neon py-2 text-sm"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;