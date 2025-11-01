import api, { apiEndpoints } from './api';

export const destinationService = {
  // Get all destinations with filters
  getAll: async (params = {}) => {
    const response = await api.get(apiEndpoints.destinations.getAll, { params });
    return response.data;
  },

  // Get single destination
  getOne: async (id) => {
    const response = await api.get(apiEndpoints.destinations.getOne(id));
    return response.data;
  },

  // Get featured destinations
  getFeatured: async () => {
    const response = await api.get(apiEndpoints.destinations.featured);
    return response.data;
  },

  // Get popular destinations
  getPopular: async () => {
    const response = await api.get(apiEndpoints.destinations.popular);
    return response.data;
  },

  // Get related destinations
  getRelated: async (id) => {
    const response = await api.get(apiEndpoints.destinations.related(id));
    return response.data;
  },

  // Create new destination (Admin)
  create: async (data) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'mainImage' && key !== 'images') {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Append main image
    if (data.mainImage) {
      formData.append('mainImage', data.mainImage);
    }

    // Append additional images
    if (data.images) {
      data.images.forEach(image => {
        formData.append('images', image);
      });
    }

    const response = await api.post(apiEndpoints.destinations.create, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update destination (Admin)
  update: async (id, data) => {
    const formData = new FormData();
    
    // Append text fields
    Object.keys(data).forEach(key => {
      if (key !== 'mainImage' && key !== 'images') {
        if (typeof data[key] === 'object') {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      }
    });

    // Append main image if changed
    if (data.mainImage && typeof data.mainImage !== 'string') {
      formData.append('mainImage', data.mainImage);
    }

    // Append additional images if provided
    if (data.images) {
      data.images.forEach(image => {
        if (typeof image !== 'string') {
          formData.append('images', image);
        }
      });
    }

    const response = await api.put(apiEndpoints.destinations.update(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete destination (Admin)
  delete: async (id) => {
    const response = await api.delete(apiEndpoints.destinations.delete(id));
    return response.data;
  },

  // Search destinations
  search: async (query) => {
    const response = await api.get(apiEndpoints.destinations.getAll, {
      params: { search: query },
    });
    return response.data;
  },

  // Get destinations by category
  getByCategory: async (category) => {
    const response = await api.get(apiEndpoints.destinations.getAll, {
      params: { category },
    });
    return response.data;
  },

  // Get destinations by location
  getByLocation: async (country, city) => {
    const response = await api.get(apiEndpoints.destinations.getAll, {
      params: { country, city },
    });
    return response.data;
  },
};

export default destinationService;