import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { HiUser, HiMail, HiPhone, HiCamera } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import { updateUser } from '../../store/slices/authSlice';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await api.put(apiEndpoints.auth.updateProfile, data);
      dispatch(updateUser(response.data.data));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Profile" />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="card p-8 mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <HiUser className="text-6xl" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
                  >
                    <HiCamera className="text-xl" />
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1 capitalize">
                    Member since {new Date(user?.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="card p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Personal Information
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="label">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName', {
                          required: 'First name is required',
                        })}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="error-text">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="label">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                      })}
                      className="input-field"
                    />
                    {errors.lastName && (
                      <p className="error-text">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="label">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className="input-field pl-10"
                    />
                  </div>
                  {errors.email && (
                    <p className="error-text">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="label">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="btn-ghost px-8">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
    </SidebarProvider>
  );
};

export default Profile;
