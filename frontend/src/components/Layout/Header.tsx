import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="nav-cosmic fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-cyber text-cosmic-cyan text-glow">
              ☕ The Cosmic Coffeehouse
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a
              href="/"
              className="text-cosmic-cyan hover:text-cosmic-neonGreen transition-colors"
            >
              Home
            </a>
            <a
              href="/capsules"
              className="text-cosmic-cyan hover:text-cosmic-neonGreen transition-colors"
            >
              Capsules
            </a>
            <a
              href="/machines"
              className="text-cosmic-cyan hover:text-cosmic-neonGreen transition-colors"
            >
              Machines
            </a>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button className="relative p-2 text-cosmic-cyan hover:text-cosmic-neonGreen transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5-6.5m0 0L5.4 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-cosmic-plasma text-cosmic-void text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-cosmic-cyan hover:text-cosmic-neonGreen transition-colors"
                >
                  <span className="text-sm">
                    {user.firstName}
                    <span className="text-cosmic-energy ml-1">
                      (Lv.{user.powerLevel})
                    </span>
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 card-holo">
                    <div className="py-1">
                      <a href="/profile" className="block px-4 py-2 text-sm text-cosmic-cyan hover:text-cosmic-neonGreen">
                        Profile
                      </a>
                      <a href="/orders" className="block px-4 py-2 text-sm text-cosmic-cyan hover:text-cosmic-neonGreen">
                        Orders
                      </a>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-cosmic-cyan hover:text-cosmic-neonGreen"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-2">
                <button className="btn-neon px-4 py-2">
                  Login
                </button>
                <button className="btn-plasma px-4 py-2">
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;