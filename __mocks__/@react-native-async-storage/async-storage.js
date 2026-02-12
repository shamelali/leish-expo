let store = {};

module.exports = {
  setItem: async (key, value) => {
    store[key] = value;
    return null;
  },
  getItem: async (key) => store[key] ?? null,
  removeItem: async (key) => {
    delete store[key];
    return null;
  },
  clear: async () => {
    store = {};
    return null;
  },
};
