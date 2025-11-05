import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import Loader from '../../components/common/Loader';
import api, { apiEndpoints } from '../../services/api';
import toast from 'react-hot-toast';

const EditDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchDestination();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchDestination = async () => {
    try {
      const response = await api.get(apiEndpoints.destinations.getOne(id));
      const dest = response.data.data;
      reset({
        ...dest,
        durationDays: dest.duration?.days || 1,
        durationNights: dest.duration?.nights || 0,
      });
    } catch (error) {
      console.error('Error fetching destination:', error);
      toast.error('Failed to load destination');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const destinationData = {
        ...data,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        maxGroupSize: parseInt(data.maxGroupSize),
        duration: {
          days: parseInt(data.durationDays),
          nights: parseInt(data.durationNights),
        },
      };

      await api.put(apiEndpoints.destinations.update(id), destinationData);
      toast.success('Destination updated successfully');
      navigate('/admin/destinations');
    } catch (error) {
      toast.error('Failed to update destination');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-slate-900">
          <Sidebar />
          <div className="flex-1">
            <Navbar title="Edit Destination" />
            <Loader fullScreen />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-slate-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Edit Destination" />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Form fields similar to AddDestination */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="label">Destination Name *</label>
                      <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="input-field"
                      />
                      {errors.name && <p className="error-text">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="city" className="label">City *</label>
                      <input
                        id="city"
                        type="text"
                        {...register('city', { required: 'City is required' })}
                        className="input-field"
                      />
                      {errors.city && <p className="error-text">{errors.city.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary px-8"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/destinations')}
                    className="btn-ghost px-8"
                  >
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

export default EditDestination;
