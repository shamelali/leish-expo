module.exports = {
  authService: {
    login: async (email, password) => ({ user: { id: '1', email, name: 'Test User' }, token: 'token' }),
    signup: async (email, password, name) => ({ user: { id: '2', email, name }, token: 'token2' }),
    logout: async () => {},
  },
};