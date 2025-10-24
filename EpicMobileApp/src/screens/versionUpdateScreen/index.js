import {View, Text, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from './styles';
import {
  AppVersionIcon,
  EpicVersionIcon,
  LogoutIcon,
} from '../../config/imageConstants';
import {translate} from '../../translations/translationHelper';
import CustomButton from '../../components/common/customButton';
import utils from '../../utils';
import {Mixins} from '../../config/styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  resetPermissionData,
  updateAuthUserDeatils,
} from '../../services/authorization/action';
import LocalStorageServices from '../../services/localStorage';
import {globalStateUpdate} from '../../services/globalState/action';
import {LOGGED_IN_SESSION} from '../../config/constants';

const {tablet, isIpad, onUpdateTapped} = utils;

const VersionUpdateScreen = () => {
  const {navigationInstance} = useSelector(state => state.app);
  const {isVisible, apiVersionStatus} = useSelector(
    state => state.globalReducer,
  );
  const dispatch = useDispatch();

  const logOutPress = async () => {
    navigationInstance.replace('Login');
    dispatch(resetPermissionData());
    dispatch(updateAuthUserDeatils('userName', ''));
    dispatch(updateAuthUserDeatils('password', ''));
    await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
    dispatch(globalStateUpdate('isVisible', false));
  };

  const renderLogoutView = () => {
    return (
      <TouchableOpacity style={styles.logoutContainer} onPress={logOutPress}>
        <LogoutIcon
          height={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
          width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
        />
      </TouchableOpacity>
    );
  };

  const appVersion = () => {
    return (
      <View style={styles.appVersionContainer}>
        <AppVersionIcon
          style={styles.appIconStyle}
          height={tablet ? Mixins.scaleSize(150) : Mixins.scaleSize(190)}
          width={tablet ? Mixins.scaleSize(151) : Mixins.scaleSize(191)}
        />
        <Text style={styles.versionTitle}>{translate('appVersion')}</Text>
        <Text style={styles.versionSubText}>
          {translate('appVersionSubText')}
        </Text>
        <CustomButton
          onPress={() => {
            onUpdateTapped();
          }}
          buttonText={translate('update')}
          containerStyle={styles.buttonStyle}
        />
      </View>
    );
  };

  const epicVersion = () => {
    return (
      <View style={styles.epicVersionContainer}>
        <EpicVersionIcon
          style={styles.epicIconStyle}
          height={tablet ? Mixins.scaleSize(145) : Mixins.scaleSize(180)}
          width={tablet ? Mixins.scaleSize(240) : Mixins.scaleSize(285)}
        />
        <Text style={styles.versionTitle}>{translate('epicVersion')}</Text>
        <Text style={styles.versionSubText}>
          {translate('epicVersionSubText')}
        </Text>
      </View>
    );
  };

  return (
    <View>
      <Modal visible={isVisible} animationType={'slide'}>
        <View style={styles.mainContainer}>
          {renderLogoutView()}
          {!!apiVersionStatus && apiVersionStatus.updateRequired === 'mobile'
            ? appVersion()
            : epicVersion()}
        </View>
      </Modal>
    </View>
  );
};

export default VersionUpdateScreen;
