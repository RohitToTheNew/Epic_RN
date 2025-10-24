import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { translate } from '../../../translations/translationHelper';
import styles from './styles';

const CustomRadioButtons = ({ buttons, selectedIndex, onValueChanged }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(
    selectedIndex || 0,
  );
  const {isFoldableDevice} = useSelector(state => state.app);

  const selectedButtonIndex = index => {
    setSelectedItemIndex(index);
    !!onValueChanged && onValueChanged(index);
  };
  useEffect(() => {
    setSelectedItemIndex(selectedIndex || 0);
  }, [selectedIndex]);

  return (
    <View style={styles.container(isFoldableDevice)}>

      <TouchableOpacity
        key={`button_${0}`}
        activeOpacity={0.7}
        onPress={() => selectedButtonIndex(0)}>
        <View style={styles.buttonContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle(selectedItemIndex === 0)} />
          </View>
          <Text style={styles.textStyle(selectedItemIndex === 0)}>{translate('domainUser')}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        key={`button_${1}`}
        onPress={() => selectedButtonIndex(1)}>
        <View style={styles.buttonContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle(selectedItemIndex === 1)} />
          </View>
          <Text style={styles.textStyle(selectedItemIndex === 1)}>{translate('localUser')}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CustomRadioButtons;
