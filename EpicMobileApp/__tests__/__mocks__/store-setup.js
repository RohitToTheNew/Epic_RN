// Mock navigationInstance for all tests
import { store } from '../../src/store/configureStore';

// Create mock navigation methods
export const mockNavigationInstance = {
    navigate: jest.fn(),
    replace: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    dispatch: jest.fn(),
};

// Function to setup navigation instance in store
const setupNavigationInstance = () => {
    try {
        store.dispatch({
            type: 'UPDATE_APP_MODAL_FIELDS',
            payload: {
                navigationInstance: mockNavigationInstance,
            },
        });
    } catch (error) {
        // Silently catch any errors during setup
    }
};

// Setup immediately
setupNavigationInstance();

// Also setup before each test in the original Jest context
if (typeof global.beforeEach === 'function') {
    global.beforeEach(() => {
        setupNavigationInstance();
    });
}

