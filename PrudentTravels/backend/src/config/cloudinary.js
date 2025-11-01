const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'prudent-travels') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Upload multiple images
const uploadMultipleImages = async (files, folder = 'prudent-travels') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple image upload error:', error);
    throw new Error('Multiple image upload failed');
  }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Image deletion failed');
  }
};

// Delete multiple images
const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(id => deleteImage(id));
    return await Promise.all(deletePromises);
  } catch (error) {
    console.error('Multiple image deletion error:', error);
    throw new Error('Multiple image deletion failed');
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadMultipleImages,
  deleteImage,
  deleteMultipleImages
};
