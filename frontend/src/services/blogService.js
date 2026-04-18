import api from './api';

const blogService = {
  /**
   * Get all blogs
   */
  getAllBlogs: async () => {
    const { data } = await api.get('/blogs');
    return data;
  },

  /**
   * Get single blog by slug
   * @param {string} slug
   */
  getBlogBySlug: async (slug) => {
    const { data } = await api.get(`/blogs/${slug}`);
    return data;
  },

  /**
   * Create new blog (Admin only)
   * @param {FormData} formData
   */
  createBlog: async (formData) => {
    const { data } = await api.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Update blog (Admin only)
   * @param {string} id
   * @param {FormData} formData
   */
  updateBlog: async (id, formData) => {
    const { data } = await api.patch(`/blogs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  /**
   * Delete blog (Admin only)
   * @param {string} id
   */
  deleteBlog: async (id) => {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
  },
};

export default blogService;
