import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  BackHandler,
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
/**
 * custom imports
 */
import {translate} from '../../translations/translationHelper';
import RNExitApp from 'react-native-exit-app';

import styles from './styles';
import {Mixins} from '../../config/styles';
import HomeHeaderView from '../../components/common/homeHeaderView';
import NotificationPopupModal from '../../components/common/customNotificationModal';
import {isAndroid} from '../../utils';
import utils from '../../utils';
import ExitComponent from '../../components/common/exitComponent';
import TextInputModal from '../../components/common/textInputModal';
import {NoSafeAlert} from '../../config/imageConstants';
import {useSelector, useDispatch} from 'react-redux';
import CustomPopupModal from '../../components/common/customModal';
import {
  acknowledgeSafeAlert,
  getActiveAlerts,
  getLockdownDashboardData,
  navigateToAlertScreen,
  triggerAlertEvents,
  updateAlertData,
} from '../../services/alert/action';
import ViewMapScreen from './ViewMapScreen';
import {toggleNotificationPopup} from '../../services/notification/action';
import ModalView from '../../components/common/modalView';
import {globalStateUpdate} from '../../services/globalState/action';
import {startNotification, stopNotification} from '../../services/home/action';
import LockdownDashboard from './LockdownDashboard';
import AlertItem from './alertItem';
import LockdownSummary from './LockdownSummary';

const {tablet, showMessageOnToast} = utils;
const Alerts = props => {
  const showNotificationPopup = props.route.params.notificationPermission;
  const socketInstance = props.route.params.socketInstance;
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [isSelected, setIsSelected] = useState(-1);
  const [refreshWebStream, setRefreshWebStream] = useState(false);
  const [endEventModalVisible, setEndEventModal] = useState(false);
  const [lockdownModalVisible, setlockdownModalVisible] = useState(false);
  const [escalateModalVisible, setEscalateModalVisible] = useState(false);
  const [alertItem, setAlertItem] = useState(null);
  const [acknowledgePerformAction, setAcknowledgePerform] = useState(false);
  const [lockdownPerformAction, setLockdownPerformAction] = useState(false);
  const [escalatePerformAction, setEscalatePerformAction] = useState(false);
  const [endEventPerformAction, setEndEventPerformAction] = useState(false);
  const [viewEventLogAction, setViewEventLogAction] = useState(false);
  const [deviceNameForCanvasString, setDeviceNameForCanvasString] =
    useState('');

  const isvisible = useSelector(state => state.notification.toggleNotification);
  const eventTitle = useSelector(
    state => state.notification.notificationEventTitle,
  );

  const {
    safeAlertEventDetail,
    activeAlerts,
    cameraDriverName,
    showLockdownDashboard,
    mapScreenVisible,
  } = useSelector(state => state.alert);
  const {userPermission} = useSelector(state => state.auth);
  const {appStatus, certificatesValid, secureCheckIn} = useSelector(
    state => state.app,
  );
  const {stopAllFlag} = useSelector(state => state.globalReducer);

  const dispatch = useDispatch();

  useEffect(() => {
    checkUserPermission();
    dispatch(toggleNotificationPopup(false));
    dispatch(getLockdownDashboardData());
  }, []);

  /**
   * function to handle the hardware back button click
   */
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

  /**
   * function to read alerts list from epic
   * @param {boolean} showLoader
   * @param {function} afterEffect function to execute after the api call
   */
  const getAlertList = (showLoader, afterEffect) => {
    dispatch(
      getActiveAlerts(showLoader, apiResponse => {
        if (apiResponse?.length > 0) {
          isSelected === -1 && setIsSelected[apiResponse[0].id];
        }
        afterEffect();
      }),
    );
  };

  useEffect(() => {
    getAlertList(true, () => {});
  }, []);

  useEffect(() => {
    if (activeAlerts?.length > 0) {
      isSelected === -1 && setIsSelected(activeAlerts[0].id);
      const parsedEventData = JSON.parse(activeAlerts[0].event_params);
      const parseDevicePointOnCanvasString =
        parsedEventData.event.senderInfo.devicePointOnCanvasString ||
        parsedEventData.event.deviceInfo.deviceName + '~0';
      setDeviceNameForCanvasString(parseDevicePointOnCanvasString);
    }
  }, [activeAlerts]);

  useEffect(() => {
    setTimeout(() => {
      dispatch(
        getActiveAlerts(false, apiResponse => {
          if (apiResponse?.length > 0) {
            isSelected === -1 && setIsSelected[apiResponse[0].id];
          } else {
            setIsSelected(-1);
          }
        }),
      );
      dispatch(getLockdownDashboardData());
    }, 500);
  }, [safeAlertEventDetail]);

  useEffect(() => {
    setTimeout(() => {
      if (appStatus === 'active') {
        dispatch(
          getActiveAlerts(false, apiResponse => {
            if (apiResponse?.length > 0) {
              isSelected === -1 && setIsSelected[apiResponse[0].id];
            }
          }),
        );
      }
    }, 1000);
  }, [appStatus]);

  useEffect(() => {
    if (activeAlerts?.length > 0) {
      isSelected === -1 && setIsSelected(activeAlerts[0].id);
    }
  }, [activeAlerts]);

  const tabPermission = utils.getTabPermission;

  /**
   * function to check user permission for the associated safe alert event actions
   */
  const checkUserPermission = () => {
    let acknowledgePermission;
    let lockdownPermission;
    let escalatePermission;
    let endEventPermission;
    let eventLogsPermission;
    let filteredArray;
    if (userPermission) {
      filteredArray =
        userPermission &&
        userPermission?.length > 0 &&
        userPermission.map(item => {
          return {module: item.module_name, Permission: item.permission};
        });
      acknowledgePermission = tabPermission(
        filteredArray,
        translate('acknowledgePermission'),
      );
      lockdownPermission = tabPermission(
        filteredArray,
        translate('lockdownPermission'),
      );
      escalatePermission = tabPermission(
        filteredArray,
        translate('escalatePermission'),
      );
      endEventPermission = tabPermission(
        filteredArray,
        translate('endEventPermission'),
      );
      eventLogsPermission = tabPermission(
        filteredArray,
        translate('eventLogsPermission'),
      );
      if (acknowledgePermission) {
        setAcknowledgePerform(true);
      }
      if (lockdownPermission) {
        setLockdownPerformAction(true);
      }
      if (escalatePermission) {
        setEscalatePerformAction(true);
      }
      if (endEventPermission) {
        setEndEventPerformAction(true);
      }
      if (eventLogsPermission) {
        setViewEventLogAction(true);
      }
    }
  };

  /**
   * function to handle the acknowledge action event
   * @param {object} rowData rowdata
   */
  const acknowledgeAction = rowData => {
    let tempItem = JSON.parse(rowData.item.event_params).event;
    const payload = {
      alertId: rowData.item.id,
      eventIndex: null,
      eventName: rowData.item.eventName,
      devicePointOnCanvasString: tempItem.senderInfo.devicePointOnCanvasString,
      msDeviceId: rowData.item.msDeviceId,
      listenSettingEnabled: tempItem.deviceInfo.isListenAll,
    };
    dispatch(acknowledgeSafeAlert(payload));
  };

  /**
   * function to handle the Escalate button press
   * @param {object} rowData
   */
  const escalateAction = rowData => {
    setEscalateModalVisible(true);
    setAlertItem(rowData);
  };

  /**
   * function to handle the escalate event action
   */
  const sendEscalateData = () => {
    setEscalateModalVisible(false);
    let tempItem = JSON.parse(alertItem.item.event_params).event;
    let payload = {
      event: {
        action: {},
        eventName: 'escalate',
        freshEvent: true,
        clientId: tempItem.clientId,
        roomName: `${tempItem.senderInfo.roomId}`,
      },
    };
    dispatch(triggerAlertEvents(payload, response => {}));
  };

  /**
   * function to show the lockdown action pop up modal
   * @param {object} rowData
   */
  const lockdownAction = rowData => {
    setlockdownModalVisible(true);
    setAlertItem(rowData);
  };

  /**
   * function to handle the lockdown action event
   */
  const sendLockdownData = () => {
    let tempItem = JSON.parse(alertItem.item.event_params).event;
    let payload = {
      event: {
        source: tempItem.source,
        eventName: 'lockDown',
        actionName: tempItem.actionName,
        deviceInfo: tempItem.deviceInfo,
        senderInfo: tempItem.senderInfo,
        freshEvent: tempItem.freshEvent,
        clientId: tempItem.clientId,
        runtimeInputs: tempItem.runtimeInputs,
        userInfo: tempItem.userInfo,
        dateTimeOfEvent: tempItem.dateTimeOfEvent,
        emailActionUrl: tempItem.emailActionUrl,
        alertLogID: alertItem.item.id,
        eventID: 18,
        cameraDeviceName: cameraDriverName,
        comment: '',
      },
    };
    setlockdownModalVisible(false);
    dispatch(
      triggerAlertEvents(payload, response => {
        if (response.statusCode === 200 && !!showNotificationPopup) {
          dispatch(toggleNotificationPopup(false));
          props.navigation.navigate('Notifications');
        }
      }),
    );
  };

  /**
   * function to show End event modal
   * @param {object} item
   */
  const endEventAction = item => {
    setEndEventModal(true);
    setAlertItem(item);
  };

  /**
   * function to render the no safealert screen
   */
  const noSafeAlertScreen = () => {
    return (
      <>
        {!showLockdownDashboard && (
          <View style={styles.noSafeAlertContainer(showLockdownDashboard)}>
            <NoSafeAlert
              height={
                showLockdownDashboard
                  ? tablet
                    ? Mixins.scaleSize(36)
                    : Mixins.scaleSize(86)
                  : tablet
                  ? Mixins.scaleSize(56)
                  : Mixins.scaleSize(86)
              }
              width={
                showLockdownDashboard
                  ? tablet
                    ? Mixins.scaleSize(36)
                    : Mixins.scaleSize(86)
                  : tablet
                  ? Mixins.scaleSize(56)
                  : Mixins.scaleSize(86)
              }
            />
            <Text style={styles.noSafeAlertText(showLockdownDashboard)}>
              {translate('noSafeAlert')}
            </Text>
            <Text style={styles.subText(showLockdownDashboard)}>
              {translate('everythingIsGood')} {`\n`}
              {translate('noActiveSafeAlert')}
            </Text>
          </View>
        )}
      </>
    );
  };

  /**
   * function to render the Safe alert event item
   * @param {object} rowData rowdata
   * @returns
   */
  const renderAlertItem = rowData => {
    return (
      <AlertItem
        key={rowData.item.id}
        rowData={rowData}
        setIsSelected={setIsSelected}
        isSelected={isSelected}
        endEventAction={endEventAction}
        acknowledgePerformAction={acknowledgePerformAction}
        socketInstance={socketInstance}
        setDeviceNameForCanvasString={setDeviceNameForCanvasString}
        endEventPerformAction={endEventPerformAction}
        viewEventLogAction={viewEventLogAction}
        acknowledgeAction={acknowledgeAction}
        escalateAction={escalateAction}
        lockdownAction={lockdownAction}
        navigation={props.navigation}
        showNotificationPopup={showNotificationPopup}
      />
    );
  };

  /**
   * function to hide the event pop up modal
   */
  const closeEventModal = () => {
    setEndEventModal(false);
  };

  /**
   * function to handle the trigger event action api call
   * @param {object} data event data
   */
  const sendDataToParent = data => {
    setEndEventModal(false);
    let tempItem = JSON.parse(alertItem.item.event_params).event;
    let payload = {
      event: {
        source: tempItem.source,
        eventName: 'endEvent',
        actionName: tempItem.actionName,
        deviceInfo: tempItem.deviceInfo,
        senderInfo: tempItem.senderInfo,
        freshEvent: tempItem.freshEvent,
        clientId: tempItem.clientId,
        runtimeInputs: tempItem.runtimeInputs,
        userInfo: tempItem.userInfo,
        dateTimeOfEvent: tempItem.dateTimeOfEvent,
        emailActionUrl: tempItem.emailActionUrl,
        alertLogID: alertItem.item.id,
        cameraDeviceName: cameraDriverName,
        comment: data,
      },
    };
    dispatch(
      triggerAlertEvents(payload, response => {
        if (response.statusCode === 200) {
          dispatch(getActiveAlerts(true, () => {}));
          if (activeAlerts?.length === 1) {
            setTimeout(() => {
              setIsSelected(-1);
            }, 1500);
          }
        }
      }),
    );
  };

  /**
   * function to refresh the stream token
   */
  const refreshStreamToken = () => {
    setRefreshWebStream(true);
    getAlertList(false, () => {
      const selected = isSelected;
      setIsSelected(-1);
      setIsSelected(selected);
      setRefreshWebStream(false);
    });
  };

  /**
   * function to handle the StopAll api call
   */
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

  /**
   * function to handle the StopAll button press
   */
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

  return (
    <View testID="alertsScreen" style={styles.container}>
      <HomeHeaderView navigation={props.navigation} />
      <View style={styles.subView}>
        {showNotificationPopup && isvisible && (
          <NotificationPopupModal navigation={props.navigation} />
        )}
        {secureCheckIn && showLockdownDashboard && <LockdownDashboard />}
        <FlatList
          data={activeAlerts}
          renderItem={renderAlertItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={noSafeAlertScreen}
          contentContainerStyle={{paddingTop: Mixins.scaleSize(6)}}
          refreshControl={
            <RefreshControl
              refreshing={refreshWebStream}
              onRefresh={refreshStreamToken}
            />
          }
        />
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
        <Modal visible={exitModalVisible} transparent={true}>
          <ExitComponent
            title={translate('exitConfirmText')}
            yesAction={() => RNExitApp.exitApp()}
            noAction={() => setExitModalVisible(false)}
          />
        </Modal>
        <Modal visible={endEventModalVisible} transparent={true}>
          <TextInputModal
            title={translate('endingThisSafe')}
            subTitle={translate('enterComment')}
            cancelAction={() => closeEventModal()}
            sendDataToParent={sendDataToParent}
          />
        </Modal>
        <Modal visible={lockdownModalVisible} transparent={true}>
          <CustomPopupModal
            startButton={translate('start1')}
            cancelButton={translate('cancel')}
            notificationAlert={true}
            selectedAlert={translate('lockdown')}
            cancelButtonAction={() => {
              setlockdownModalVisible(false);
            }}
            startButtonAction={() => {
              sendLockdownData();
            }}
          />
        </Modal>
        <Modal visible={escalateModalVisible} transparent={true}>
          <CustomPopupModal
            title={translate('initializeEscalate')}
            startButton={translate('confirm')}
            cancelButton={translate('cancel')}
            cancelButtonAction={() => {
              setEscalateModalVisible(false);
            }}
            startButtonAction={() => {
              sendEscalateData();
            }}
          />
        </Modal>
        <Modal visible={mapScreenVisible} animationType={'slide'}>
          <ViewMapScreen
            onPress={() => {
              dispatch(updateAlertData('mapScreenVisible', false));
            }}
            DeviceNameForCanvasString={deviceNameForCanvasString}
          />
        </Modal>
        <LockdownSummary />
      </View>
    </View>
  );
};

export default Alerts;
