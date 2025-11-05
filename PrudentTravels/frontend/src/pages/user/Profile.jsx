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
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="My Profile" />

        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            {/* Profile Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-700">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <HiUser className="text-6xl" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="profileImage"
                    className="absolute bottom-0 right-0 bg-slate-700 text-slate-100 p-2 rounded-full cursor-pointer hover:bg-slate-600 transition-colors"
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
                  <h2 className="text-3xl font-serif font-bold text-slate-100 mb-2">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-slate-300">{user?.email}</p>
                  <p className="text-sm text-slate-400 mt-1 capitalize">
                    Member since {new Date(user?.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
              <h3 className="text-2xl font-serif font-bold text-slate-100 mb-6">
                Personal Information
              </h3>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-200 mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HiUser className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        {...register('firstName', {
                          required: 'First name is required',
                        })}
                        className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-300">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-200 mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName', {
                        required: 'Last name is required',
                      })}
                      className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-300">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiMail className="h-5 w-5 text-slate-400" />
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
                      className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-200 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HiPhone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-2.5 pl-10 bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-100 font-semibold rounded-xl hover:from-slate-600 hover:to-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/50 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition-colors">
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
