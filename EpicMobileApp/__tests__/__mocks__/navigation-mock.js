jest.mock("@react-navigation/native-stack", () => {
    return {
        createNativeStackNavigator: () => true
    }
});
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock BackHandler
jest.mock('react-native/Libraries/Utilities/BackHandler', () => ({
    addEventListener: jest.fn(() => ({
        remove: jest.fn(),
    })),
    removeEventListener: jest.fn(),
}));

// Mock RefreshControl
jest.mock('react-native/Libraries/Components/RefreshControl/RefreshControl', () => {
    const React = require('react');
    return {
        __esModule: true,
        default: jest.fn().mockImplementation(({ refreshing, onRefresh }) => {
            return React.createElement('RefreshControl', { refreshing, onRefresh });
        }),
    };
});
