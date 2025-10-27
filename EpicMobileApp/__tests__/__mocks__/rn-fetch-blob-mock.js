jest.mock('rn-fetch-blob', () => {
  return {
    __esModule: true,
    default: {
      fs: {
        unlink: jest.fn(),
      },
      config: () => ({
        fetch: jest.fn().mockImplementation(() => {
          return true;
        }),
      }),
      fetch: jest.fn().mockImplementation(() => {}),
    },
  };
});
