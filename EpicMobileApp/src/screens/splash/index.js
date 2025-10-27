import React, { useEffect, useRef } from 'react';
import { StatusBar, View, Linking } from 'react-native';
import LottieView from 'lottie-react-native';
import LocalStorageServices from '../../services/localStorage';
import { LOGGED_IN_SESSION } from '../../config/constants';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserPermissions,
  saveSignedInUserInfo,
  updateAuthUserDeatils,
  validateServerUrl,
} from '../../services/authorization/action';
/**
 * custom imports
 */
import { translate } from '../../translations/translationHelper';
import styles from './styles';
import utils from '../../utils';
import {
  updateAppModalFields,
  updateServerStatus,
} from '../../services/app/action';
import {
  getActiveAlerts,
  getLockdownDashboardData,
} from '../../services/alert/action';
import { globalStateUpdate } from '../../services/globalState/action';

const Splash = props => {
  const dispatch = useDispatch();
  const { passwordChange, verifiedServerUrl } = useSelector(state => state.auth);
  const { isLoggedOut, secureCheckIn } = useSelector(state => state.app);
  const { routeName, revalidateSession } = useSelector(
    state => state.globalReducer,
  );
  const [loggedIn, setLoggedIn] = React.useState(null);
  const [apiVersionStatus, setApiVersionStatus] = React.useState(null);

  const onAnimationFinished = args => {
    if (loggedIn) {
      if (passwordChange) {
        props.navigation.replace('ChangePassword');
        return;
      } else if (apiVersionStatus && !apiVersionStatus.forceUpdateFlag) {
        dispatch(globalStateUpdate('isVisible', true));
        dispatch(globalStateUpdate('apiVersionStatus', apiVersionStatus));
        return;
      }
      dispatch(updateAuthUserDeatils('userName', ''));
      dispatch(updateAuthUserDeatils('password', ''));
      if (!isLoggedOut) {
        getUserPermissionApiHandler();
      } else {
        props.navigation.replace('Login');
      }
    } else {
      dispatch(updateAuthUserDeatils('password', ''));
      dispatch(updateAuthUserDeatils('userName', ''));
      props.navigation.replace('Login');
    }
  };

  useEffect(() => {
    async function fetchLoginSession() {
      const loginSession = await getLogInSession();
      setLoggedIn(loginSession);
      if (!!loginSession) {
        dispatch(
          validateServerUrl(false, verifiedServerUrl.slice(0, -1), response => {
            if (response.statusCode == 200) {
              let forceUpdateRequest = utils.checkApiVersion(
                response.data.apiVersion,
              );
              setApiVersionStatus(forceUpdateRequest);
            } else if (response.statusCode === 504) {
              dispatch(globalStateUpdate('serverDisconnected', true));
            } else if (response.statusCode === 401 && routeName == !'Login') {
              props.navigation.replace('Login');
            }
          }),
        );
      }
    }
    fetchLoginSession();
    dispatch(updateAppModalFields('navigationInstance', props.navigation));
    dispatch(globalStateUpdate('serverDisconnected', false));

  }, []);

  useEffect(() => {
    Linking.getInitialURL().then(url => { });
    let listener = Linking.addEventListener('url', url => { });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    if (revalidateSession) {
      onAnimationFinished();
    }
  }, [revalidateSession]);

  /**
   * function to read user permission from epic and render tabs based on that
   */
  const getUserPermissionApiHandler = () => {
    dispatch(
      getUserPermissions(false, async res => {
        dispatch(updateAppModalFields('initialRouteName', null));
        let filteredData;
        if (res) {
          filteredData =
            res?.length > 0 &&
            res.map(item => {
              return {
                module: item.module_name,
                Permission: item.permission,
              };
            });
        }
        let alertsPermission =
          filteredData?.length > 0
            ? utils.getTabPermission(filteredData, translate('alertsModule'))
            : null;
        if (alertsPermission) {
          if (secureCheckIn) {
            dispatch(
              getLockdownDashboardData(() => {
                dispatch(updateAppModalFields('initialRouteName', 'Alerts'));
                props.navigation.replace('AppNavigator');
              }),
            );
          } else {
            dispatch(
              getActiveAlerts(false, apiResponse => {
                if (apiResponse?.length > 0) {
                  dispatch(updateAppModalFields('initialRouteName', 'Alerts'));
                  props.navigation.replace('AppNavigator');
                } else {
                  props.navigation.replace('AppNavigator');
                }
              }),
            );
          }
        } else {
          props.navigation.replace('AppNavigator');
        }
      }),
    );
    dispatch(globalStateUpdate('revalidateSession', false));
    setTimeout(() => {
      dispatch(saveSignedInUserInfo(async res => { }));
    }, 2000);
  };

  /**
   * function to read saved login session from local storage
   */
  const getLogInSession = async () => {
    const loggedSession = await LocalStorageServices.getItem(LOGGED_IN_SESSION);
    return loggedSession;
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {/* <LottieView
        testID="splashLottie"
        onAnimationFinish={onAnimationFinished}
        source={require('../../assets/lottieJson/iOSSplash.json')}
        autoPlay
        loop={false}
        resizeMode="cover"
      /> */}

      <LottieView
        testID="splashLottie"
        onAnimationFinish={onAnimationFinished}
        source={require('../../assets/lottieJson/iOSSplash.json')}
        autoPlay
        loop={false}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

export default Splash;
