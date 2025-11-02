import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiLockClosed, HiBell, HiGlobe, HiShieldCheck } from 'react-icons/hi';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('password');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const newPassword = watch('newPassword');

  const tabs = [
    { id: 'password', label: 'Password', icon: HiLockClosed },
    { id: 'notifications', label: 'Notifications', icon: HiBell },
    { id: 'preferences', label: 'Preferences', icon: HiGlobe },
    { id: 'privacy', label: 'Privacy', icon: HiShieldCheck },
  ];

  const handlePasswordChange = async (data) => {
    setLoading(true);
    try {
      await api.put(apiEndpoints.auth.updatePassword, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully');
      reset();
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordTab = () => (
    <form onSubmit={handleSubmit(handlePasswordChange)} className="space-y-6">
      <div>
        <label htmlFor="currentPassword" className="label">
          Current Password
        </label>
        <input
          id="currentPassword"
          type="password"
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
          className="input-field"
        />
        {errors.currentPassword && (
          <p className="error-text">{errors.currentPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="newPassword" className="label">
          New Password
        </label>
        <input
          id="newPassword"
          type="password"
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          className="input-field"
        />
        {errors.newPassword && (
          <p className="error-text">{errors.newPassword.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          })}
          className="input-field"
        />
        {errors.confirmPassword && (
          <p className="error-text">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-8"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium">Booking Confirmations</p>
              <p className="text-sm text-gray-600">Receive confirmations for your bookings</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium">Promotional Emails</p>
              <p className="text-sm text-gray-600">Get exclusive deals and offers</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium">Newsletter</p>
              <p className="text-sm text-gray-600">Weekly travel tips and destination highlights</p>
            </div>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Push Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium">Booking Updates</p>
              <p className="text-sm text-gray-600">Updates about your bookings</p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium">Special Offers</p>
              <p className="text-sm text-gray-600">Notifications about special deals</p>
            </div>
          </label>
        </div>
      </div>

      <button className="btn-primary px-8">
        Save Preferences
      </button>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="language" className="label">
          Language
        </label>
        <select id="language" className="input-field">
          <option>English</option>
          <option>Spanish</option>
          <option>French</option>
          <option>German</option>
        </select>
      </div>

      <div>
        <label htmlFor="currency" className="label">
          Currency
        </label>
        <select id="currency" className="input-field">
          <option>USD - US Dollar</option>
          <option>EUR - Euro</option>
          <option>GBP - British Pound</option>
          <option>JPY - Japanese Yen</option>
        </select>
      </div>

      <div>
        <label htmlFor="timezone" className="label">
          Timezone
        </label>
        <select id="timezone" className="input-field">
          <option>EST - Eastern Standard Time</option>
          <option>PST - Pacific Standard Time</option>
          <option>GMT - Greenwich Mean Time</option>
          <option>JST - Japan Standard Time</option>
        </select>
      </div>

      <button className="btn-primary px-8">
        Save Preferences
      </button>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
          <div>
            <p className="font-medium">Make Profile Public</p>
            <p className="text-sm text-gray-600">Allow others to see your profile</p>
          </div>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" defaultChecked className="w-4 h-4 text-primary-600" />
          <div>
            <p className="font-medium">Show Reviews</p>
            <p className="text-sm text-gray-600">Display your reviews publicly</p>
          </div>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" className="w-4 h-4 text-primary-600" />
          <div>
            <p className="font-medium">Share Travel History</p>
            <p className="text-sm text-gray-600">Let others see where you've traveled</p>
          </div>
        </label>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <button className="btn-danger px-8">
          Delete Account
        </button>
        <p className="text-sm text-gray-600 mt-2">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Settings" />
        
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Tabs */}
              <div className="lg:col-span-1">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-sky-50'
                      }`}
                    >
                      <tab.icon className="text-xl" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="lg:col-span-3 card p-8">
                {activeTab === 'password' && renderPasswordTab()}
                {activeTab === 'notifications' && renderNotificationsTab()}
                {activeTab === 'preferences' && renderPreferencesTab()}
                {activeTab === 'privacy' && renderPrivacyTab()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
