import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LogBox,
  PermissionsAndroid,
  Modal,
  BackHandler,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import RNExitApp from 'react-native-exit-app';

import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  openSettings,
  checkMultiple,
} from 'react-native-permissions';
/**
 * custom imports
 */
import styles from './styles';
const { WINDOW_HEIGHT } = Mixins;
import { Mixins, Colors } from '../../config/styles';
import {
  getZonesPaging,
  hitSendPage,
  updateRecordingPath,
  updateSelectedZone,
} from '../../services/paging/action';
import { navigateToAlertScreen } from '../../services/alert/action';
import CustomButton from '../../components/common/customButton';
import { translate } from '../../translations/translationHelper';
import CustomFlatList from '../../components/common/customFlatlist';
import HomeHeaderView from '../../components/common/homeHeaderView';
import CallDetectorManager from 'react-native-call-detection';
import {
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
} from 'react-native-audio-recorder-player';
import BottomSheetModal from '../../components/common/bottomSheetModal';

import {
  MicIcon,
  SearchIcon,
  CancelIcon,
  DropDownIcon,
  StartRecording,
  StopRecording,
  PlayIcon,
  PauseIcon,
  SendIcon,
  StartOverIcon,
} from '../../config/imageConstants';
import NotificationPopupModal from '../../components/common/customNotificationModal';
import CustomPopupModal from '../../components/common/customModal';
import {
  toggleNotificationAlert,
  toggleNotificationPopup,
} from '../../services/notification/action';
import CustomSlider from './slider';
import * as RNFS from 'react-native-fs';
import PagingStatusView from '../../components/common/pagingStatusView';
import { updatePagingModalFields } from '../../services/paging/action';
import ExitComponent from '../../components/common/exitComponent';
import utils from '../../utils';
import AudioPlayerInstance from '../../config/audioPlayerInstance';
import SendingPageAnimation from '../../components/common/pagingStatusView/sendingPageAnimation';
import { sentryErrorHandler } from '../../utils/errorHandler';
import { globalStateUpdate } from '../../services/globalState/action';
import ModalView from '../../components/common/modalView';
import { startNotification, stopNotification } from '../../services/home/action';

const { isAndroid, tablet, showAlert, showMessageOnToast } = utils;
const HomeScreen = props => {
  const dispatch = useDispatch();
  const { notificationAlert } = useSelector(state => state.notification);
  const { appStatus, internetConnected, isFoldableDevice } = useSelector(
    state => state.app,
  );
  const { selectedZoneData, recordingPath, audioData } = useSelector(
    state => state.paging,
  );
  let callDetector = undefined;

  const { toggleNavigate } = useSelector(state => state.alert);
  const { stopAllFlag } = useSelector(state => state.globalReducer);
  const { bottom } = useSelector(state => state.app.safeAreaInset);
  const showNotificationPopup = props.route.params.notificationPermission;
  const [modalVisible, setModalVisible] = useState(false);
  const [zonesData, setZonesData] = useState(null);
  const [zonesDataCopy, setZonesDataCopy] = useState(null);
  const [search, setSearch] = useState('');
  const [zoneSelected, setSelectedZone] = useState(null);
  const [selectedZoneID, setSelectedZoneID] = useState(null);
  const [showNoZoneView, setShowNoZoneView] = useState(true);
  const [recording, setRecording] = useState(false);
  const [recordSec, setRecordSec] = useState(0);
  const [path, setPath] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingSec, setPlayingSec] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playingRatio, setPlayingRatio] = useState(0);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [permissionExitModal, setPermissionExitModal] = useState(false);

  const [showPermissionExitModal, setShowPermissionExitModal] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [sending, setSending] = useState(false);
  const [displayRecordSec, setDisplayRecordSec] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [audioPosition, setAudioPosition] = useState(0);

  useEffect(() => {
    async function getBluetoothConnectPermissionState() {
      const version = Platform.constants.Release;
      if (utils.isAndroid && version > 11) {
        const permissionState = await check(
          PERMISSIONS.ANDROID.READ_PHONE_STATE,
        );
        if (permissionState === RESULTS.GRANTED) {
        } else {
          const response = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
          if (response === RESULTS.BLOCKED || response === RESULTS.DENIED) {
            const innerResponse = await request(
              PERMISSIONS.ANDROID.READ_PHONE_STATE,
            );
            if (
              innerResponse === RESULTS.BLOCKED ||
              innerResponse === RESULTS.DENIED
            ) {
              setPermissionExitModal(true);
            }
          }
        }
      }
    }
    getBluetoothConnectPermissionState();
  }, []);

  useEffect(() => {
    callDetector = new CallDetectorManager(
      (event, phoneNumber) => {
        handleRecordingStatus();
        onPausePlay();
      },
      false,
      () => { },
      {
        title: 'Phone State Permission',
        message:
          'EPIC System needs access to your phone state in order to react and/or to adapt to incoming calls.',
      },
    );
    return () => {
      callDetector && callDetector.dispose();
    };
  }, [isPlaying, recording]);

  const handleBackButtonClick = () => {
    if (recording) {
      const buttons = [
        {
          text: translate('cancel'),
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: () => {
            if (props.navigation.canGoBack()) {
              props.navigation.navigate('Notifications');
            }
            dispatch(updatePagingModalFields('preventTabSwitch', false));
            dispatch(updateRecordingPath(''));
            dispatch(updateSelectedZone({}));
            AudioPlayerInstance.stopRecorder();
          },
        },
      ];
      showAlert(translate('appTitle'), translate('discardMsg'), buttons);
    } else if (isPlaying || showPlayer) {
      const buttons = [
        {
          text: translate('cancel'),
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: () => {
            if (props.navigation.canGoBack()) {
              props.navigation.navigate('Notifications');
            }
            dispatch(updatePagingModalFields('preventTabSwitch', false));
            dispatch(updateRecordingPath(''));
            dispatch(updateSelectedZone({}));
            AudioPlayerInstance.stopPlayer();
          },
        },
      ];
      showAlert(translate('appTitle'), translate('discardMsg'), buttons);
    } else if (props.navigation.canGoBack()) {
      props.navigation.navigate('Notifications');
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
  }, [isAndroid, recording, isPlaying, showPlayer]);

  useEffect(() => {
    toggleNavigate && props.navigation.navigate('Alerts');
    dispatch(navigateToAlertScreen(false));
  }, [toggleNavigate]);

  useEffect(() => {
    dispatch(toggleNotificationPopup(false));
    return () => {
      AudioPlayerInstance.stopRecorder();
      AudioPlayerInstance.stopPlayer();
    };
  }, []);

  const handleRecordingStatus = () => {
    if (recording) {
      setRecording(false);
      dispatch(updateRecordingPath(path));
      dispatch(
        updatePagingModalFields('audioData', {
          recordSec: recordSec,
          playingSec: playingSec,
        }),
      );
      onPauseRecord();
    }
  };

  useEffect(() => {
    setRecording(false);
    if (recordingPath && recordingPath?.length > 0) {
      setPath(recordingPath);
      setSelectedZone(selectedZoneData.zoneName);
      setSelectedZoneID(selectedZoneData.id);
      setShowPlayer(true);
      setShowNoZoneView(false);
      setRecording(false);
    }
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  useEffect(() => {
    if (appStatus === 'background') {
      handleRecordingStatus();
    }
    if (appStatus === 'background' && isPlaying) {
      onPausePlay();
    }
  }, [appStatus]);

  useEffect(() => {
    if (recording) {
      onPauseRecord();
    } else if (isPlaying) {
      onPausePlay();
    }
  }, [internetConnected]);

  const entireSchoolData = {
    appData: 'PJSIP/123456',
    created: '2021-12-30 14:55:19',
    extString: null,
    extension: 5000,
    id: 0,
    modified: null,
    parentId: 0,
    zoneName: 'Entire School',
  };

  useEffect(() => {
    dispatch(
      getZonesPaging(apiResponse => {
        if (apiResponse?.length > 0) {
          let modifiedData = [entireSchoolData, ...apiResponse];
          setZonesData(modifiedData);
          setZonesDataCopy(modifiedData);
        }
      }),
    );
  }, []);

  const toggleZoneAction = () => {
    setModalVisible(true);
  };

  const requiredPermissionsGranted = async () => {
    let allPermissionsGranted = false;
    try {
      if (utils.isAndroid && Platform.Version < 33) {
        const checkResponse = await checkMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        if (
          checkResponse['android.permission.WRITE_EXTERNAL_STORAGE'] !==
          PermissionsAndroid.RESULTS.GRANTED ||
          checkResponse['android.permission.READ_EXTERNAL_STORAGE'] !==
          PermissionsAndroid.RESULTS.GRANTED ||
          checkResponse['android.permission.RECORD_AUDIO'] !==
          PermissionsAndroid.RESULTS.GRANTED
        ) {
          allPermissionsGranted = false;
          const requestResponse = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          ]);
          if (
            requestResponse['android.permission.WRITE_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
            requestResponse['android.permission.READ_EXTERNAL_STORAGE'] !==
            PermissionsAndroid.RESULTS.GRANTED ||
            requestResponse['android.permission.RECORD_AUDIO'] !==
            PermissionsAndroid.RESULTS.GRANTED
          ) {
            allPermissionsGranted = false;
            setShowPermissionExitModal(true);
          } else {
            allPermissionsGranted = true;
          }
        } else {
          allPermissionsGranted = true;
        }
      } else if (utils.isAndroid && Platform.Version >= 33) {
        const checkResponse = await check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        if (checkResponse !== PermissionsAndroid.RESULTS.GRANTED) {
          allPermissionsGranted = false;
          const requestResponse = await request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          );
          if (requestResponse !== PermissionsAndroid.RESULTS.GRANTED) {
            allPermissionsGranted = false;
            setShowPermissionExitModal(true);
          } else {
            allPermissionsGranted = true;
          }
        } else {
          allPermissionsGranted = true;
        }
      }
    } catch (error) {
      allPermissionsGranted = false;
      sentryErrorHandler(error);
    }
    return allPermissionsGranted;
  };

  const onStartRecord = async () => {
    setDisabled(true);
    setRecordSec(0);
    try {
      if (utils.isAndroid) {
        let permissionState = await requiredPermissionsGranted();
        if (permissionState) {
          const audioSet = {
            AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
            AudioSourceAndroid: AudioSourceAndroidType.MIC,
            AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
            AVNumberOfChannelsKeyIOS: 2,
            AVFormatIDKeyIOS: AVEncodingOption.aac,
          };
          const uri = await AudioPlayerInstance.startRecorder(
            undefined,
            audioSet,
          );
          setTimeout(() => {
            setDisabled(false);
          }, 2000);
          AudioPlayerInstance.addRecordBackListener(e => {
            setRecording(true);
            setRecordSec(e.currentPosition);
            setDisplayRecordSec(e.currentPosition);
          });
          dispatch(updatePagingModalFields('preventTabSwitch', true));
          setPath(uri.toString());
        } else {
          setDisabled(false);
        }
      } else {
        const audioSet = {
          AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
          AudioSourceAndroid: AudioSourceAndroidType.MIC,
          AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
          AVNumberOfChannelsKeyIOS: 2,
          AVFormatIDKeyIOS: AVEncodingOption.aac,
        };
        const uri = await AudioPlayerInstance.startRecorder(
          undefined,
          audioSet,
        );
        setTimeout(() => {
          setDisabled(false);
        }, 2000);
        AudioPlayerInstance.addRecordBackListener(e => {
          setRecording(true);
          setRecordSec(e.currentPosition);
          setDisplayRecordSec(e.currentPosition);
        });
        dispatch(updatePagingModalFields('preventTabSwitch', true));
        setPath(uri.toString());
      }
    } catch (error) {
      sentryErrorHandler(error);
    }
  };

  const onPauseRecord = async () => {
    try {
      await AudioPlayerInstance.stopRecorder();
      setRecording(false);
      setShowPlayer(true);
      setPlayingRatio(0);
      setPlayingSec('00:00');
      AudioPlayerInstance.removeRecordBackListener();
    } catch (err) {
      setRecording(false);
      setShowPlayer(true);
      sentryErrorHandler(err);
      AudioPlayerInstance.removeRecordBackListener();
    }
  };

  useEffect(() => {
    playingSec > 0 &&
      setPlayingRatio(parseInt(playingSec) / parseInt(displayRecordSec));
  }, [playingSec]);

  const onResumePlay = async () => {
    await AudioPlayerInstance.resumePlayer();
    setIsPlaying(true);
  };
  const onStartPlay = async () => {
    if (audioPosition > 1000) {
      const msg = await AudioPlayerInstance.startPlayer(path);
      await AudioPlayerInstance.seekToPlayer(audioPosition);
      onResumePlay();
      setAudioPosition(0);
      return;
    } else {
      isPlaying && AudioPlayerInstance.stopPlayer();
      const msg = await AudioPlayerInstance.startPlayer(path);
      const volume = await AudioPlayerInstance.setVolume(1.0);
      const durationTime = await AudioPlayerInstance.setSubscriptionDuration(
        0.1,
      );
      setIsPlaying(true);
      AudioPlayerInstance.addPlayBackListener(e => {
        setDisplayRecordSec(e.duration);
        setPlayingSec(e.currentPosition);
        if (e.currentPosition === e.duration) {
          setIsPlaying(false);
          setAudioPosition(0);
        }
      });
    }
  };

  const onPausePlay = async () => {
    setIsPlaying(false);
    await AudioPlayerInstance.pausePlayer();
  };

  const onSlidingComplete = async position => {
    let audioPosition = position * displayRecordSec;
    setAudioPosition(audioPosition);
    await AudioPlayerInstance.seekToPlayer(audioPosition);
    if (!isPlaying) {
      onResumePlay();
    }
  };

  const onSlidingStart = async () => {
    setIsPlaying(false);
  };

  const executeSearch = value => {
    if (zonesDataCopy && zonesDataCopy?.length > 0) {
      if (value?.trim()?.length > 0) {
        let newData = zonesDataCopy.filter((item, index) => {
          const valueData = value.toLowerCase();
          const itemData = item.zoneName.toLowerCase();
          if (itemData.indexOf(valueData) > -1) {
            return Object.assign({}, item);
          }
        });
        setZonesData(newData);
      } else if (value === '') {
        setZonesData(zonesDataCopy);
      } else {
        resetList();
      }
      setSearch(value);
    } else {
      setSearch(value);
      return;
    }
  };

  const renderNoZoneView = () => {
    return (
      <View style={styles.centeredView}>
        <MicIcon
          height={
            tablet || isFoldableDevice
              ? Mixins.scaleSize(80)
              : Mixins.scaleSize(124)
          }
          width={
            tablet || isFoldableDevice
              ? Mixins.scaleSize(80)
              : Mixins.scaleSize(124)
          }
        />
        <Text style={styles.noZoneText}>{translate('noZone')}</Text>
        <Text style={styles.selectText}>{translate('selectZone')}</Text>
        <Text style={styles.selectText}>{translate('andPaging')}</Text>
        <CustomButton
          onPress={toggleZoneAction}
          buttonText={translate('selectZoneText')}
          containerStyle={styles.buttonStyle}
        />
      </View>
    );
  };

  const closeZoneModal = () => {
    setModalVisible(false);
  };

  const renderSearchView = () => {
    return (
      <View style={styles.renderTopView}>
        <View style={styles.rowContainer}>
          <Text style={styles.zoneText}>{translate('selectZoneText')}</Text>
          <TouchableOpacity
            style={styles.cancelIconStyle}
            onPress={closeZoneModal}>
            <CancelIcon
              height={Mixins.scaleSize(25)}
              width={Mixins.scaleSize(25)}
              style={styles.iconStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchInputContainer}>
          <View style={styles.searchButtonStyle}>
            <SearchIcon
              height={Mixins.scaleSize(14)}
              width={Mixins.scaleSize(14)}
            />
          </View>
          <TextInput
            placeholderTextColor={Colors.COLOR_B0B6BB}
            placeholder={translate('searchZone')}
            style={styles.inputPass}
            onChangeText={executeSearch}
            value={search}
          />
        </View>
      </View>
    );
  };

  const renderZones = rowData => {
    const { zoneName, id } = rowData.item;
    const zoneSelectionAction = () => {
      setSelectedZone(zoneName);
      setSelectedZoneID(id);
      dispatch(updatePagingModalFields('selectedZoneData', rowData.item));
      setTimeout(() => {
        closeZoneModal();
        setShowNoZoneView(false);
      }, 200);
    };

    return (
      <TouchableOpacity
        style={
          zoneSelected === zoneName
            ? styles.listingButtonViewPress
            : styles.listingButtonView
        }
        onPress={() => zoneSelectionAction(zoneName, id)}>
        <Text style={styles.listingText(isFoldableDevice)}>{zoneName}</Text>
      </TouchableOpacity>
    );
  };

  const ListEmptyComponent = () => {
    const zonesDataLength = zonesData && zonesData?.length;
    return zonesDataLength === 0 || zonesDataLength === null ? (
      <Text style={styles.noZoneTextStyle}>{translate('noZoneAvaliable')}</Text>
    ) : null;
  };

  const renderZoneList = () => {
    return (
      <BottomSheetModal
        height={WINDOW_HEIGHT * 0.5}
        isVisible={modalVisible}
        containerStyle={styles.baseModalStyle}
        bounces={true}
        onHideCompletion={closeZoneModal}
        value={1}
        {...props}>
        {renderSearchView()}
        <CustomFlatList
          data={zonesData}
          renderItem={renderZones}
          bounces={false}
          ListEmptyComponent={ListEmptyComponent}
        />
      </BottomSheetModal>
    );
  };

  const showBottomSheetAgain = () => {
    toggleZoneAction();
  };

  const handleRecordAction = () => {
    recording ? onPauseRecord() : () => (setDisabled(true), onStartRecord());
  };

  const renderRecordingView = () => {
    const formatData = moment.utc(parseInt(recordSec)).format('HH:mm:ss');
    return (
      <View
        style={
          tablet || isFoldableDevice
            ? styles.tabCenteredViewZoneSelected(isFoldableDevice)
            : styles.centeredViewZoneSelected(bottom)
        }>
        <Text style={styles.timerText(recording, isFoldableDevice)}>
          {formatData}
        </Text>
        <Text style={styles.tapToStartRecording(recording, isFoldableDevice)}>
          {translate('recording')}
        </Text>
        <MicIcon
          style={{ marginTop: tablet ? Mixins.scaleSize(10) : null }}
          height={
            tablet
              ? Mixins.scaleSize(80)
              : isFoldableDevice
                ? Mixins.scaleSize(60)
                : Mixins.scaleSize(124)
          }
          width={
            tablet
              ? Mixins.scaleSize(80)
              : isFoldableDevice
                ? Mixins.scaleSize(60)
                : Mixins.scaleSize(124)
          }
        />
        <Text style={styles.recordingTap(isFoldableDevice)}>
          {recording
            ? translate('tapToStopRecording')
            : translate('tapToStartRecording')}
        </Text>
        <TouchableOpacity
          disabled={disabled}
          onPress={recording ? onPauseRecord : onStartRecord}>
          {recording ? (
            <StopRecording
              height={
                tablet || isFoldableDevice
                  ? Mixins.scaleSize(50)
                  : Mixins.scaleSize(70)
              }
              width={
                tablet || isFoldableDevice
                  ? Mixins.scaleSize(50)
                  : Mixins.scaleSize(70)
              }
            />
          ) : (
            <StartRecording
              height={
                tablet || isFoldableDevice
                  ? Mixins.scaleSize(50)
                  : Mixins.scaleSize(70)
              }
              width={
                tablet || isFoldableDevice
                  ? Mixins.scaleSize(50)
                  : Mixins.scaleSize(70)
              }
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderSelectedZoneView = () => {
    return (
      <View>
        <Text style={styles.zoneStaticText}>{translate('zone')}</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.dropdownView}
          onPress={showBottomSheetAgain}>
          <Text style={styles.dropDownText}>{zoneSelected}</Text>
          <DropDownIcon
            width={Mixins.scaleSize(16)}
            height={Mixins.scaleSize(9.4)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const handlePreviewRecording = () => {
    isPlaying
      ? onPausePlay()
      : playingSec > 0 && playingSec !== displayRecordSec
        ? onResumePlay()
        : onStartPlay();
  };

  const unlinkPreviousAudio = audioPath => {
    RNFS.exists(audioPath)
      .then(result => {
        if (result) {
          return RNFS.unlink(audioPath)
            .then(() => {
              setPath('');
              dispatch(updatePagingModalFields('recordingPath', ''));
              dispatch(updatePagingModalFields('audioData', {}));
            })
            .catch(err => {
              sentryErrorHandler(err);
            });
        }
      })
      .catch(err => {
        sentryErrorHandler(err);
      });
  };

  const handleStartOverAction = () => {
    setRecordSec(0);
    setPlayingSec(0);
    setIsPlaying(false);
    unlinkPreviousAudio(path);
    setShowPlayer(false);
    setPlayingRatio(0);
    isPlaying && AudioPlayerInstance.stopPlayer();
    dispatch(updatePagingModalFields('preventTabSwitch', false));
  };

  const convertAudioToBase64 = () => {
    const zoneId = selectedZoneID === 0 ? [] : [selectedZoneID];
    setSending(true);
    RNFS.readFile(`${path}`, 'base64')
      .then(msg => {
        let payload = {
          audio: msg,
          zoneIds: zoneId,
        };
        dispatch(updatePagingModalFields('preventTabSwitch', false));
        setSending(true);
        dispatch(
          hitSendPage(payload, resp => {
            resp.statusCode === 200
              ? setSuccessModalVisible(true)
              : setFailureModalVisible(true);
            setSending(false);
          }),
        );
      })
      .catch(error => {
        setTimeout(() => {
          setSending(false);
          utils.showToast('Nothing to page, please record again.');
        }, 1000);
        sentryErrorHandler(error);
      });
  };

  const renderPlayerView = () => {
    return (
      <View
        style={{
          flex: 1,
          marginTop: tablet
            ? Mixins.scaleSize(60)
            : isFoldableDevice
              ? Mixins.scaleSize(20)
              : Mixins.scaleSize(142),
          marginHorizontal: Mixins.scaleSize(16),
        }}>
        <View style={styles.sliderContainer}>
          <TouchableOpacity onPress={handlePreviewRecording}>
            {isPlaying ? (
              <PauseIcon
                height={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(44)
                    : Mixins.scaleSize(44)
                }
                width={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(44)
                    : Mixins.scaleSize(44)
                }
                style={{ marginStart: Mixins.scaleSize(5) }}
              />
            ) : (
              <PlayIcon
                height={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(44)
                    : Mixins.scaleSize(44)
                }
                width={
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(44)
                    : Mixins.scaleSize(44)
                }
                style={{ marginStart: Mixins.scaleSize(5) }}
              />
            )}
          </TouchableOpacity>
          <CustomSlider
            onSlidingComplete={onSlidingComplete}
            onSlidingStart={onSlidingStart}
            playingRatio={playingRatio}
          />
        </View>
        <View style={styles.playTimerContainer}>
          <Text style={styles.preview}>Preview</Text>
          <Text style={styles.playDurationText}>{`${playingSec !== 0
            ? moment.utc(parseInt(playingSec)).format('mm:ss')
            : '00:00'
            }/${displayRecordSec !== 0
              ? moment.utc(parseInt(displayRecordSec)).format('mm:ss')
              : '00:00'
            }`}</Text>
        </View>
        <CustomButton
          containerStyle={styles.sendPageButton(isFoldableDevice)}
          onPress={convertAudioToBase64}
          icon={
            <SendIcon
              width={Mixins.scaleSize(22)}
              height={Mixins.scaleSize(22)}
              style={styles.sendIcon}
            />
          }
          buttonText={translate('sendPage')}
        />
        <TouchableOpacity
          onPress={() => dispatch(toggleNotificationAlert(true))}
          style={styles.startoverButton(isFoldableDevice)}>
          <StartOverIcon
            style={styles.StartOverIcon}
            width={Mixins.scaleSize(18)}
            height={Mixins.scaleSize(18)}
          />
          <Text style={styles.startOverText}>{translate('startOver')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const successAction = () => {
    handleStartOverAction();
    setSuccessModalVisible(false);
    setShowNoZoneView(true);
    setSelectedZone('');
    dispatch(updatePagingModalFields('selectedZone', ''));
    dispatch(updatePagingModalFields('selectedZoneData', {}));
  };

  const failureAction = () => {
    setFailureModalVisible(false);
    convertAudioToBase64();
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
    dispatch(startNotification(innerPayload, res => { }));
  };

  const stopAll = () => {
    triggerApiCall();
    dispatch(
      stopNotification(async res => {
        if (res === true) {
          showMessageOnToast({ text1: translate('stopAllSuccess') });
        }
      }),
    );
    dispatch(globalStateUpdate('stopAllFlag', false));
  };

  const cancelAction = () => {
    setFailureModalVisible(false);
  };

  const hideModal = () => {
    setFailureModalVisible(false);
  };
  const isZoneSelected = !!zoneSelected;
  return (
    <View style={styles.container}>
      <HomeHeaderView navigation={props.navigation} />
      <View style={styles.subView}>
        {showNoZoneView && !modalVisible && renderNoZoneView()}
        {showNotificationPopup && (
          <NotificationPopupModal navigation={props.navigation} />
        )}
        {renderZoneList()}
        {isZoneSelected && renderSelectedZoneView()}
        {isZoneSelected && !showPlayer && renderRecordingView()}
        {isZoneSelected && !recording && showPlayer && renderPlayerView()}
      </View>
      <Modal visible={notificationAlert} transparent={true}>
        <CustomPopupModal
          startButton={translate('startOver')}
          cancelButton={translate('continueWithSame')}
          title={translate('startOverAlert')}
          subTitle={translate('startOverDescription')}
          cancelButtonAction={() => {
            dispatch(toggleNotificationAlert(false));
          }}
          startButtonAction={() => {
            dispatch(toggleNotificationAlert(false));
            handleStartOverAction();
          }}
        />
      </Modal>
      <Modal visible={successModalVisible} transparent={true}>
        <PagingStatusView success={true} successAction={successAction} />
      </Modal>
      <Modal
        visible={failureModalVisible}
        transparent={true}
        hideModal={hideModal}
        backdrop={true}>
        <PagingStatusView
          success={false}
          failureAction={failureAction}
          cancelAction={cancelAction}
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
      <Modal visible={sending} transparent={true}>
        <SendingPageAnimation />
      </Modal>
      <Modal visible={permissionExitModal} transparent={true}>
        <ExitComponent
          title={
            showPermissionExitModal
              ? translate('permissionAlert')
              : translate('showPermissionAlert')
          }
          noAction={() => RNExitApp.exitApp()}
          button1Title={translate('exitApp')}
          button2Title={translate('givePermission')}
          yesAction={() => {
            setPermissionExitModal(false);
            openSettings();
          }}
        />
      </Modal>
    </View>
  );
};

export default HomeScreen;
