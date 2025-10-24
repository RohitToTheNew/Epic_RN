import React, { useEffect, useState } from 'react';
import { Image, Text, Linking, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors, Mixins } from '../config/styles';
import { translate } from '../translations/translationHelper';
import styles from './styles';
import Splash from '../screens/splash';
import Login from '../screens/login';
import ChangePassword from '../screens/changePassword';
import HomeScreen from '../screens/homeScreen';
import Notifications from '../screens/notifications';
import Alerts from '../screens/alerts';
import Schedule from '../screens/schedule';
import NoPermissionScreen from '../screens/noPermissionScreen';
import ReconnectingWebSocket from 'react-native-reconnecting-websocket';
import {
  toggleNotificationPopup,
  notificationTitle,
  notificationEventDetails,
} from '../services/notification/action';
import {
  updatePagingModalFields,
  updateRecordingPath,
  updateSelectedZone,
} from '../services/paging/action';
import {
  Alert,
  AlertSelected,
  BackArrow,
  Calendar,
  CalendarSelected,
  Notification,
  NotificationSelected,
  Paging,
  PagingSelected,
  StopAllIcon,
} from '../../src/config/imageConstants';
import {
  safeAlertEvent,
  navigateToAlertScreen,
  getLockdownDashboardData,
} from '../services/alert/action';
import { isIpad } from '../utils';
import utils from '../utils';
import AudioPlayerInstance from '../config/audioPlayerInstance';
import { updateAppModalFields } from '../services/app/action';
import { globalStateUpdate } from '../services/globalState/action';
import Profile from '../screens/profile';
import appConfig from '../config/appConfig';
import { getSecureCheckIn } from '../services/authorization/action';
const { showAlert, tablet } = utils;
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoginStack = () => {
  const data = useSelector(state => state.auth.userPermission);
  const showBottomNavigator = data && data?.length > 0 ? true : false;
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Splash"
        component={Splash}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ChangePassword"
        component={ChangePassword}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
      {showBottomNavigator ? (
        <Stack.Screen
          options={{ headerShown: false }}
          name="AppNavigator"
          component={BottomTab}
        />
      ) : (
        <Stack.Screen
          options={{ headerShown: false }}
          name="AppNavigator"
          component={NoPermissionScreen}
        />
      )}
    </Stack.Navigator>
  );
};

const tabPermission = utils.getTabPermission;

const StopAllView = () => {
  return null;
};

const BottomTab = ({ navigation }) => {
  const data = useSelector(state => state.auth.userPermission);
  const { preventTabSwitch } = useSelector(state => state.paging);
  const { initialRouteName, appStatus, internetConnected, isFoldableDevice } =
    useSelector(state => state.app);
  const { activeAlerts } = useSelector(state => state.alert);
  const { secureCheckIn } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const { verifiedServerUrl } = useSelector(state => state.auth);
  const formatUrl = verifiedServerUrl.replace(/(^\w+:|^)\/\//, '').slice(0, -1);
  const socket = new ReconnectingWebSocket(`wss://${formatUrl}:9003`, null, {
    reconnectInterval: 1000,
  });

  useEffect(() => {
    Linking.getInitialURL().then(url => {
      activeAlerts?.length > 0 && navigation.navigate('Alerts');
    });
    let listener = Linking.addEventListener('url', url => {
      activeAlerts?.length > 0 && navigation.navigate('Alerts');
    });
    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    socket.onmessage = eventData => {
      const parseEventData = JSON.parse(eventData.data);
      if (parseEventData.action != undefined) {
        if (parseEventData.action === 'notificationAlert') {
          const Data = JSON.parse(parseEventData.data);
          if (
            appConfig.safeAlertEventsList.indexOf(
              Data.event.eventName.toLowerCase(),
            ) > -1
          ) {
            if (showAlertsTab) {
              dispatch(navigateToAlertScreen(true));
              dispatch(safeAlertEvent(Data));
            }
          } else {
            const eventTitle = Data.event.action.params.input.title;
            if (
              secureCheckIn &&
              eventTitle?.toLowerCase().includes('lockdown')
            ) {
              dispatch(
                getLockdownDashboardData(() => {
                  dispatch(navigateToAlertScreen(true));
                }),
              );
            } else {
              dispatch(notificationEventDetails(Data));
              dispatch(notificationTitle(eventTitle));
              appStatus === 'active' && dispatch(toggleNotificationPopup(true));
            }
          }
        } else if (parseEventData.action === 'broadcastMessage') {
          const broadcasteventData = JSON.parse(eventData.data);
          const event = broadcasteventData.data;
          const Data = { event };
          if (
            appConfig.broadcastEventsList.indexOf(
              event.eventName.toLowerCase(),
            ) > -1
          ) {
            dispatch(safeAlertEvent(Data));
            return;
          }
          dispatch(notificationEventDetails(Data));
        }
      }
    };
    socket.onclose = e => {
      setTimeout(() => {
        socket.reconnect();
      }, 3000);
    };
    socket.onerror = e => {
      socket.reconnect();
    };
    return () => {
      socket.close();
    };
  }, [secureCheckIn]);

  useEffect(() => {
    if (internetConnected) {
      setTimeout(() => {
        socket.reconnect();
      }, 1000);
    }
  }, [internetConnected]);

  useEffect(() => {
    if (appStatus === 'active') {
      socket.reconnect();
    }
  }, [appStatus]);
  let filteredArray;
  let showPagingTab;
  let showNotificationsTab;
  let showAlertsTab;
  let showScheduleTab;
  let startNotificationPermission;
  let viewNotificationPermission;
  let copySaveSchedulerPermission;
  let viewSchedulerPermission;
  let stopAllPermission;
  if (data) {
    filteredArray =
      data &&
      data?.length > 0 &&
      data?.map(item => {
        return { module: item.module_name, Permission: item.permission };
      });
    showPagingTab = tabPermission(filteredArray, translate('pagingModule'));
    startNotificationPermission = tabPermission(
      filteredArray,
      translate('startNotificationsModule'),
    );
    viewNotificationPermission = tabPermission(
      filteredArray,
      translate('notificationsModule'),
    );
    if (viewNotificationPermission === true) {
      showNotificationsTab = true;
    }
    if (
      viewNotificationPermission === true &&
      startNotificationPermission === true
    ) {
      showNotificationsTab = true;
    }
    showAlertsTab = tabPermission(filteredArray, translate('alertsModule'));
    viewSchedulerPermission = tabPermission(
      filteredArray,
      translate('scheduleModule'),
    );
    copySaveSchedulerPermission = tabPermission(
      filteredArray,
      translate('copySchedulerModule'),
    );
    if (
      viewSchedulerPermission === true ||
      copySaveSchedulerPermission === true
    ) {
      showScheduleTab = true;
    }
  }
  stopAllPermission = tabPermission(
    filteredArray,
    translate('stopAllPermission'),
  );
  let alertIconRed = require('../assets/images/alertPng.png');

  useEffect(() => {
    dispatch(getSecureCheckIn());
    dispatch(updateAppModalFields('navigationInstance', navigation));
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={initialRouteName ? initialRouteName : null}
      screenOptions={{
        keyboardHidesTabBar: true,
        tabBarStyle: styles.tabcontainer(isFoldableDevice),
        activeTintColor: Colors.COLOR_003D7D,
        inactiveTintColor: Colors.COLOR_808284,
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}>
      {showNotificationsTab && (
        <Tab.Screen
          name="Notifications"
          component={Notifications}
          tabPress={() => dispatch(toggleNotificationPopup(false))}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              if (preventTabSwitch) {
                const buttons = [
                  {
                    text: translate('cancel'),
                    onPress: () => {
                      e.preventDefault();
                    },
                    style: 'cancel',
                  },
                  {
                    text: translate('yes'),
                    onPress: () => {
                      navigation.navigate('Notifications');
                      dispatch(
                        updatePagingModalFields('preventTabSwitch', false),
                      );
                      dispatch(updateRecordingPath(''));
                      dispatch(updateSelectedZone({}));
                      AudioPlayerInstance.stopPlayer();
                      AudioPlayerInstance.stopRecorder();
                    },
                  },
                ];
                showAlert(
                  translate('appTitle'),
                  translate('discardMsg'),
                  buttons,
                );
              } else {
                navigation.navigate('Notifications');
              }
            },
          }}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('notifications')}
                </Text>
              );
            },
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <NotificationSelected
                  height={isIpad ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
                  width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
                />
              ) : (
                <Notification
                  height={isIpad ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
                  width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(18)}
                />
              ),
          })}
        />
      )}
      {showPagingTab && (
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          initialParams={{ notificationPermission: showNotificationsTab }}
          tabPress={() => dispatch(toggleNotificationPopup(false))}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('paging')}
                </Text>
              );
            },
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <PagingSelected
                  height={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
                  width={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
                />
              ) : (
                <Paging
                  height={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
                  width={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
                />
              ),
          })}
        />
      )}
      {showScheduleTab && (
        <Tab.Screen
          name="Schedule"
          component={Schedule}
          initialParams={{ notificationPermission: showNotificationsTab }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              if (preventTabSwitch) {
                const buttons = [
                  {
                    text: translate('cancel'),
                    onPress: () => {
                      e.preventDefault();
                    },
                    style: 'cancel',
                  },
                  {
                    text: translate('yes'),
                    onPress: () => {
                      navigation.navigate('Schedule');
                      dispatch(
                        updatePagingModalFields('preventTabSwitch', false),
                      );
                      dispatch(updateRecordingPath(''));
                      dispatch(updateSelectedZone({}));
                      AudioPlayerInstance.stopPlayer();
                      AudioPlayerInstance.stopRecorder();
                    },
                  },
                ];
                showAlert(
                  translate('appTitle'),
                  translate('discardMsg'),
                  buttons,
                );
              } else {
                navigation.navigate('Schedule');
              }
            },
          }}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('schedule')}
                </Text>
              );
            },
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <CalendarSelected
                  height={isIpad ? Mixins.scaleSize(25) : Mixins.scaleSize(25)}
                  width={isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24)}
                />
              ) : (
                <Calendar
                  height={isIpad ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
                  width={isIpad ? Mixins.scaleSize(14) : Mixins.scaleSize(14)}
                />
              ),
          })}
        />
      )}
      {showAlertsTab && (
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          initialParams={{
            notificationPermission: showNotificationsTab,
            socketInstance: socket,
          }}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              if (preventTabSwitch) {
                const buttons = [
                  {
                    text: translate('cancel'),
                    onPress: () => {
                      e.preventDefault();
                    },
                    style: 'cancel',
                  },
                  {
                    text: translate('yes'),
                    onPress: () => {
                      navigation.navigate('Alerts'),
                        dispatch(
                          updatePagingModalFields('preventTabSwitch', false),
                        );
                      dispatch(updateRecordingPath(''));
                      dispatch(updateSelectedZone({}));
                      AudioPlayerInstance.stopPlayer();
                      AudioPlayerInstance.stopRecorder();
                    },
                  },
                ];
                showAlert(
                  translate('appTitle'),
                  translate('discardMsg'),
                  buttons,
                );
              } else {
                navigation.navigate('Alerts');
              }
            },
          }}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused, activeAlerts)}>
                  {translate('alerts')}
                </Text>
              );
            },
            unmountOnBlur: true,
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) =>
              activeAlerts?.length > 0 ? (
                <Image
                  resizeMode="contain"
                  style={styles.redAlertIcon(isFoldableDevice)}
                  source={alertIconRed}
                />
              ) : focused ? (
                <AlertSelected
                  height={isIpad ? Mixins.scaleSize(18) : Mixins.scaleSize(18)}
                  width={isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(20)}
                />
              ) : (
                <Alert
                  height={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
                  width={isIpad ? Mixins.scaleSize(18) : Mixins.scaleSize(18)}
                />
              ),
          })}
        />
      )}
      {stopAllPermission && (
        <Tab.Screen
          name="StopAll"
          component={StopAllView}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              dispatch(globalStateUpdate('stopAllFlag', true));
            },
          }}
          options={({ route }) => ({
            tabBarLabel: ({ focused }) => {
              return (
                <Text style={styles.labelStyle(focused)}>
                  {translate('stopAll')}
                </Text>
              );
            },
            tabBarIcon: ({ color, size, focused }) => (
              <StopAllIcon
                height={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
                width={isIpad ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
              />
            ),
          })}
        />
      )}
    </Tab.Navigator>
  );
};

export const navigationRef = createNavigationContainerRef();
const MainNavigator = props => {
  let dispatch = useDispatch();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        dispatch(
          globalStateUpdate('routeName', navigationRef.getCurrentRoute().name),
        );
      }}
      onStateChange={async () => {
        const currentRouteName = navigationRef.getCurrentRoute().name;
        dispatch(globalStateUpdate('routeName', currentRouteName));
      }}>
      <LoginStack />
    </NavigationContainer>
  );
};

export default MainNavigator;
