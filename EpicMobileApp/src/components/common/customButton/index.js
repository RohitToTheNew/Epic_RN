import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const CustomButton = ({
  onPress,
  buttonText,
  containerStyle,
  textStyle,
  disabledFlag,
  disabledStyle,
  icon,
  testID
}) => (
  <TouchableOpacity testID={testID || 'customButton'}
    disabled={disabledFlag}
    style={
      disabledFlag
        ? [styles.container, disabledStyle, containerStyle]
        : [styles.container, containerStyle]
    }
    onPress={() => onPress && onPress()}>
    {icon && icon}
    <Text style={[styles.defaultTextStyle, textStyle]}>{buttonText}</Text>
  </TouchableOpacity>
);

export default CustomButton;
