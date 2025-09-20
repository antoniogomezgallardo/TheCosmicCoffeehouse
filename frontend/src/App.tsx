import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage';
import CapsulesPage from './pages/CapsulesPage';
import MachinesPage from './pages/MachinesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartSidebar from './components/Cart/CartSidebar';
import { useCart } from './contexts/CartContext';

function AppContent() {
  const { isCartOpen, openCart, closeCart } = useCart();

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/capsules" element={<CapsulesPage />} />
          <Route path="/machines" element={<MachinesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>

        <CartSidebar
          isOpen={isCartOpen}
          onClose={closeCart}
        />

        {/* Floating Cart Button */}
        <button
          onClick={openCart}
          className="fixed bottom-6 right-6 btn-plasma p-4 rounded-full shadow-lg z-40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6.5M7 13l-1.5-6.5m0 0L5.4 5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
          </svg>
        </button>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App
