import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';

const googleProvider = new GoogleAuthProvider();

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // Handle successful authentication
  const handleAuthSuccess = (user) => {
    // Check if email is verified
    if (user && !user.emailVerified) {
      // If not verified, show verification message
      setVerificationEmail(user.email);
      setVerificationSent(true);
      // Sign out the user until they verify their email
      auth.signOut();
      toast.warning('Please verify your email before signing in. A verification email has been sent.');
      return false;
    }
    // The auth state change in AppContext will handle the redirect
    console.log('Auth successful, waiting for state update...');
    return true;
  };

  // Send verification email
  const sendVerificationEmail = async (user) => {
    try {
      await sendEmailVerification(user);
      setVerificationEmail(user.email);
      setVerificationSent(true);
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email. Please try again.');
    }
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setIsLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      toast.error(error.message || 'Failed to send password reset email');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendVerification = async () => {
    if (!verificationEmail) return;
    
    try {
      setIsLoading(true);
      const user = auth.currentUser;
      if (user) {
        await sendVerificationEmail(user);
      } else {
        toast.error('Please sign in again to resend verification email.');
      }
    } catch (error) {
      console.error('Error resending verification:', error);
      toast.error('Failed to resend verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle Google Sign In with Popup
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      console.log('Initiating Google sign-in with popup...');
      
      // Set custom parameters for the Google OAuth consent screen
      googleProvider.setCustomParameters({
        prompt: 'select_account',
        login_hint: '' // Clear any cached email
      });
      
      // Add scopes
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      
      // Sign in with popup
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user);
      
      // Check if user document exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log('Creating new user document for Google user:', user.uid);
        try {
          await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName || user.email.split('@')[0],
            email: user.email,
            photoURL: user.photoURL || null,
            createdAt: serverTimestamp(),
            role: 'user',
            emailVerified: user.emailVerified,
            provider: 'google.com',
            lastLogin: serverTimestamp()
          });
          console.log('New Google user document created');
          toast.success('Account created successfully!');
        } catch (docError) {
          console.error('Error creating user document:', docError);
          throw new Error('Failed to create user profile');
        }
      } else {
        console.log('Existing Google user signed in:', user.uid);
        // Update last login time
        await setDoc(userDocRef, {
          lastLogin: serverTimestamp()
        }, { merge: true });
      }
      
      // The auth state change in AppContext will handle the redirect
      console.log('Google authentication completed successfully');
      
    } catch (error) {
      console.error('Google sign-in error details:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential,
        stack: error.stack
      });
      
      let errorMessage = 'Failed to sign in with Google. ';
      
      switch (error.code) {
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with the same email but different sign-in credentials.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign in was cancelled.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Only one popup request is allowed at one time.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'The sign-in popup was blocked by the browser. Please allow popups for this site.';
          break;
        default:
          errorMessage += error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle any cleanup on component unmount
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isLogin) {
        // Handle login
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        console.log('Email login successful', userCredential.user);
        
        // Check if email is verified
        if (!userCredential.user.emailVerified) {
          await sendVerificationEmail(userCredential.user);
          auth.signOut();
          toast.warning('Please verify your email before signing in. A new verification email has been sent.');
          return;
        }
        
        toast.success('Successfully signed in!');
      } else {
        // Handle signup
        try {
          // 1. Create user with email/password
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          
          // 2. Update user profile with display name
          await updateProfile(userCredential.user, {
            displayName: formData.name,
          });
          
          // 3. Send verification email
          await sendVerificationEmail(userCredential.user);
          
          // 4. Create user document in Firestore
          const userDoc = {
            uid: userCredential.user.uid,
            displayName: formData.name,
            email: userCredential.user.email,
            createdAt: serverTimestamp(),
            role: 'user',
            emailVerified: false
          };
          
          await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
          
          console.log('User created successfully', userCredential.user);
          toast.success('Account created successfully! Please verify your email to continue.');
          
          // Sign out the user until they verify their email
          await auth.signOut();
          
          // Switch to login form after successful signup
          setIsLogin(true);
          setFormData(prev => ({
            ...prev,
            name: '',
            password: '',
            confirmPassword: ''
          }));
          return; // Return early to prevent auth success handler
          
        } catch (signupError) {
          console.error('Signup error:', signupError);
          throw signupError; // Re-throw to be caught by the outer catch
        }
      }
      
      // Only proceed with login if email is verified
      if (isLogin) {
        const shouldProceed = handleAuthSuccess(userCredential.user);
        if (!shouldProceed) return;
      }
    } catch (error) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Please enter a valid email address.';
          break;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TCS Digital Prep</h1>
          <p className="text-primary-100">
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Sign In' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin 
                ? 'Enter your credentials to access your dashboard' 
                : 'Join thousands of students preparing for TCS Digital'
              }
            </p>
          </div>

          {/* Verification Notice */}
          {verificationSent && (
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    A verification email has been sent to <span className="font-medium">{verificationEmail}</span>. 
                    Please check your inbox and verify your email address.
                  </p>
                  <div className="mt-2">
                    <button
                      onClick={handleResendVerification}
                      disabled={isLoading}
                      className="text-sm font-medium text-yellow-700 hover:text-yellow-600 focus:outline-none focus:underline transition duration-150 ease-in-out"
                    >
                      {isLoading ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-4 mb-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed ${isLoading ? 'opacity-70' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.24469 56.479 -10.4661 57.329 L -10.4661 60.609 L -6.39935 60.609 C -4.15906 58.529 -3.264 55.239 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.8045 62.159 -6.819 60.609 L -10.8868 57.329 C -11.8368 58.049 -13.0835 58.429 -14.754 58.429 C -17.6045 58.429 -20.0135 56.639 -20.796 54 L -24.9963 54 C -22.9963 59.77 -18.0145 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -20.796 54 C -21.106 52.989 -21.276 51.909 -21.276 50.809 C -21.276 49.709 -21.106 48.629 -20.796 47.619 L -20.796 44.339 L -24.9963 44.349 C -26.1063 46.489 -26.664 48.899 -26.664 50.809 C -26.664 52.719 -26.1063 55.129 -24.9963 57.269 L -20.796 54 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.189 C -12.984 43.189 -11.4038 43.799 -10.0963 44.969 L -6.72901 41.599 C -8.72901 39.769 -11.514 38.809 -14.754 38.809 C -18.0145 38.809 -20.9963 40.769 -22.9963 44.349 L -18.796 47.619 C -18.0963 45.409 -16.544 43.189 -14.754 43.189 Z"/>
                    </g>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {isLogin && (
                  <button 
                    type="button" 
                    onClick={() => setShowResetPassword(true)}
                    className="font-medium text-primary-600 hover:text-primary-500 focus:outline-none"
                  >
                    Forgot your password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={isLogin ? 'Enter your password' : 'Create a password'}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters
                </p>
              )}
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={toggleMode}
                className="ml-1 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-white">
            <div className="text-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">25</span>
              </div>
              <p className="text-xs text-primary-100">Questions</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">25</span>
              </div>
              <p className="text-xs text-primary-100">Minutes</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <span className="text-sm font-bold">∞</span>
              </div>
              <p className="text-xs text-primary-100">Practice</p>
            </div>
          </div>
        </div>

        {/* Password Reset Modal */}
        {showResetPassword && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reset Password</h3>
                <button
                  onClick={() => {
                    setShowResetPassword(false);
                    setResetSent(false);
                    setResetEmail('');
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!resetSent ? (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div>
                      <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <input
                        id="reset-email"
                        name="reset-email"
                        type="email"
                        autoComplete="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowResetPassword(false);
                          setResetEmail('');
                        }}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Email Sent</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We've sent password reset instructions to <span className="font-medium">{resetEmail}</span>.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowResetPassword(false);
                        setResetSent(false);
                        setResetEmail('');
                      }}
                      className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}