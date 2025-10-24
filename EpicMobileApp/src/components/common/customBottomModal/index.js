import React from 'react';
import {View, Modal} from 'react-native';
import {useSelector} from 'react-redux';
import styles from './styles';

const CustomModal = ({isVisible, children}) => {
  const {serverDisconnected, routeName} = useSelector(state => state.globalReducer);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        gesture
        transparent={true}
        visible={isVisible ? isVisible : (!!serverDisconnected && routeName != 'Login')}>
        <View style={styles.centeredView}>{children}</View>
      </Modal>
    </View>
  );
};

export default CustomModal;
