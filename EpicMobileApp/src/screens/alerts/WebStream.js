import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from './styles';
import {translate} from '../../translations/translationHelper';
import utils from '../../utils';
import {Mixins} from '../../config/styles';
import {useDispatch, useSelector} from 'react-redux';
import CustomWebView from '../../components/common/customWebView';
import {MapIcon} from '../../config/imageConstants';
import {
  getAlertToken,
  getAlertTokenForMap,
  getDeviceByRoomId,
  getMapsList,
  updateAlertData,
} from '../../services/alert/action';
const {tablet, cameraDriver} = utils;

const WebStream = ({
  roomID,
  DeviceNameForCanvasString,
  onPressForStream,
  onPressForMap,
  socketInstance,
  eventName,
}) => {
  const dispatch = useDispatch();
  const {verifiedServerUrl} = useSelector(state => state.auth);
  const {prevMapToken, prevStreamToken, mapsList} = useSelector(
    state => state.alert,
  );
  const formatUrl = verifiedServerUrl.replace(/(^\w+:|^)\/\//, '').slice(0, -1);
  const [alertStreamToken, setAlertStreamToken] = useState('');
  const [alertMapToken, setAlertMapToken] = useState('');
  const [viewStream, setViewStream] = useState(false);
  const [border, setBorder] = useState(false);
  const [id, setid] = useState(null);

  useEffect(() => {
    return () => {
      socketInstance.send(
        JSON.stringify({
          action: 'STOPSTREAM',
          deviceName: id,
          safeAlert: true,
        }),
      );
    };
  }, []);

  useEffect(() => {
    if (roomID) {
      getToken();
    } else if (mapsList?.length === 0) {
      dispatch(getMapsList(false));
    } else {
      dispatch(
        getAlertTokenForMap(mapsList[0]?.mapId, res => {
          setAlertMapToken(res.data);
        }),
      );
    }
    return () => {
      setAlertStreamToken('');
      setAlertMapToken('');
    };
  }, [mapsList]);

  const getToken = () => {
    let deviceDetail;
    let alertTokenId;
    let isCameraDrivernull = true;
    setViewStream(false);
    if (roomID) {
      dispatch(
        getDeviceByRoomId(roomID, response => {
          if (utils.IsJsonString(response.message)) {
            deviceDetail = JSON.parse(response.message);
          }
          !!alertStreamToken && setAlertStreamToken('');
          !!alertMapToken && setAlertMapToken('');
          if (deviceDetail && deviceDetail?.length > 0) {
            deviceDetail.map(item => {
              const deviceName = item.driverName;
              const ID = item.id;
              cameraDriver.map(drivers => {
                if (drivers === deviceName) {
                  isCameraDrivernull = false;
                  setViewStream(true);
                  alertTokenId = ID;
                  setid(ID);
                  dispatch(updateAlertData('cameraDriverName', deviceName));
                }
              });
              if (isCameraDrivernull === true) {
                dispatch(updateAlertData('cameraDriverName', ''));
              }
            });
          }
          dispatch(
            getAlertToken(alertTokenId, res => {
              setAlertStreamToken(res.data);
            }),
          );
          dispatch(
            getAlertTokenForMap(DeviceNameForCanvasString, res => {
              setAlertMapToken(res.data);
            }),
          );
        }),
      );
    }
  };

  const checkNewAndPrevStreamTokens = () => {
    if (prevStreamToken === alertStreamToken) {
      setAlertMapToken('');
      dispatch(
        getAlertTokenForMap(DeviceNameForCanvasString, res => {
          setAlertMapToken(res.data);
        }),
      );
    }
    dispatch(updateAlertData('prevStreamToken', alertStreamToken));
  };

  function waitForSocketConnection(callback) {
    setTimeout(function () {
      if (socketInstance.readyState === 1) {
        if (callback != null) {
          callback();
        }
      } else {
        waitForSocketConnection(callback);
      }
    }, 5);
  }

  const onError = arg => {
    getToken();
  };

  const renderStreamView = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <View style={styles.webViewStream}>
          {alertStreamToken?.length !== 0 &&
            typeof alertStreamToken === 'string' && (
              <CustomWebView
                redirectionUrl={`https://${formatUrl}:4001/alerts/stream?token=${alertStreamToken}`}
                loadingState={true}
                changeLoaderStyle={{marginBottom: Mixins.scaleSize(75)}}
                scalesPageToFit={false}
                contentMode={'desktop'}
                onError={onError}
                onLoadEnd={() => {
                  checkNewAndPrevStreamTokens();
                }}
                onLoadStart={() => {
                  let msg = JSON.stringify({
                    action: 'PLAYESTREAM',
                    deviceName: id,
                    safeAlert: true,
                  });
                  waitForSocketConnection(function () {
                    socketInstance.send(msg);
                  });
                }}
                containerStyle={{
                  width: Mixins.scaleSizeWidth(319),
                  alignSelf: 'center',
                  justifyContent: 'center',
                }}
              />
            )}
        </View>
        <TouchableOpacity
          style={styles.mapButtonContainer}
          onPress={onPressForMap}>
          <MapIcon
            height={tablet ? Mixins.scaleSize(12) : Mixins.scaleSize(12)}
            width={tablet ? Mixins.scaleSize(12) : Mixins.scaleSize(12)}
          />
          <Text style={styles.viewMapText}>{translate('viewMap')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const checkNewAndPrevMapTokens = () => {
    if (prevMapToken === alertMapToken) {
      setAlertMapToken('');
      dispatch(
        getAlertTokenForMap(DeviceNameForCanvasString, res => {
          setAlertMapToken(res.data);
        }),
      );
    }
    dispatch(updateAlertData('prevMapToken', alertMapToken));
  };

  const renderMapView = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPressForMap}
        style={styles.webViewMap(border)}>
        {alertMapToken?.length !== 0 && typeof alertMapToken === 'string' && (
          <CustomWebView
            redirectionUrl={
              roomID
                ? `https://${formatUrl}:4001/alerts/viewMap?token=${alertMapToken}`
                : `https://${formatUrl}:4001/alerts/viewMap?token=${alertMapToken}&mapId=${mapsList[0]?.mapId}`
            }
            loadingState={true}
            scalesPageToFit={true}
            onError={onError}
            onLoadStart={() => {
              setBorder(true);
            }}
            onLoadEnd={() => {
              checkNewAndPrevMapTokens();
            }}
            changeLoaderStyle={{marginBottom: Mixins.scaleSize(200)}}
            containerStyle={{
              width: Mixins.scaleSizeWidth(319),
              justifyContent: 'center',
            }}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.eventSubView}>
      {viewStream && eventName !== 'safeAlertNonPaired'
        ? renderStreamView()
        : renderMapView()}
    </View>
  );
};

export default WebStream;
