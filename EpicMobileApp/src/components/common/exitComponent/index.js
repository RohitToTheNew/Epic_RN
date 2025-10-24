import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {translate} from '../../../translations/translationHelper';

const ExitComponent = ({title, yesAction, noAction, optionalFlag,optionalAction, button1Title=translate('no'), button2Title=translate('yes')}) => {
  const renderExitView = () => {
    return (
      <View style={styles.titleView}>
        <Text style={styles.textStyle}>{title}</Text>
        <TouchableOpacity onPress={noAction} style={styles.buttonContainer}>
          <Text style={styles.defaultButtonTextStyle}>{button1Title}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={yesAction}>
          <Text style={styles.subText}>{button2Title}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const optionalView = () => {
    return (
      <View style={styles.titleView}>
        <Text style={styles.textStyle}>{translate('monthChangeConfirmation')}</Text>
        <Text style={styles.textStyle}>{translate('currentMonthSelectionText')}</Text>
        <TouchableOpacity onPress={optionalAction} style={styles.buttonContainer}>
          <Text style={styles.defaultButtonTextStyle}>{translate('noWorriesText')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={noAction}>
          <Text style={styles.subText}>{translate('staySameMonthText')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        {optionalFlag ? optionalView() : renderExitView()}
      </View>
    </View>
  );
};

export default ExitComponent;
