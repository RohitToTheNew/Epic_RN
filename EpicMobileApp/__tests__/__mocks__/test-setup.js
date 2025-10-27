// Global test setup - suppress console warnings
global.console = {
    ...console,
    // Suppress specific warnings
    warn: jest.fn(),
    error: jest.fn(),
};

