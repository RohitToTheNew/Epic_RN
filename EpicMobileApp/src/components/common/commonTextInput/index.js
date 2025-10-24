import React, {useEffect, useState} from 'react';
import {View, TextInput, Text, Animated, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Colors, Mixins} from '../../../config/styles';
import utils from '../../../utils';
const {tablet} = utils;

const CommonTextInput = props => {
  const {
    value,
    label,
    style,
    containerStyle,
    textinputStyle,
    inputRef,
    onChangeText,
    fieldName,
    autoCapitalize,
  } = props;
  var animatedValue = new Animated.Value(value === '' ? 0 : 1);

  const [isFocused, setIsFocused] = useState(false);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || props.value !== '' ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const handleFocus = () => {
    const {onInputFocus} = props;
    setIsFocused(true);
    onInputFocus && onInputFocus();
  };

  const handleBlur = () => {
    const {onInputBlur} = props;
    setIsFocused(false), onInputBlur && onInputBlur();
  };
  const handleChangeText = value => {
    onChangeText(fieldName, value);
  };

  return (
    <View style={style}>
      <View style={[styles.textInputContainer(isFocused), containerStyle]}>
        <TextInput
          {...props}
          ref={inputRef}
          style={[styles.textinputStyle, textinputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          enablesReturnKeyAutomatically={true}
          onChangeText={handleChangeText}
          autoCapitalize={autoCapitalize}
          multiline={true}
          textAlignVertical={'top'}
          blurOnSubmit={true}
        />
      </View>
      <Animated.View
        style={[
          styles.labelContainer,
          {
            top:
              props.label &&
              animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  tablet ? Mixins.scaleSize(6) : Mixins.scaleSize(14),
                  tablet ? Mixins.scaleSize(-0.05) : Mixins.scaleSize(-6),
                ],
              }),
          },
        ]}>
        <TouchableOpacity onPress={() => inputRef && inputRef.current.focus()}>
          <Animated.Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.label,
              {
                fontSize: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    tablet ? Mixins.scaleFont(12.5) : Mixins.scaleFont(16),
                    tablet ? Mixins.scaleFont(10) : Mixins.scaleFont(16),
                  ],
                }),
                color: isFocused ? Colors.COLOR_808284 : Colors.COLOR_808284,
              },
            ]}>
            {label}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CommonTextInput;
