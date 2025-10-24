import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Mixins } from '../../../config/styles';
import styles from './styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const BottomSheetModal = ({
  isVisible,
  value,
  onShowCompletion,
  onHideCompletion,
  height,
  children,
  delay,
  duration,
  containerStyle,
  disable,
  maxHeight,
  bounces,
  ...props
}) => {
  const [alignment] = useState(new Animated.Value(0));

  const timerDelay = delay || 200;
  const timerDuration = duration || 500;

  const showActionSheet = () => {
    Animated.timing(alignment, {
      toValue: 1,
      duration: timerDuration,
      useNativeDriver: false,
    }).start(() => {
      onShowCompletion && showActionSheet();
    });
  };

  const hideActionSheet = () => {
    Animated.timing(alignment, {
      toValue: 0,
      duration: timerDuration,
      useNativeDriver: false,
    }).start(() => {
      onHideCompletion && onHideCompletion();
    });
  };

  const { bottom } = useSafeAreaInsets();
  const actionSheetInterpolate = alignment.interpolate({
    inputRange: [0, 1],
    outputRange: [-height + 50, 0],
  });

  const viewBackgroundInterpolate = alignment.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.COLOR_TRANSPARENT, Colors.COLOR_00000040],
  });

  const usePrevious = val => {
    const ref = useRef();
    useEffect(() => {
      ref.current = val;
    });
    return ref.current;
  };

  const prevValue = usePrevious({ value });

  useEffect(() => {
    if (value === 1) {
      setTimeout(() => {
        showActionSheet();
      }, timerDelay);
    } else if (prevValue.value !== value) {
      hideActionSheet();
    }
  });

  const animatedActionSheetStyle = {
    bottom: actionSheetInterpolate,
  };

  const animatedViewStyle = {
    backgroundColor: viewBackgroundInterpolate,
  };

  return (
    <Modal
      supportedOrientations={['portrait']}
      transparent
      visible={isVisible}
      animationType={'slide'}
      onRequestClose={() => { }}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => hideActionSheet()}
        disabled={disable || false}>
        <KeyboardAwareScrollView bounces={bounces} contentContainerStyle={{ flex: 1 }} enableOnAndroid={false} keyboardShouldPersistTaps='handled' extraScrollHeight={Mixins.scaleSize(70)}  >
          <Animated.View style={[styles.viewContainer, animatedViewStyle]}>
            <Animated.View
              style={[
                styles.shutterContainer(bottom, height, maxHeight),
                containerStyle,
                animatedActionSheetStyle,
              ]}>
              {children}
            </Animated.View>
          </Animated.View>
        </KeyboardAwareScrollView>
      </TouchableOpacity>
    </Modal>
  );
};

export default BottomSheetModal;