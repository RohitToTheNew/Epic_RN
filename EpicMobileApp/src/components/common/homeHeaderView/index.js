import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal, Image} from 'react-native';
import {User, LogoutIcon} from '../../../config/imageConstants';
import {translate} from '../../../translations/translationHelper';
import {Mixins} from '../../../config/styles';
import styles from './styles';
import utils from '../../../utils';
import {useSelector, useDispatch} from 'react-redux';
import {
  logout,
  resetPermissionData,
  saveUserInfo,
} from '../../../services/authorization/action';
import LocalStorageServices from '../../../services/localStorage';
import {LOGGED_IN_SESSION} from '../../../config/constants';
import ExitComponent from '../exitComponent';
import {toggleNotificationPopup} from '../../../services/notification/action';
import {updateAppModalFields} from '../../../services/app/action';
const {isIpad} = utils;
const HomeHeaderView = ({navigation, style}) => {
  const dispatch = useDispatch();
  const top = useSelector(state => state.app.safeAreaInset.top);
  const schoolName = useSelector(state => state.auth.schoolName);
  const schoolNameAvailable = schoolName?.length > 0;
  const {user, verifiedServerUrl} = useSelector(state => state.auth);
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, settoastVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const {isFoldableDevice} = useSelector(state => state.app);
  const showPopUp = () => {
    setModalVisible(!modalVisible);
  };

  const logOutPress = () => {
    setModalVisible(false);
    setExitModalVisible(true);
  };

  const handleLogOutAction = () => {
    setExitModalVisible(false);
    dispatch(
      logout(async res => {
        await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
        dispatch(updateAppModalFields('isLoggedOut', true));
        navigation.replace('Login');
        dispatch(resetPermissionData());
        dispatch(saveUserInfo({}));
      }),
    );
  };

  const showModal = () => {
    settoastVisible(true);
    setTimeout(() => {
      settoastVisible(false);
    }, 3000);
  };

  const handleBackdrop = () => {
    setModalVisible(false);
  };

  const profiletapped = () => {
    setModalVisible(!modalVisible);
    dispatch(toggleNotificationPopup(false));
    navigation.navigate('Profile');
  };

  const renderNameModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={toastVisible}
        onRequestClose={() => {
          setModalVisible(!toastVisible);
        }}>
        <TouchableOpacity style={styles.schoolNameContainer(top)}>
          <Text style={styles.schoolText}>{schoolName}</Text>
        </TouchableOpacity>
      </Modal>
    );
  };

  const icon = user && !!user.image ? user.image : null;
  let iconUrl = verifiedServerUrl + `/uploads/userImg/${icon}`;
  return (
    <View style={[styles.container(top), style]}>
      <View style={styles.subContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.titleContainer}
          onPress={
            schoolNameAvailable && schoolName?.length > 27 ? showModal : null
          }>
          <Text style={styles.titleStyle} numberOfLines={1}>
            {schoolNameAvailable ? schoolName : null}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showPopUp} activeOpacity={1}>
          {icon && (
            <Image
              style={[
                styles.userIcon(isFoldableDevice),
                {position: 'absolute', zIndex: 99},
              ]}
              source={{uri: iconUrl}}
              resizeMode="cover"
            />
          )}
          <User
            height={isIpad ? Mixins.scaleSize(18) : Mixins.scaleSize(30)}
            width={isIpad ? Mixins.scaleSize(18) : Mixins.scaleSize(30)}
          />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity onPress={handleBackdrop} style={styles.centeredView}>
          <View style={styles.modalView(top)}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={profiletapped}>
              <User
                height={isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(20)}
                width={isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(20)}
              />
              <Text style={styles.logoutText}>{translate('profile')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={logOutPress}>
              <LogoutIcon
                height={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
                width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
                style={styles.logoutIconStyle}
              />
              <Text style={styles.logoutText}>{translate('logout')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
      {renderNameModal()}
      <Modal visible={exitModalVisible} transparent={true}>
        <ExitComponent
          title={translate('logoutConfirmText')}
          yesAction={handleLogOutAction}
          noAction={() => setExitModalVisible(false)}
        />
      </Modal>
    </View>
  );
};

export default HomeHeaderView;
