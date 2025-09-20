import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Registration failed');
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
              🌟 Join the Cosmic Realm
            </h1>
            <p className="text-cosmic-cyan text-lg">
              Create your account to unlock supernatural coffee powers
            </p>
          </div>

          {/* Registration Form */}
          <div className="card-holo p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-cosmic-plasma bg-opacity-20 border border-cosmic-plasma rounded p-4">
                  <p className="text-cosmic-plasma text-sm">⚠️ {error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-cosmic-cyan text-sm font-bold mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-cosmic-cyan text-sm font-bold mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                    placeholder="Cosmic"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="cosmicwarrior"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="john@cosmic.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-cosmic-cyan text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-cosmic-space border border-cosmic-cyan rounded-cyber focus:outline-none focus:border-cosmic-energy text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50"
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-cyber font-bold transition-all ${
                  isLoading
                    ? 'bg-cosmic-common text-cosmic-common border border-cosmic-common opacity-50 cursor-not-allowed'
                    : 'btn-neon hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  '✨ Activate Cosmic Powers'
                )}
              </button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-cosmic-cyan text-sm">
                Already have cosmic powers?{' '}
                <Link to="/login" className="text-cosmic-energy hover:text-cosmic-plasma transition-colors">
                  Sign in here
                </Link>
              </p>
              <Link to="/" className="text-cosmic-cyan text-sm hover:text-cosmic-energy transition-colors">
                ← Back to Homepage
              </Link>
            </div>
          </div>

          {/* Power Level Info */}
          <div className="bg-cosmic-space bg-opacity-30 p-4 rounded-cyber">
            <h3 className="text-cosmic-energy font-bold mb-2 text-sm">⚡ New User Benefits</h3>
            <ul className="text-cosmic-cyan text-xs space-y-1">
              <li>• Starting Power Level: 1</li>
              <li>• Access to all common capsules</li>
              <li>• Beginner-friendly machine compatibility</li>
              <li>• Power level increases with experience</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;