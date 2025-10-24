import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  BackHandler,
  FlatList,
  RefreshControl,
} from 'react-native';
/**
 * custom imports
 */
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {StartButton, StopButton} from '../../config/imageConstants';
import {translate} from '../../translations/translationHelper';
import {
  getNotificationsList,
  saveNotificationsList,
  startNotification,
  stopNotification,
} from '../../services/home/action';
import HomeHeaderView from '../../components/common/homeHeaderView';
import utils from '../../utils';
import {
  getNotificationsStatus,
  toggleNotificationAlert,
  toggleNotificationPopup,
} from '../../services/notification/action';
import {navigateToAlertScreen} from '../../services/alert/action';
import CustomPopupModal from '../../components/common/customModal';
import ExitComponent from '../../components/common/exitComponent';
import RNExitApp from 'react-native-exit-app';
import {Mixins} from '../../config/styles';
import {
  globalStateUpdate,
  updateLoadingStatus,
} from '../../services/globalState/action';
import ModalView from '../../components/common/modalView';
import {getSecureCheckIn} from '../../services/authorization/action';
const {isAndroid, isIpad, showMessageOnToast} = utils;

const Notifications = props => {
  const dispatch = useDispatch();
  let {notificationsList} = useSelector(state => state.home);
  const {notificationDetail, notificationAlert, notificationsCopyList} =
    useSelector(state => state.notification);

  const {appStatus, internetConnected} = useSelector(state => state.app);
  const {verifiedServerUrl} = useSelector(state => state.auth);
  const {userPermission} = useSelector(state => state.auth);
  const {toggleNavigate} = useSelector(state => state.alert);
  const {stopAllFlag, serverDisconnected} = useSelector(
    state => state.globalReducer,
  );
  const [notificationItem, setNotificationItem] = useState({});
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleBackButtonClick = () => {
    if (props.navigation.canGoBack()) {
      props.navigation.goBack();
    } else {
      setExitModalVisible(true);
    }
    return true;
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

  useEffect(() => {
    setTimeout(() => {
      if (notificationsList?.length > 0) {
        checkUserPermission();
        return;
      }
      if (appStatus === 'active') {
        dispatch(toggleNotificationPopup(false));
        checkUserPermission();
        return;
      }
      if (!serverDisconnected) {
        dispatch(toggleNotificationPopup(false));
        checkUserPermission();
        return;
      }
      if (internetConnected) {
        dispatch(toggleNotificationPopup(false));
        checkUserPermission();
        return;
      }
    }, 1500);
  }, [notificationDetail, appStatus, serverDisconnected, internetConnected]);

  const tabPermission = utils.getTabPermission;

  const checkUserPermission = () => {
    let viewAlertPermission, filteredArray;
    if (userPermission) {
      filteredArray =
        userPermission?.length > 0 &&
        userPermission.map(item => {
          return {module: item.module_name, Permission: item.permission};
        });
      viewAlertPermission = tabPermission(
        filteredArray,
        translate('alertsModule'),
      );
      if (viewAlertPermission) {
        dispatch(
          getNotificationsStatus(() => {
            dispatch(updateLoadingStatus(false));
            setRefreshing(false);
          }),
        );
      } else {
        dispatch(updateLoadingStatus(false));
        setRefreshing(false);
      }
    }
  };

  useEffect(() => {
    dispatch(updateLoadingStatus(true));
    dispatch(
      getNotificationsList(() => {
        checkUserPermission();
      }),
    );
  }, []);

  useEffect(() => {
    toggleNavigate && props.navigation.navigate('Alerts');
    dispatch(navigateToAlertScreen(false));
  }, [toggleNavigate]);

  const handleStartNotification = () => {
    let tempData = notificationsList,
      selectedItem = tempData[notificationItem.index];
    let payload = {
      event: {
        eventID: selectedItem.id,
        eventName: selectedItem.name,
        freshEvent: true,
        senderInfo: {
          senderId: '127.0.0.1',
          nearestDevices: [
            {
              deviceName: 'server',
              receiverId: '127.0.0.1',
              pairedStatus: 1,
              signalStrength: 0,
            },
          ],
        },
      },
    };
    dispatch(
      startNotification(payload, response => {
        if (response.statusCode === 200 && selectedItem.isStoppable) {
          tempData[notificationItem.index].notificationPlaying = true;
          dispatch(saveNotificationsList(tempData));
        } else if (
          response.statusCode === 200 &&
          selectedItem.name === 'allClear'
        ) {
          tempData.map(element => (element.notificationPlaying = false));
          dispatch(saveNotificationsList(tempData));
        }
      }),
    );
  };

  const triggerApiCall = () => {
    let innerPayload = {
      event: {
        eventName: 'stopAll',
        freshEvent: true,
        senderInfo: {
          staticServerIP: '127.0.0.1',
        },
      },
    };
    dispatch(startNotification(innerPayload, res => {}));
  };

  const stopAll = () => {
    triggerApiCall();
    dispatch(
      stopNotification(async res => {
        if (res === true) {
          showMessageOnToast({text1: translate('stopAllSuccess')});
        }
      }),
    );
    dispatch(globalStateUpdate('stopAllFlag', false));
  };

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(
      getNotificationsList(() => {
        checkUserPermission();
      }),
    );
  };

  const renderNotificationItem = rowData => {
    let {displayName, icon, notificationPlaying} = rowData.item,
      index = rowData.index;
    let iconUrl = verifiedServerUrl + `uploads/eventImage/${icon}`;

    const handleStopNotification = () => {
      let tempData = notificationsList,
        selectedItem = tempData[index];
      if (selectedItem.name !== 'allClear') {
        triggerApiCall();
        dispatch(
          stopNotification(async res => {
            if (res === true) {
              tempData.map(element => (element.notificationPlaying = false));
              dispatch(saveNotificationsList(tempData));
            }
          }),
        );
      }
    };

    const renderIcon = () => {
      let notificationIcon;
      if (icon) {
        notificationIcon = (
          <Image style={styles.notificationIcon} source={{uri: iconUrl}} />
        );
      } else {
        notificationIcon = <View style={styles.placeholderView} />;
      }
      return notificationIcon;
    };

    return (
      <View style={styles.notificationItemContainer(notificationPlaying)}>
        <View style={styles.subContainer}>
          {renderIcon()}
          <Text style={styles.notificationButtonText}>{displayName}</Text>
        </View>
        <TouchableOpacity
          testID={`startButton${index}`}
          activeOpacity={0.8}
          onPress={
            notificationPlaying
              ? handleStopNotification
              : () => {
                  dispatch(toggleNotificationAlert(true));
                  setNotificationItem(rowData);
                }
          }
          style={styles.startButtonContainer(notificationPlaying)}>
          {notificationPlaying ? (
            <StopButton
              style={styles.stopIconStyle}
              height={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
              width={isIpad ? Mixins.scaleSize(25) : Mixins.scaleSize(25)}
            />
          ) : (
            <StartButton
              style={styles.iconStyle}
              height={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
              width={isIpad ? Mixins.scaleSize(25) : Mixins.scaleSize(25)}
            />
          )}
          <Text style={styles.startButton}>
            {notificationPlaying ? translate('stop') : translate('start')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View testID="notificationsScreen" style={styles.container}>
      <HomeHeaderView navigation={props.navigation} />
      <View style={styles.subView}>
        <FlatList
          testID="notificationsListComponent"
          data={notificationsCopyList}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listStyle}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <Modal visible={notificationAlert} transparent={true}>
          <CustomPopupModal
            startButton={translate('start1')}
            cancelButton={translate('cancel')}
            notificationAlert={true}
            selectedAlert={
              (notificationItem.item && notificationItem.item.displayName) || ''
            }
            cancelButtonAction={() => {
              dispatch(toggleNotificationAlert(false));
            }}
            startButtonAction={() => {
              dispatch(toggleNotificationAlert(false));
              handleStartNotification();
            }}
          />
        </Modal>
        <Modal visible={exitModalVisible} transparent={true}>
          <ExitComponent
            title={translate('exitConfirmText')}
            yesAction={() => RNExitApp.exitApp()}
            noAction={() => setExitModalVisible(false)}
          />
        </Modal>
        <Modal visible={stopAllFlag} transparent={true}>
          <ModalView
            title={translate('confirmStopAll')}
            firstButtonText={translate('yesStopAll')}
            secondButtonText={translate('noCancel')}
            firstButtonAction={() => {
              stopAll();
            }}
            secondButtonAction={() => {
              dispatch(globalStateUpdate('stopAllFlag', false));
            }}
          />
        </Modal>
      </View>
    </View>
  );
};

export default Notifications;
