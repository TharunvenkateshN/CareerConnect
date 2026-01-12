import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  Upload,
  UserCheck,
  Building2,
  Loader,
  CheckCircle
} from 'lucide-react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadimage'
import { useAuth } from '../../context/AuthContext';

// Import validation helpers
import {
  validateEmail,
  validatePassword,
  validateAvatar
} from '../../utils/helper'

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    avatar: null
  })

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false
  })

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formState.errors[name]) {
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }))
    }
  }

  // Handle avatar upload using helper
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const avatarError = validateAvatar(file)
      if (avatarError) {
        setFormState((prev) => ({
          ...prev,
          errors: { ...prev.errors, avatar: avatarError }
        }))
        return
      }

      setFormData((prev) => ({ ...prev, avatar: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, avatarPreview: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle role selection
  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }))
  }

  // Validate form using helper functions
  const validateForm = () => {
    const errors = {}

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required.'

    const emailError = validateEmail(formData.email)
    if (emailError) errors.email = emailError

    const passwordError = validatePassword(formData.password)
    if (passwordError) errors.password = passwordError

    if (!formData.role.trim()) errors.role = 'Please select a role.'

    const avatarError = validateAvatar(formData.avatar)
    if (avatarError) errors.avatar = avatarError

    setFormState((prev) => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setFormState((prev) => ({ ...prev, loading: true, errors: {} }))

    try {
      let avatarUrl = "";

      // Upload image if present
      if (formData.avatar) {
        const imgUploadRes = await uploadImage(formData.avatar);
        avatarUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        avatar: avatarUrl || "",
      });

      // Handle successful registration
      setFormState((prev) => ({
        ...prev,
        loading: false,
        success: true,
        errors: {}
      }));

      const { token } = response.data;
      if (token) {
        login(response.data, token);

        // Redirect based on role using navigate
        setTimeout(() => {
          navigate(formData.role === 'employer' ? '/employer-dashboard' : '/find-jobs');
        }, 2000);
      }


    } catch (error) {
      console.error("Signup error:", error);
      setFormState((prev) => ({
        ...prev,
        loading: false,
        errors: { submit: error.response?.data?.message || 'Something went wrong. Please try again.' }
      }))
    }
  }

  // Success Screen
  if (formState.success) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center'
        >
          <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            Account Created!
          </h2>
          <p className='text-gray-600 mb-4'>
            Welcome to{' '}
            <span className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold'>
              CareerConnect
            </span>
            ! Your account has been successfully created.
          </p>
          <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2'></div>
          <p className='text-sm text-gray-500 mt-2'>
            Redirecting to your dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  // Sign Up Form
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white p-8 rounded-2xl shadow-md max-w-md w-full'
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-2xl font-bold text-gray-900 mb-1'>
            Create Account
          </h2>
          <p className='text-gray-500 text-sm'>
            Join thousands of professionals finding their dream jobs.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Full Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='text'
                name='fullName'
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder='Enter your full name'
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${formState.errors.fullName
                  ? 'border-red-500'
                  : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {formState.errors.fullName && (
              <p className='text-sm text-red-500 mt-1'>
                {formState.errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email Address <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Enter your email'
                className={`w-full pl-10 pr-4 py-2 border rounded-md ${formState.errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {formState.errors.email && (
              <p className='text-sm text-red-500 mt-1'>
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password <span className='text-red-500'>*</span>
            </label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
              <input
                type={formState.showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                placeholder='Create a strong password'
                className={`w-full pl-10 pr-10 py-2 border rounded-md ${formState.errors.password
                  ? 'border-red-500'
                  : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button
                type='button'
                onClick={() =>
                  setFormState((prev) => ({
                    ...prev,
                    showPassword: !prev.showPassword
                  }))
                }
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
              >
                {formState.showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>
            {formState.errors.password && (
              <p className='text-sm text-red-500 mt-1'>
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Profile Picture */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Profile Picture (Optional)
            </label>
            <div className='flex items-center space-x-3'>
              <div className='w-12 h-12 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden'>
                {formState.avatarPreview ? (
                  <img
                    src={formState.avatarPreview}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <User className='text-gray-400 w-6 h-6' />
                )}
              </div>
              <label className='flex items-center space-x-2 text-blue-600 cursor-pointer hover:text-blue-700 text-sm font-medium'>
                <Upload className='w-4 h-4' />
                <span>Upload Photo</span>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  className='hidden'
                />
              </label>
            </div>
            {formState.errors.avatar && (
              <p className='text-sm text-red-500 mt-1'>
                {formState.errors.avatar}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              I am a <span className='text-red-500'>*</span>
            </label>
            <div className='flex space-x-3'>
              <div
                onClick={() => handleRoleChange('jobseeker')}
                className={`flex-1 border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${formData.role === 'jobseeker'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-blue-400'
                  }`}
              >
                <UserCheck className='w-5 h-5 mb-1' />
                <span className='text-sm font-medium'>Job Seeker</span>
                <p className='text-xs text-gray-500'>
                  Looking for opportunities
                </p>
              </div>

              <div
                onClick={() => handleRoleChange('employer')}
                className={`flex-1 border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${formData.role === 'employer'
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-300 hover:border-purple-400'
                  }`}
              >
                <Building2 className='w-5 h-5 mb-1' />
                <span className='text-sm font-medium'>Employer</span>
                <p className='text-xs text-gray-500'>Hiring talent</p>
              </div>
            </div>
            {formState.errors.role && (
              <p className='text-sm text-red-500 mt-1'>
                {formState.errors.role}
              </p>
            )}
          </div>

          {/* Submit */}
          <div>
            <button
              type='submit'
              disabled={formState.loading}
              className='w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2'
            >
              {formState.loading ? (
                <>
                  <Loader className='w-5 h-5 animate-spin' />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Already have account link */}
          <div className='text-center text-sm text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 hover:text-purple-600 font-medium transition-colors duration-200'
            >
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SignUp
