import api from './api';

const aiService = {
  chat: async ({ message, history = [], pageContext = {} }) => {
    const { data } = await api.post('/ai/chat', {
      message,
      history,
      pageContext,
    });

    return data;
  },

  generateContactReply: async (contactId) => {
    const { data } = await api.post('/ai/contact-reply', { contactId });
    return data;
  },
};

export default aiService;
