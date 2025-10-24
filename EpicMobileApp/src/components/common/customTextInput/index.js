import React, {useEffect, useState, useRef} from 'react';
import {View, TextInput, Text, Animated, TouchableOpacity} from 'react-native';
import styles from './styles';
import {Colors, Mixins} from '../../../config/styles';
import {CloseEyeIcon, EyeIcon} from '../../../config/imageConstants';
import utils from '../../../utils';
import { useSelector } from 'react-redux';

const {tablet, onUpdateTapped} = utils;

const CustomTextInput = props => {
  const {
    value,
    label,
    style,
    containerStyle,
    textinputStyle,
    errorMessage,
    errorMessageStyle,
    inputRef,
    hideErrorMessage,
    onChangeText,
    fieldName,
    auxiliaryButton,
    auxiliaryButtonAction,
    auxiliaryButtonStyle,
    autoCapitalize,
    auxiliaryDisabled,
    hyperlink,
    alignment,
    testID,
    auxButtonTestID
  } = props;
  var animatedValue = new Animated.Value(value === '' ? 0 : 1);
  const {isFoldableDevice} = useSelector(state => state.app);

  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setIsSecureTextEntry] = useState(
    props.secureTextEntry,
  );
  const [showPasswordButton, setShowPasswordButton] = useState(
    props.showPasswordButton || false,
  );

  const isErrorMessage = !!errorMessage;
  const hideError = hideErrorMessage || false;

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

  const onShowPasswordButtonTapped = () =>
    setIsSecureTextEntry(!secureTextEntry);

  const handleChangeText = value => {
    onChangeText(fieldName, value);
  };

  return (
    <View style={style}>
      <View
        style={[
          styles.textInputContainer(isErrorMessage, isFocused),
          containerStyle,
        ]}>
        <TextInput
          {...props}
          ref={inputRef}
          testID={testID}
          secureTextEntry={secureTextEntry}
          style={[styles.textinputStyle(showPasswordButton, isFoldableDevice), textinputStyle]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          enablesReturnKeyAutomatically={true}
          onChangeText={handleChangeText}
          autoCapitalize={autoCapitalize}
        />
        {showPasswordButton && (
          <TouchableOpacity
            style={styles.showPasswordButton}
            onPress={onShowPasswordButtonTapped}>
            {secureTextEntry ? (
              <EyeIcon
                height={(tablet ||isFoldableDevice) ? Mixins.scaleSize(22) : Mixins.scaleSize(24)}
                width={(tablet ||isFoldableDevice) ? Mixins.scaleSize(23) : Mixins.scaleSize(25)}
              />
            ) : (
              <CloseEyeIcon
                height={(tablet ||isFoldableDevice) ? Mixins.scaleSize(22) : Mixins.scaleSize(24)}
                width={(tablet ||isFoldableDevice) ? Mixins.scaleSize(23) : Mixins.scaleSize(25)}
              />
            )}
          </TouchableOpacity>
        )}
        {auxiliaryButton && (
          <TouchableOpacity
            activeOpacity={1}
            testID={auxButtonTestID || 'testId'}
            style={styles.showPasswordButton}
            disabled={auxiliaryDisabled || false}
            hitSlop={{top: 10, bottom: 10, left: 20, right: 20}}
            onPress={auxiliaryButtonAction}>
            <Text style={[styles.auxiliaryBtnStyle(isFoldableDevice), auxiliaryButtonStyle]}>
              {auxiliaryButton}
            </Text>
          </TouchableOpacity>
        )}
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
                  (tablet ||isFoldableDevice) ? Mixins.scaleSize(19) : Mixins.scaleSize(14),
                  (tablet ||isFoldableDevice) ? Mixins.scaleSize(-0.05) : Mixins.scaleSize(-6),
                ],
              }),
          },
        ]}>
        <TouchableOpacity onPress={() => inputRef && inputRef.current.focus()}>
          <Animated.Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.label(isFoldableDevice),
              {
                fontSize: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    (tablet ||isFoldableDevice) ? Mixins.scaleFont(12.5) : Mixins.scaleFont(16),
                    (tablet ||isFoldableDevice) ? Mixins.scaleFont(10) : Mixins.scaleFont(13),
                  ],
                }),
                color: isErrorMessage
                  ? Colors.COLOR_FF0000
                  : isFocused
                  ? Colors.COLOR_808284
                  : Colors.COLOR_808284,
              },
            ]}>
            {label}
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
      {!hideError && (
        hyperlink ? 
        <Text style={[styles.errorMessage(isFoldableDevice), errorMessageStyle,{textAlign:alignment ? alignment : 'left'}]}>{'Your mobile app version is outdated. Please update your '}<Text onPress={onUpdateTapped} style = {{textDecorationStyle:'solid', color: Colors.COLOR_003D7D}} >{'mobile app.'}</Text></Text>
        :
        <Text style={[styles.errorMessage(isFoldableDevice), errorMessageStyle,{textAlign : alignment ? alignment : 'right'}]}>
          {!!errorMessage && !hideError && errorMessage}
        </Text>
      )}
    </View>
  );
};

export default CustomTextInput;
