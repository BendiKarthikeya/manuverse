import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Mail, Phone, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// Supabase client
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const AuthPage = ({ onUserAuth, onPageChange }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [session, setSession] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    // Check for existing session
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                handleUserAuthenticated(session);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                if (session && event === 'SIGNED_IN') {
                    handleUserAuthenticated(session);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const handleUserAuthenticated = (session) => {
        onUserAuth({
            id: session.user.id,
            email: session.user.email,
            phone: session.user.user_metadata?.phone || session.user.phone,
            full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
            provider: session.user.app_metadata?.provider
        });
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const validateForm = () => {
        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            return false;
        }

        if (!isLogin) {
            if (!formData.fullName) {
                setError('Full name is required for signup');
                return false;
            }

            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }

            if (formData.password.length < 6) {
                setError('Password must be at least 6 characters');
                return false;
            }
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                // Login
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;
            } else {
                // Signup with custom metadata
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            phone: formData.phone,
                        }
                    }
                });

                if (error) throw error;

                if (data.user && !data.user.email_confirmed_at) {
                    setError('Please check your email and click the confirmation link to complete signup!');
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Google Sign In [web:304][web:306]
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/callback'
                }
            });

            if (error) throw error;
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-manu-light to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">

                {/* Back Button */}
                <button
                    onClick={() => onPageChange('landing')}
                    className="flex items-center text-manu-dark hover:text-manu-green transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Home
                </button>

                {/* Header */}
                <div className="text-center">
                    <img
                        src="/logos/manudocs_logo.jpg"
                        alt="MANUDOCS"
                        className="h-12 w-auto mx-auto mb-4"
                    />
                    <h2 className="text-3xl font-bold text-manu-dark">
                        {isLogin ? 'Welcome back!' : 'Create your account'}
                    </h2>
                    <p className="mt-2 text-gray-600">
                        {isLogin
                            ? 'Sign in to access your export documentation dashboard'
                            : 'Join MANUDOCS and streamline your export processes'
                        }
                    </p>
                </div>

                {/* Google Sign In Button */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manu-green disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                </div>

                {/* Email Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">

                        {/* Full Name - Signup only */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Full Name *
                                </label>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required={!isLogin}
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-manu-green focus:border-manu-green"
                                    placeholder="Enter your full name"
                                />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address *
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-manu-green focus:border-manu-green"
                                    placeholder="Enter your email"
                                />
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Phone - Signup only (stored in metadata) */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                    Phone Number (Optional)
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-manu-green focus:border-manu-green"
                                        placeholder="+91 98765 43210"
                                    />
                                    <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    We'll store this for document processing notifications
                                </p>
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password *
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-manu-green focus:border-manu-green"
                                    placeholder={isLogin ? "Enter your password" : "Create a password (min 6 chars)"}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password - Signup only */}
                        {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm Password *
                                </label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-manu-green focus:border-manu-green"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-manu-green hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-manu-green disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            isLogin ? 'Sign In' : 'Create Account'
                        )}
                    </button>

                    {/* Toggle Login/Signup */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setFormData({
                                    email: '',
                                    phone: '',
                                    password: '',
                                    confirmPassword: '',
                                    fullName: ''
                                });
                            }}
                            className="text-manu-green hover:text-green-600 text-sm font-medium"
                        >
                            {isLogin
                                ? "Don't have an account? Sign up"
                                : "Already have an account? Sign in"
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;
