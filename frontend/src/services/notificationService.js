import api from './api';

const notificationService = {
  /**
   * Get all notifications for current user
   */
  getNotifications: async () => {
    const { data } = await api.get('/notifications');
    return data;
  },

  /**
   * Mark a notification as read
   * @param {string} id
   */
  markAsRead: async (id) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    const { data } = await api.patch('/notifications/read-all');
    return data;
  },

  /**
   * Delete a notification
   * @param {string} id
   */
  deleteNotification: async (id) => {
    const { data } = await api.delete(`/notifications/${id}`);
    return data;
  },
};

export default notificationService;
