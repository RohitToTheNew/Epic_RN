import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import React, {useState} from 'react';
import {translate} from '../../translations/translationHelper';
import CustomButton from '../../components/common/customButton';
import styles from './styles';
import {TickIcon} from '../../config/imageConstants';
import {Mixins, Colors} from '../../config/styles';
import WebStream from './WebStream';
import {useDispatch, useSelector} from 'react-redux';
import utils from '../../utils';
import {useEffect} from 'react';
import {
  getConfiguredButtons,
  getMapsList,
  triggerAlertEvents,
  updateAlertData,
} from '../../services/alert/action';
const {tablet, capitalizeText, renderIf} = utils;

const AlertItem = ({
  rowData,
  isSelected,
  setIsSelected,
  socketInstance,
  endEventAction,
  escalateAction,
  lockdownAction,
  acknowledgeAction,
  viewEventLogAction,
  endEventPerformAction,
  acknowledgePerformAction,
  setDeviceNameForCanvasString,
  navigation,
  showNotificationPopup,
}) => {
  const {appStatus, certificatesValid, secureCheckIn} = useSelector(
    state => state.app,
  );

  const {cameraDriverName} = useSelector(state => state.alert);
  const dispatch = useDispatch();
  const [configuredButtons, setConfiguredButtons] = useState([]);
  const {id, title, body, log, event_params, active} = rowData.item;
  const parsedParams = JSON.parse(event_params).event;
  const roomID =
    parsedParams.deviceInfo.roomId || parsedParams.senderInfo.roomId;
  const eventName = parsedParams.eventName;

  const deviceNameForCanvasMap =
    parsedParams.senderInfo.devicePointOnCanvasString ||
    parsedParams.deviceInfo.deviceName + '~0';
  const {mapId, mapName} = parsedParams?.deviceInfo;
  const [loading, setLoading] = useState(false);

  let caption = '';
  const notificationAction = parsedParams.actionParams.find(
    e => e.method === 'notificationAlert',
  );
  if (notificationAction) {
    caption = notificationAction.params.input.caption;
  }

  /**
   * function to toggle the selected card to show in expanded view
   */
  const toggleSelectedCard = () => {
    isSelected === id ? setIsSelected(-1) : setIsSelected(id);
  };

  useEffect(() => {
    if (isSelected === id) {
      setLoading(true);
      dispatch(
        getConfiguredButtons(rowData, response => {
          setConfiguredButtons(response);
          setLoading(false);
        }),
      );
    }
  }, [isSelected, active]);

  /**
   * function to check the alert type and return title of alert
   * @returns title of the alert based on the alert type
   */
  const getAlertTitle = () => {
    let title;
    if (parsedParams?.minorAlert) {
      title =
        parsedParams?.unpaired === 'true'
          ? translate('minorNonPairedAlert')
          : translate('minorAlert');
    } else {
      const roomName =
        parsedParams.deviceInfo.roomDisplayName ||
        parsedParams.deviceInfo.roomName ||
        'NA';
      title =
        parsedParams.unpaired === 'true'
          ? `${translate('nonPairedText')}`
          : `${translate('safeAlertText')}${roomName}`;
    }
    return title;
  };

  /**
   *
   * @param {object} button object containing the button pressed details
   */
  const handleEventAction = button => {
    if (button.eventName === 'lockDown') {
      lockdownAction(rowData);
    } else if (button.eventName === 'escalate') {
      escalateAction(rowData);
    } else {
      const payload = {
        event: {
          source: parsedParams?.source,
          eventName: button?.eventName,
          deviceInfo: parsedParams?.deviceInfo,
          senderInfo: parsedParams?.senderInfo,
          freshEvent: true,
          alertLogID: id,
        },
      };
      dispatch(triggerAlertEvents(payload, response => {}));
    }
  };

  /**
   * function to render the safe alert associated buttons configured on epic
   * @param {number} active variable showing the state of safe alert
   * @param {boolean} endEventPerformAction boolean indicating the permission to perform event action
   */
  const renderButtons = (active, endEventPerformAction) => {
    return (
      <>
        {active === 2 && endEventPerformAction && (
          <CustomButton
            onPress={() => endEventAction(rowData)}
            buttonText={translate('endEvent')}
            containerStyle={styles.buttonStyle}
            textStyle={styles.textStyle}
          />
        )}
        <View style={styles.configuredButtonStyle}>
          {loading ? (
            <ActivityIndicator
              size={'large'}
              color={Colors.COLOR_003D7D}
              style={styles.loaderStyle}
            />
          ) : (
            configuredButtons?.map(element => {
              return (
                <CustomButton
                  onPress={() => handleEventAction(element)}
                  buttonText={element.displayName}
                  containerStyle={styles.escalateButtonStyle(
                    configuredButtons?.length,
                  )}
                  textStyle={styles.textStyle}
                />
              );
            })
          )}
        </View>
      </>
    );
  };

  /**
   * function to get maps list
   */
  const onViewMapPress = () => {
    dispatch(updateAlertData('mapId', {mapId, mapName}));
    dispatch(getMapsList(true));
  };

  return (
    <View testID={`alertItem${rowData.item.id}`} style={styles.alertContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleSelectedCard}
        style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={styles.subContainer}>
          {isSelected === id && (
            <TickIcon
              height={tablet ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
              width={tablet ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
            />
          )}
        </View>
        <Text style={styles.safeAlertText}>{getAlertTitle()}</Text>
      </TouchableOpacity>
      {isSelected === id && (
        <React.Fragment>
          {setDeviceNameForCanvasString(deviceNameForCanvasMap)}
          <View style={styles.lineView} />
          {renderIf(
            viewEventLogAction,
            <View style={styles.subTextView}>
              <Text style={styles.captionText}>{translate('caption')}</Text>
              <Text style={styles.captionSubText}>{caption}</Text>
              <Text style={styles.captionText}>{translate('log')}</Text>
              <Text style={styles.captionSubText}>{capitalizeText(log)}</Text>
            </View>,
          )}

          <View style={styles.buttonContainer}>
            {active === 1 && acknowledgePerformAction ? (
              <CustomButton
                onPress={() => acknowledgeAction(rowData)}
                buttonText={translate('acknowledge')}
                containerStyle={styles.buttonStyle}
                textStyle={styles.textStyle}
              />
            ) : (
              renderButtons(active, endEventPerformAction)
            )}
            {!certificatesValid && (
              <View style={styles.webViewStream}>
                <Text style={styles.certificateError}>
                  {translate('invalidCertificates')}
                </Text>
              </View>
            )}
            {appStatus === 'active' && certificatesValid && (
              <WebStream
                roomID={roomID}
                socketInstance={socketInstance}
                DeviceNameForCanvasString={deviceNameForCanvasMap}
                eventName={eventName}
                onPressForStream={() => {
                  dispatch(updateAlertData('mapScreenVisible', true));
                }}
                onPressForMap={onViewMapPress}
              />
            )}
          </View>
        </React.Fragment>
      )}
    </View>
  );
};

export default AlertItem;
