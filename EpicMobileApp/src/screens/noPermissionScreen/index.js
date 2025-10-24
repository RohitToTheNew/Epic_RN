import React, {useState, useEffect} from 'react';
import {View, Text,Modal,BackHandler} from 'react-native';
/**
 * custom imports
 */
import {translate} from '../../translations/translationHelper';
import styles from './styles';
import HomeHeaderView from '../../components/common/homeHeaderView';
import {AccessDenied} from '../../config/imageConstants';
import {isAndroid} from '../../utils'
import ExitComponent from '../../components/common/exitComponent';
import RNExitApp from 'react-native-exit-app';
const NoPermissionScreen = props => {
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const handleBackButtonClick = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      setExitModalVisible(true);
    }
    return true
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, [isAndroid]);
  return (
    <View style={styles.container}>
      <HomeHeaderView
        navigation={props.navigation}
      />
      <View style={styles.subView}>
        <View style={styles.centeredView}>
          <AccessDenied />
          <Text style={styles.NoPermissionStyle}>
            {translate('noPermission')}
          </Text>
          <Text style={styles.NoPermissionSubTextStyle}>
            {translate('noPermissionSubText')}
          </Text>
        </View>
        <Modal visible={exitModalVisible} transparent={true}>
        <ExitComponent
          title={translate('exitConfirmText')}
          yesAction={()=>RNExitApp.exitApp()}
          noAction={()=>setExitModalVisible(false)}
        />
      </Modal>
      </View>
    </View>
  );
};

export default NoPermissionScreen;
