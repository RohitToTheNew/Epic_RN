import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './styles';

const LinkButton = ({onPress, buttonText, containerStyle, textStyle}) => (
  <TouchableOpacity
  hitSlop={styles.hitSlop}
    style={[styles.container, containerStyle]}
    onPress={() => onPress && onPress()}>
    <Text style={[styles.defaultTextStyle, textStyle]}>{buttonText}</Text>
  </TouchableOpacity>
);

export default LinkButton;
