import api from './api';

const contactService = {
  /**
   * Submit a contact message
   * @param {Object} formData - { name, email, subject, message }
   */
  submitContact: async (formData) => {
    const { data } = await api.post('/contact', formData);
    return data;
  },

  /**
   * Get all contact messages (Admin)
   */
  getContacts: async () => {
    const { data } = await api.get('/contact');
    return data;
  },

  /**
   * Get single contact message (Admin)
   * @param {string} id
   */
  getContact: async (id) => {
    const { data } = await api.get(`/contact/${id}`);
    return data;
  },

  /**
   * Update contact status (Admin)
   * @param {string} id
   * @param {string} status
   */
  updateStatus: async (id, status) => {
    const { data } = await api.patch(`/contact/${id}`, { status });
    return data;
  },

  /**
   * Delete contact message (Admin)
   * @param {string} id
   */
  deleteContact: async (id) => {
    const { data } = await api.delete(`/contact/${id}`);
    return data;
  },
};

export default contactService;
