import api from './axios';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', {
      username,
      password,
      expiresInMins: 120,
    });
    return response.data;
  },
};