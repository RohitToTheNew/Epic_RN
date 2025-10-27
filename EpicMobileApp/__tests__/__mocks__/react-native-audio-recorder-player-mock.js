jest.mock('react-native-audio-recorder-player', () => {
  return jest.fn().mockImplementation(() => ({
    AudioEncoderAndroidType: () => {
      return 'aac';
    },
    AudioSourceAndroidType: () => {
      return 'mic';
    },
    AVEncoderAudioQualityIOSType: () => {
      return 'high';
    },
    AVEncodingOption: () => {
      return 'aac';
    },
  }));
});
