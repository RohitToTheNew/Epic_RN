import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  FlatList,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import utils from '../../utils';
import styles from './styles';
import {translate} from '../../translations/translationHelper';
import {Mixins, Colors} from '../../config/styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  CloseIcon,
  DropDownIcon,
  RefreshIcon,
  SearchIcon,
} from '../../config/imageConstants';
import CustomWebView from '../../components/common/customWebView';
import {
  getAlertTokenForMap,
  updateAlertData,
} from '../../services/alert/action';
import BottomSheetModal from '../../components/common/bottomSheetModal';
const {WINDOW_HEIGHT} = Mixins;

const {tablet} = utils;
const ViewMapScreen = ({onPress, DeviceNameForCanvasString}) => {
  const dispatch = useDispatch();
  const {verifiedServerUrl} = useSelector(state => state.auth);
  const {prevMapToken, mapsList, mapsListCopy, mapId} = useSelector(
    state => state.alert,
  );
  const {certificatesValid, isFoldableDevice} = useSelector(state => state.app);
  const [alertTokenForMap, setAlertTokenForMap] = useState('');
  const formatUrl = verifiedServerUrl.replace(/(^\w+:|^)\/\//, '').slice(0, -1);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMap, setSelectedMap] = useState(
    mapId?.mapId ? mapId : mapsList[0],
  );
  const [search, setSearch] = useState('');

  let spinValue = new Animated.Value(0);
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    !!alertTokenForMap && setAlertTokenForMap('');
    dispatch(
      getAlertTokenForMap(DeviceNameForCanvasString, res => {
        setAlertTokenForMap(res.data);
      }),
    );
    return () => {
      setAlertTokenForMap('');
      dispatch(updateAlertData('mapId', null));
    };
  }, []);

  /**
   * function to execute when map screen is closed
   */
  const onClose = () => {
    setAlertTokenForMap('');
    dispatch(updateAlertData(mapId, null));
    onPress();
  };

  /**
   * function to check new and previous token for the map screen
   */
  const checkNewAndPrevTokens = () => {
    if (prevMapToken === alertTokenForMap) {
      setAlertTokenForMap('');
      dispatch(
        getAlertTokenForMap(DeviceNameForCanvasString, res => {
          setAlertTokenForMap(res.data);
        }),
      );
    }

    dispatch(updateAlertData('prevMapToken', alertTokenForMap));
  };

  /**
   * function to handle the error in webview
   * @param {object} arg
   */
  const onError = arg => {
    !!alertTokenForMap && setAlertTokenForMap('');
    dispatch(
      getAlertTokenForMap(DeviceNameForCanvasString, res => {
        setAlertTokenForMap(res.data);
      }),
    );
  };

  /**
   * function to execute on map refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    !!alertTokenForMap && setAlertTokenForMap('');
    dispatch(
      getAlertTokenForMap(DeviceNameForCanvasString, res => {
        setAlertTokenForMap(res.data);
        setRefreshing(false);
      }),
    );
  };

  /**
   * function to hide the modal
   */
  const closeMapModal = () => {
    setModalVisible(false);
  };

  /**
   * function to render the map selected
   * @param {*} rowData rowdata object
   */
  const renderMaps = rowData => {
    return (
      <View>
        <TouchableOpacity
          style={
            selectedMap?.mapName === rowData?.item?.mapName
              ? styles.listingButtonViewPress
              : styles.listingButtonView
          }
          onPress={() => {
            setSelectedMap(rowData.item);
            setTimeout(() => {
              closeMapModal();
              setSearch('');
              dispatch(updateAlertData('mapsList', mapsListCopy));
              dispatch(
                getAlertTokenForMap(DeviceNameForCanvasString, res => {
                  setAlertTokenForMap(res.data);
                }),
              );
            }, 200);
          }}>
          <Text style={styles.listingText(isFoldableDevice)}>
            {rowData?.item?.mapName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * function to perform searching on maps list
   * @param {string} value textinput string value
   */
  const executeSearch = value => {
    if (mapsListCopy && mapsListCopy?.length > 0) {
      const newData =
        value?.trim()?.length > 0
          ? mapsListCopy.filter(item =>
              item?.mapName?.toLowerCase().includes(value?.toLowerCase()),
            )
          : mapsListCopy;
      dispatch(updateAlertData('mapsList', newData));
      setSearch(value);
    } else {
      setSearch(value);
      return;
    }
  };

  /**
   * function to render the header on bottom sheet modal
   */
  const renderModalHeaderView = () => {
    return (
      <View style={styles.modalHeaderContainer}>
        <View style={styles.closeIconContainer}>
          <Text style={styles.selectMapText}>{translate('selectMap')}</Text>
          <CloseIcon
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
        </View>
        <View style={styles.searchButtonStyle}>
          <SearchIcon
            height={Mixins.scaleSize(14)}
            width={Mixins.scaleSize(14)}
          />
          <TextInput
            placeholderTextColor={Colors.COLOR_B0B6BB}
            placeholder={translate('searchMap')}
            style={styles.inputPass}
            onChangeText={executeSearch}
            value={search}
          />
        </View>
      </View>
    );
  };

  /**
   * function to render the maps list in bottom sheet modal
   */
  const renderMapList = () => {
    return (
      <BottomSheetModal
        height={WINDOW_HEIGHT * 0.6}
        isVisible={modalVisible}
        containerStyle={styles.baseModalStyle}
        onHideCompletion={closeMapModal}
        bounces={true}
        value={1}>
        {renderModalHeaderView()}
        <FlatList
          data={mapsList}
          renderItem={renderMaps}
          bounces={false}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheetModal>
    );
  };

  /**
   * function to handle the refresh map button press
   */
  const onRefreshButtonPress = () => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
      isInteraction: false,
    }).start(() => {
      !!alertTokenForMap && setAlertTokenForMap('');
      dispatch(
        getAlertTokenForMap(DeviceNameForCanvasString, res => {
          setAlertTokenForMap(res.data);
          setRefreshing(false);
        }),
      );
      spinValue.setValue(0);
    });
  };

  /**
   * function to handle the dropdown press
   */
  const onDropdownPress = () => {
    if (mapsList?.length > 1) {
      setModalVisible(true);
    }
  };

  return (
    <>
      <View style={styles.mapViewContainer}>
        <View style={styles.mapViewHeader}>
          <TouchableOpacity onPress={onClose}>
            <CloseIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(25) : Mixins.scaleSize(35)}
              width={tablet ? Mixins.scaleSize(25) : Mixins.scaleSize(35)}
            />
          </TouchableOpacity>
          <Text style={styles.mapViewText}>{translate('mapView')}</Text>
          <TouchableOpacity onPress={onRefreshButtonPress}>
            <Animated.View style={{transform: [{rotate: spin}]}}>
              <RefreshIcon
                width={Mixins.scaleSize(32)}
                height={Mixins.scaleSize(32)}
              />
            </Animated.View>
          </TouchableOpacity>
        </View>
        <Text style={styles.mapHeading}>{translate('map')}</Text>
        <TouchableOpacity
          onPress={onDropdownPress}
          activeOpacity={1}
          style={styles.mapDropdownButton}>
          <Text style={styles.mapNameStyle}>{selectedMap?.mapName}</Text>
          {/* {mapsListCopy?.length > 1 && (
            <DropDownIcon
              width={Mixins.scaleSize(14)}
              height={Mixins.scaleSize(14)}
            />
          )} */}
        </TouchableOpacity>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {/*
            commenting out for now
            {renderMapList()}
          */}
          <View style={styles.mapViewSubConatiner}>
            <View style={styles.mapDisplayView}>
              {!certificatesValid && (
                <View style={styles.errorContainer}>
                  <Text style={styles.certificateError}>
                    {translate('invalidCertificates')}
                  </Text>
                </View>
              )}
              {!!alertTokenForMap && certificatesValid && (
                <CustomWebView
                  redirectionUrl={`https://${formatUrl}:4001/alerts/viewMap?token=${alertTokenForMap}&mapId=${selectedMap?.mapId}`}
                  loadingState={true}
                  scalesPageToFit={true}
                  onLoadEnd={() => {
                    checkNewAndPrevTokens();
                  }}
                  onError={onError}
                  changeLoaderStyle={{
                    marginBottom: tablet
                      ? Mixins.scaleSize(146)
                      : Mixins.scaleSize(200),
                  }}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ViewMapScreen;
