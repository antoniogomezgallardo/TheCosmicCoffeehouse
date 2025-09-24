import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
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
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [touchedFields, setTouchedFields] = useState<{[key: string]: boolean}>({});
  const [duplicateEmailError, setDuplicateEmailError] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear duplicate email error when user changes email
    if (name === 'email' && duplicateEmailError) {
      setDuplicateEmailError(false);
    }

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));

    // Validate single field on blur
    validateSingleField(name);
  };

  const validateSingleField = (fieldName: string) => {
    const errors: {[key: string]: string} = {};

    switch(fieldName) {
      case 'firstName':
        if (!formData.firstName.trim()) {
          errors.firstName = 'First name is required';
        }
        break;
      case 'lastName':
        if (!formData.lastName.trim()) {
          errors.lastName = 'Last name is required';
        }
        break;
      case 'username':
        if (!formData.username.trim()) {
          errors.username = 'Username is required';
        }
        break;
      case 'email':
        if (!formData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
          errors.email = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!formData.password) {
          errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
          errors.password = 'Password must be at least 8 characters long';
        }
        break;
      case 'confirmPassword':
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Password confirmation is required';
        } else if (formData.password && formData.confirmPassword !== formData.password) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;
    }

    if (errors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: errors[fieldName]
      }));
    } else {
      // Clear error if field is now valid
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Required field validation
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Password confirmation is required';
    }

    // Email format validation
    if (formData.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password length validation
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    }

    // Password match validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldClasses = (fieldName: string) => {
    const baseClasses = "w-full px-3 py-2 bg-cosmic-space rounded-cyber focus:outline-none text-cosmic-cyan placeholder-cosmic-cyan placeholder-opacity-50 transition-colors";
    const hasError = validationErrors[fieldName] && (attemptedSubmit || touchedFields[fieldName]);

    if (hasError) {
      return `${baseClasses} border-2 border-cosmic-plasma focus:border-cosmic-plasma validation-error`;
    } else {
      return `${baseClasses} border border-cosmic-cyan focus:border-cosmic-energy`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);
    setIsLoading(true);
    setError('');
    setSuccess('');
    setDuplicateEmailError(false);

    // Validate the form
    if (!validateForm()) {
      setError('Please fill in all required fields correctly');
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
      setSuccess('Registration successful! Redirecting to home...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';

      // Check if it's a duplicate email error
      if (errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('duplicate') ||
          errorMessage.toLowerCase().includes('already registered') ||
          errorMessage.toLowerCase().includes('email is taken')) {
        setDuplicateEmailError(true);
        setError('An account with this email already exists. Please use a different email or login to your existing account.');
      } else {
        setError(errorMessage);
      }
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
                <div
                  className="bg-cosmic-plasma bg-opacity-20 border border-cosmic-plasma rounded p-4"
                  data-testid={duplicateEmailError ? "duplicate-email-error" : "error-message"}
                >
                  <p className="text-cosmic-plasma text-sm">⚠️ {error}</p>
                  {duplicateEmailError && (
                    <p className="text-cosmic-plasma text-xs mt-2">
                      <a href="/login" className="underline hover:text-cosmic-energy">Click here to login</a> to your existing account
                    </p>
                  )}
                </div>
              )}

              {success && (
                <div className="bg-cosmic-neonGreen bg-opacity-20 border border-cosmic-neonGreen rounded p-4" data-testid="success-message">
                  <p className="text-cosmic-neonGreen text-sm">✅ {success}</p>
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
                    onBlur={handleBlur}
                    className={getFieldClasses('firstName')}
                    placeholder="John"
                    data-testid="first-name-input"
                  />
                  {validationErrors.firstName && (attemptedSubmit || touchedFields.firstName) && (
                    <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.firstName}</p>
                  )}
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
                    onBlur={handleBlur}
                    className={getFieldClasses('lastName')}
                    placeholder="Cosmic"
                    data-testid="last-name-input"
                  />
                  {validationErrors.lastName && (attemptedSubmit || touchedFields.lastName) && (
                    <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.lastName}</p>
                  )}
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
                  onBlur={handleBlur}
                  className={getFieldClasses('username')}
                  placeholder="cosmicwarrior"
                  data-testid="username-input"
                />
                {validationErrors.username && (attemptedSubmit || touchedFields.username) && (
                  <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.username}</p>
                )}
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
                  onBlur={handleBlur}
                  className={getFieldClasses('email')}
                  placeholder="john@cosmic.com"
                  data-testid="email-input"
                />
                {validationErrors.email && (attemptedSubmit || touchedFields.email) && (
                  <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.email}</p>
                )}
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
                  onBlur={handleBlur}
                  className={getFieldClasses('password')}
                  placeholder="Minimum 8 characters"
                  data-testid="password-input"
                />
                {validationErrors.password && (attemptedSubmit || touchedFields.password) && (
                  <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.password}</p>
                )}
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
                  onBlur={handleBlur}
                  className={getFieldClasses('confirmPassword')}
                  placeholder="Confirm your password"
                  data-testid="confirm-password-input"
                />
                {validationErrors.confirmPassword && (attemptedSubmit || touchedFields.confirmPassword) && (
                  <p className="text-cosmic-plasma text-xs mt-1 validation-error">{validationErrors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-cyber font-bold transition-all ${
                  isLoading
                    ? 'bg-cosmic-common text-cosmic-common border border-cosmic-common opacity-50 cursor-not-allowed'
                    : 'btn-neon hover:shadow-lg'
                }`}
                data-testid="submit-button"
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