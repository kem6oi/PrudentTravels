import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaStar } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ReviewForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialData?.title || '',
      comment: initialData?.comment || '',
    },
  });

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (selectedImages.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file size and type
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      return true;
    });

    // Create preview URLs
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages([...selectedImages, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleFormSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        ...data,
        rating,
        images: selectedImages.map(img => img.file),
      });
      toast.success(initialData ? 'Review updated successfully' : 'Review submitted successfully');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => handleRatingClick(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <FaStar
                className={`w-8 h-8 ${
                  value <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600">
              {rating} out of 5
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="label">
          Review Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 5,
              message: 'Title must be at least 5 characters',
            },
          })}
          className="input-field"
          placeholder="Summarize your experience"
        />
        {errors.title && (
          <p className="error-text">{errors.title.message}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="label">
          Your Review *
        </label>
        <textarea
          id="comment"
          rows="5"
          {...register('comment', {
            required: 'Review is required',
            minLength: {
              value: 20,
              message: 'Review must be at least 20 characters',
            },
          })}
          className="input-field resize-none"
          placeholder="Share your experience with others..."
        />
        {errors.comment && (
          <p className="error-text">{errors.comment.message}</p>
        )}
      </div>

      {/* Images */}
      <div>
        <label className="label">
          Add Photos (Optional)
        </label>
        <div className="mt-2">
          {/* Image Previews */}
          {selectedImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {selectedImages.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <HiX className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          {selectedImages.length < 5 && (
            <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Click to upload images
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {5 - selectedImages.length} more images allowed (Max 5MB each)
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary py-3"
        >
          {loading ? 'Submitting...' : initialData ? 'Update Review' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 btn-ghost py-3"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default ReviewForm;
