import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CustomLoader from '../customLoader';
import styles from './styles';

const ModalView = ({title,firstButtonText, secondButtonText,firstButtonAction,secondButtonAction, testID, testIDFirstButton, testIDSecondButton}) => {
  const renderView = () => {
    return (
      <View style={styles.titleView}>
        <Text style={styles.textStyle}>{title}</Text>
        <TouchableOpacity testID={testIDFirstButton || 'firstActionButton'} onPress={firstButtonAction} style={styles.buttonContainer}>
          <Text style={styles.defaultButtonTextStyle}>{firstButtonText}</Text>
        </TouchableOpacity>
        <TouchableOpacity testID={testIDSecondButton || 'secondActionButton'} onPress={secondButtonAction}>
          <Text style={styles.subText}>{secondButtonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <View testID={testID || 'modalViewItem'} style={styles.centeredView}>
      <View style={styles.modalView}>
        {renderView()}
        <CustomLoader/>
      </View>
    </View>
  );
};

export default ModalView;
