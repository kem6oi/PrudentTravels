import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Sidebar from '../../components/common/Sidebar';
import { SidebarProvider } from '../../contexts/SidebarContext';
import Navbar from '../../components/common/Navbar';
import { DESTINATION_CATEGORIES } from '../../utils/constants';
import { destinationService } from '../../services/destination.service';
import toast from 'react-hot-toast';

const AddDestination = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Validate main image
      if (!mainImage) {
        toast.error('Please select a main image');
        setLoading(false);
        return;
      }

      const destinationData = {
        ...data,
        mainImage: mainImage,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        maxGroupSize: parseInt(data.maxGroupSize),
        duration: {
          days: parseInt(data.durationDays),
          nights: parseInt(data.durationNights),
        },
      };

      await destinationService.create(destinationData);
      toast.success('Destination added successfully');
      navigate('/admin/destinations');
    } catch (error) {
      console.error('Error adding destination:', error);
      const errorMessage = error.response?.data?.errors 
        ? error.response.data.errors.map(e => e.message).join(', ')
        : error.response?.data?.message || 'Failed to add destination';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
    <div className="flex h-screen bg-sky-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Navbar title="Add New Destination" />
        
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="card p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
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
                      <label htmlFor="slug" className="label">URL Slug (optional)</label>
                      <input
                        id="slug"
                        type="text"
                        {...register('slug')}
                        className="input-field"
                        placeholder="Leave blank to auto-generate from name"
                      />
                      <p className="text-sm text-gray-600 mt-1">Will be auto-generated from name if left blank</p>
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
                    <div>
                      <label htmlFor="country" className="label">Country *</label>
                      <input
                        id="country"
                        type="text"
                        {...register('country', { required: 'Country is required' })}
                        className="input-field"
                      />
                      {errors.country && <p className="error-text">{errors.country.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="label">Description *</label>
                  <textarea
                    id="description"
                    rows="6"
                    {...register('description', { required: 'Description is required', minLength: { value: 50, message: 'Description must be at least 50 characters' } })}
                    className="input-field resize-none"
                  />
                  {errors.description && <p className="error-text">{errors.description.message}</p>}
                </div>

                {/* Short Description */}
                <div>
                  <label htmlFor="shortDescription" className="label">Short Description *</label>
                  <textarea
                    id="shortDescription"
                    rows="3"
                    {...register('shortDescription', { 
                      required: 'Short description is required',
                      maxLength: { value: 500, message: 'Short description must not exceed 500 characters' }
                    })}
                    className="input-field resize-none"
                    placeholder="A brief summary of the destination (max 500 characters)"
                  />
                  {errors.shortDescription && <p className="error-text">{errors.shortDescription.message}</p>}
                </div>

                {/* Main Image */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Images</h3>
                  <div>
                    <label htmlFor="mainImage" className="label">Main Image *</label>
                    <input
                      id="mainImage"
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="input-field"
                    />
                    {mainImagePreview && (
                      <div className="mt-4">
                        <img 
                          src={mainImagePreview} 
                          alt="Preview" 
                          className="w-full max-w-md h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    {!mainImage && <p className="text-sm text-gray-600 mt-1">Please upload a main image for the destination</p>}
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="price" className="label">Price *</label>
                      <input
                        id="price"
                        type="number"
                        step="0.01"
                        {...register('price', { required: 'Price is required' })}
                        className="input-field"
                      />
                      {errors.price && <p className="error-text">{errors.price.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="originalPrice" className="label">Original Price</label>
                      <input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        {...register('originalPrice')}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Trip Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="durationDays" className="label">Days *</label>
                      <input
                        id="durationDays"
                        type="number"
                        {...register('durationDays', { required: 'Days is required' })}
                        className="input-field"
                      />
                      {errors.durationDays && <p className="error-text">{errors.durationDays.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="durationNights" className="label">Nights *</label>
                      <input
                        id="durationNights"
                        type="number"
                        {...register('durationNights', { required: 'Nights is required' })}
                        className="input-field"
                      />
                      {errors.durationNights && <p className="error-text">{errors.durationNights.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="maxGroupSize" className="label">Max Group Size *</label>
                      <input
                        id="maxGroupSize"
                        type="number"
                        {...register('maxGroupSize', { required: 'Max group size is required' })}
                        className="input-field"
                      />
                      {errors.maxGroupSize && <p className="error-text">{errors.maxGroupSize.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="label">Category *</label>
                  <select
                    id="category"
                    {...register('category', { required: 'Category is required' })}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {DESTINATION_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="error-text">{errors.category.message}</p>}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8"
                  >
                    {loading ? 'Adding...' : 'Add Destination'}
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

export default AddDestination;
