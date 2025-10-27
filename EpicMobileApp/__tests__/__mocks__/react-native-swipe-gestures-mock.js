jest.mock('react-native-swipe-gestures', () => {
    return jest.fn().mockImplementation(() => ({
        swipeDirections: () => {
        return 'aac';
      },
    }));
  });
  