import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
/**
 * custom imports
 */
import {LOGGED_IN_SESSION} from '../../config/constants';
import LocalStorageServices from '../../services/localStorage';
import {NoInternet, LogoutIcon} from '../../config/imageConstants';
import styles from './styles';
import {translate} from '../../translations/translationHelper';
import {Colors, Mixins} from '../../config/styles';
import {
  validateServerUrl,
} from '../../services/authorization/action';
import {useDispatch, useSelector} from 'react-redux';
import {resetPermissionData} from '../../services/authorization/action';
import {updateAppModalFields} from '../../services/app/action';
import utils from '../../utils';
import {globalStateUpdate} from '../../services/globalState/action';
const {isIpad, renderIf} = utils;
const ConnectionScreen = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const {verifiedServerUrl} = useSelector(state => state.auth);
  const {serverDisconnected, routeName} = useSelector(
    state => state.globalReducer,
  );
  const {navigationInstance, isFoldableDevice} = useSelector(
    state => state.app,
  );
  const top = useSelector(state => state.app.safeAreaInset.top);
  const [loggedInFlag, setLoggedInFlag] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const loggedSession = await LocalStorageServices.getItem(
        LOGGED_IN_SESSION,
      );
      setLoggedInFlag(loggedSession);
    };
    fetchData();
  }, []);

  const checkServerStatus = () => {
    setRefreshing(true);
    dispatch(
      validateServerUrl(
        false,
        verifiedServerUrl.substring(0, verifiedServerUrl.length - 1),
        response => {
          setRefreshing(false);
          if (response.statusCode && response.statusCode !== 504) {
            dispatch(globalStateUpdate('serverDisconnected', false));
            setRefreshing(false);
            dispatch(globalStateUpdate('revalidateSession', true));
          } else {
            if (routeName === 'Login') {
              dispatch(globalStateUpdate('serverDisconnected', false));
            } else {
              dispatch(globalStateUpdate('serverDisconnected', true));
            }
          }
        },
      ),
    );
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (serverDisconnected) {
      checkServerStatus();
    } else {
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
    }
  }, []);

  const logOutPress = async () => {
    await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
    navigationInstance.replace('Login');
    dispatch(resetPermissionData());
    dispatch(updateAppModalFields('initialRouteName', 'Login'));
    dispatch(globalStateUpdate('serverDisconnected', false));
    dispatch(updateAppModalFields('isLoggedOut', true));
  };

  const renderLogoutView = () => {
    return (
      <TouchableOpacity
        style={styles.logoutContainer(top)}
        onPress={logOutPress}>
        <LogoutIcon
          height={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
          width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(20)}
          style={styles.logoutIconStyle}
        />
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {Platform.OS === 'ios' && (
        <View style={styles.preHeaderCompStyle}>
          <ActivityIndicator color={Colors.COLOR_000000} />
        </View>
      )}
      <View style={styles.subContainer}>
        {renderIf(loggedInFlag && serverDisconnected, renderLogoutView())}
        <NoInternet style={styles.noInternetIcon(isFoldableDevice)} />
        <View style={styles.textContainer}>
          <Text style={styles.offlineTextStyle}>{translate('oops')}</Text>
          <Text style={styles.offlineTextStyle}>
            {translate('offlineText')}
          </Text>
          <Text style={styles.checkConfigStyle}>
            {translate('checkConfig')}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.pullDownText(isFoldableDevice)}>
          {translate('pullDownRefresh')}
        </Text>
      </View>
      {Platform.OS === 'ios' && <View style={styles.postComponentStyle} />}
    </ScrollView>
  );
};

export default ConnectionScreen;
