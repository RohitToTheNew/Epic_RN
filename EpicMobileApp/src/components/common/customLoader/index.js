import React from 'react';
import { View, Modal } from 'react-native';
import styles from './styles';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';

const CustomLoader = (loaderChangeStyle) => {
  const { isLoading } = useSelector(state => state.globalReducer)
  return (
    <Modal
      supportedOrientations={['portrait']}
      transparent
      visible={!!isLoading ? isLoading : false}
      onRequestClose={() => { }}>
      <View style={styles.container}>
        <View style={[styles.loaderViewStyle, loaderChangeStyle]}>
          <LottieView
            source={require('../../../assets/lottieJson/coloredLoader.json')}
            autoPlay
            loop={true}
            speed={0.8}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>
    </Modal>
  )
};

export default CustomLoader;
