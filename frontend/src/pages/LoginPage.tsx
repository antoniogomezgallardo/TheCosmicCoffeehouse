import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-cyber text-4xl mb-4 animate-glow">
              🚀 Access Portal
            </h1>
            <p className="text-cosmic-cyan text-lg">
              Log in to access your cosmic coffee journey
            </p>
          </div>

          {/* Login Form */}
          <div className="card-holo p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-cosmic-plasma bg-opacity-20 border border-cosmic-plasma rounded p-4">
                  <p className="text-cosmic-plasma text-sm">⚠️ {error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="your.email@cosmic.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="Enter your cosmic password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-cyber font-bold transition-all ${
                  isLoading
                    ? 'bg-cosmic-common text-cosmic-common border border-cosmic-common opacity-50 cursor-not-allowed'
                    : 'btn-plasma hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Accessing Portal...
                  </span>
                ) : (
                  '🔓 Enter the Cosmic Realm'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-cosmic-cyan text-sm">
                New to the cosmic realm?{' '}
                <Link to="/register" className="text-cosmic-energy hover:text-cosmic-plasma transition-colors">
                  Create an account
                </Link>
              </p>
              <Link to="/" className="text-cosmic-cyan text-sm hover:text-cosmic-energy transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-cosmic-space bg-opacity-30 p-4 rounded-cyber">
            <h3 className="text-cosmic-energy font-bold mb-2 text-sm">🧪 Demo Credentials</h3>
            <div className="text-cosmic-cyan text-xs space-y-1">
              <p><strong>Email:</strong> john@cosmic.com</p>
              <p><strong>Password:</strong> Test123!@#</p>
              <p className="text-cosmic-cyan opacity-75 mt-2">
                Use these credentials to explore the cosmic coffee experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;