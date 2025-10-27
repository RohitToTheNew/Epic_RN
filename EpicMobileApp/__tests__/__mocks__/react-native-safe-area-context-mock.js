jest.mock('react-native-safe-area-context', () => {
    const React = require('react');

    return {
        SafeAreaProvider: ({ children }) => children,
        SafeAreaConsumer: ({ children }) =>
            children({
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }),
        SafeAreaView: ({ children }) => children,
        useSafeAreaInsets: () => ({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        }),
        useSafeAreaFrame: () => ({
            x: 0,
            y: 0,
            width: 390,
            height: 844,
        }),
        initialWindowMetrics: {
            insets: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            },
            frame: {
                x: 0,
                y: 0,
                width: 390,
                height: 844,
            },
        },
    };
});

