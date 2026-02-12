const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: { use: jest.fn((success) => success()) },
    response: { use: jest.fn((success) => success()) },
  },
};

module.exports = {
  create: jest.fn(() => mockAxiosInstance),
  isAxiosError: jest.fn((error) => !!error?.response),
};
