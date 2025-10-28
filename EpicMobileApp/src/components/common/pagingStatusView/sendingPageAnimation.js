import React from 'react';
import { View, Text } from 'react-native';
import styles from './styles';
import { translate } from '../../../translations/translationHelper';
import utils from '../../../utils';
import LottieView from 'lottie-react-native';

const { tablet } = utils;
const SendingPageAnimation = ({ }) => {
  const renderSendingAnimation = () => {
    return (
      <View>
        <LottieView
          source={require('../../../assets/lottieJson/sendPage.json')}
          autoPlay
          loop={true}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
        <Text style={styles.textStyle}>{translate('sendingMeassage')}</Text>
      </View>
    );
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <LottieView
          source={require('../../../assets/lottieJson/sendPage.json')}
          autoPlay
          loop={true}
          resizeMode="cover"
          style={styles.lottieStyle}
        />
        <Text style={styles.textStyle1}>{translate('sendingMeassage')}</Text>
      </View>
    </View>
  );
};

export default SendingPageAnimation;
