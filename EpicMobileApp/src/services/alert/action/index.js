import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import { LOGGED_IN_SESSION, VERIFIED_URL } from '../../../config/constants';
import {
  SAFE_ALERT_EVENT,
  NAVIGATE_TO_ALERT_SCREEN,
  SAVE_ALERT_DATA,
} from '../constants';
import LocalStorageServices from '../../localStorage';
import { isInternetConnected, updateServerStatus } from '../../app/action';
import { globalStateUpdate, updateLoadingStatus } from '../../globalState/action';
import utils from '../../../utils';
import { translate } from '../../../translations/translationHelper';
import {
  resetPermissionData,
  validateServerUrl,
} from '../../authorization/action';

/**
 * reducer function to update event data in store
 * @param {object} event event data
 */
export const safeAlertEvent = event => dispatch => {
  dispatch({
    type: SAFE_ALERT_EVENT,
    event,
  });
};

/**
 * reducer function to change the navigate to alert screen listener value
 * @param {boolean} toggleEvent boolean indicating whether to navigate to alert screen
 */
export const navigateToAlertScreen = toggleEvent => dispatch => {
  dispatch({
    type: NAVIGATE_TO_ALERT_SCREEN,
    toggleEvent,
  });
};

/**
 * function to check if server is online or not by validating the saved server url
 */
export const checkServerStatus = () => {
  return async (dispatch, getState) => {
    const { routeName } = getState().globalReducer;
    const verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);

    // Check if verifiedServerUrl exists before processing
    if (!verifiedServerUrl) {
      return;
    }

    setTimeout(() => {
      dispatch(
        validateServerUrl(
          false,
          verifiedServerUrl.substring(0, verifiedServerUrl.length - 1),
          response => {
            if (response.statusCode && response.statusCode !== 504) {
              dispatch(globalStateUpdate('serverDisconnected', false));
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
    }, 1000);
  };
};

/**
 * function to fetch the device in any room
 * @param {number} roomId id of the room
 * @param {function} callback callback function to execute after api call
 * @returns
 */
export const getDeviceByRoomId = (roomId, callback) => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.postApiCallNoStatus(
        verifiedServerUrl + ApiPaths.getDeviceByRoomId(roomId),
        {},
        response => {
          callback(response);
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to get active alerts list
 * @param {boolean} closeLoaderFlag boolean to whether loader is visible or not
 * @param {function} callback function to execute after api call
 */
export const getActiveAlerts = (closeLoaderFlag, callback) => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    if (isInternetConnected()) {
      try {
        let verifiedServerUrl = await LocalStorageServices.getItem(
          VERIFIED_URL,
        );
        closeLoaderFlag && dispatch(updateLoadingStatus(true));
        ApiManager.getApiCallNoDelay(
          verifiedServerUrl + ApiPaths.activeAlerts,
          response => {
            if (response?.data?.length > 0) {
              response.data.sort(utils.compare);
              dispatch(updateAlertData('activeAlerts', [...response.data]));
              dispatch(updateLoadingStatus(false));
              callback && callback(response.data);
            }
          },
          async error => {
            if (error.message === 'No Alert logs found.') {
              dispatch(updateAlertData('activeAlerts', []));
              callback([]);
            } else if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            dispatch(updateLoadingStatus(false));
            if (error.statusCode === 504) {
              dispatch(checkServerStatus());
              return;
            }
          },
        );
      } catch (error) {
        dispatch(updateLoadingStatus(false));
        utils.Log(utils.logType.error, 'error in get active alerts', error);
      } finally {
        dispatch(updateLoadingStatus(false));
      }
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to save alert data into the store
 * @param {string} key key indicating the store entity
 * @param {object} value value to be stored on the respective key
 */
export const updateAlertData = (key, value) => dispatch => {
  dispatch({
    type: SAVE_ALERT_DATA,
    payload: { [key]: value },
  });
};

/**
 * function to get alert token
 * @param {number} id id of the room
 * @param {function} callback function to execute after api call
 */
export const getAlertToken = (id, callback) => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCallNoDelay(
        verifiedServerUrl + ApiPaths.alertToken(id),
        response => {
          dispatch(updateAlertData('alertToken', response.data));
          callback(response);
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to get alert token for map screen
 * @param {number} id id of the map
 * @param {function} callback function to execute after api call
 */
export const getAlertTokenForMap = (id, callback) => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCallNoDelay(
        verifiedServerUrl + ApiPaths.alertToken(id),
        response => {
          dispatch(updateAlertData('alertTokenForMap', response.data));
          callback(response);
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to trigger alert events
 * @param {object} payload payload data to be sent in api
 * @param {function} callback function to execute after api call
 */
export const triggerAlertEvents = (payload, callback) => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.postApiCallNoStatus(
        verifiedServerUrl + ApiPaths.triggerEvent,
        payload,
        response => {
          dispatch(updateLoadingStatus(false));
          callback(response);
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to get Lockdown dashboard data from epic
 * @param {function} callback function to execute after api call
 */
export const getLockdownDashboardData = (successCallback, errorCallback) => {
  return async (dispatch, getState) => {
    const navigationInstance = getState().app.navigationInstance;
    const routeName = getState().globalReducer.routeName;
    const mapScreenVisible = getState().alert.mapScreenVisible;
    if (isInternetConnected()) {
      try {
        const verifiedServerUrl = await LocalStorageServices.getItem(
          VERIFIED_URL,
        );
        ApiManager.getApiCallNoDelay(
          verifiedServerUrl + ApiPaths.lockDashboardData,
          async response => {
            try {
              let mergedData = {},
                pendingRooms = {},
                alertedRooms = {},
                securedRooms = {},
                peopleSecuredCount = 0;
              response.data.forEach(element => {
                Object.assign(mergedData, JSON.parse(element.room_status));
              });
              for (const key in mergedData) {
                const peopleCount = mergedData[key].people;
                if (typeof peopleCount === 'number') {
                  peopleSecuredCount += peopleCount;
                }
              }
              for (const key in mergedData) {
                if (
                  mergedData.hasOwnProperty(key) &&
                  mergedData[key].status === 1
                ) {
                  pendingRooms[key] = mergedData[key];
                } else if (
                  mergedData.hasOwnProperty(key) &&
                  mergedData[key].status === 2
                ) {
                  alertedRooms[key] = mergedData[key];
                } else if (
                  mergedData.hasOwnProperty(key) &&
                  mergedData[key].status === 3
                ) {
                  securedRooms[key] = mergedData[key];
                }
              }
              response['pending'] = Object.keys(pendingRooms).length;
              response['alerts'] = Object.keys(alertedRooms).length;
              response['secure'] = Object.keys(securedRooms).length;
              response['peopleSecured'] = peopleSecuredCount;
              dispatch(updateAlertData('lockdownDashboardData', response));
              if (response?.data?.length > 0) {
                dispatch(updateAlertData('showLockdownDashboard', true));
              } else {
                dispatch(updateAlertData('showLockdownDashboard', false));
              }
              if (mapScreenVisible) {
                dispatch(updateAlertData('mapScreenVisible', false));
              }
              successCallback && successCallback(response);
            } catch (error) {
              utils.Log(
                utils.logType.error,
                'error while parsing the rooms status data',
                error,
              );
            }
          },
          async error => {
            if (error.statusCode === 504) {
              dispatch(checkServerStatus());
              return;
            } else if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            errorCallback && errorCallback(error);
          },
        );
      } catch (error) {
        utils.Log(utils.logType.error, 'error in get dashboard data', error);
        dispatch(updateLoadingStatus(false));
      } finally {
        dispatch(updateLoadingStatus(false));
      }
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to handle the AllClear api action
 * @param {function} callback function to execute after api call
 */
export const allClearAction = successCallback => {
  return async (dispatch, getState) => {
    const verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      try {
        ApiManager.postApiCall(
          verifiedServerUrl + ApiPaths.endLockdown,
          {},
          async response => {
            if (response.success) {
              successCallback && successCallback();
              dispatch(updateLoadingStatus(false));
            }
          },
          async error => {
            dispatch(updateLoadingStatus(false));
            utils.Log(utils.logType.error, 'error in allClearAction', error);
          },
        );
      } catch (error) {
        dispatch(updateLoadingStatus(false));
        utils.Log(utils.logType.error, 'error in allClearAction', error);
      }
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to handle the acknowledge safe alert api call
 * @param {object} payload object containing the payload to send when calling api
 */
export const acknowledgeSafeAlert = payload => {
  return async (dispatch, getState) => {
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      try {
        const verifiedServerUrl = await LocalStorageServices.getItem(
          VERIFIED_URL,
        );
        ApiManager.postApiCall(
          verifiedServerUrl + ApiPaths.acknowledgeSafeAlert,
          payload,
          response => {
            if (response.success) {
              dispatch(getActiveAlerts(false));
              dispatch(updateLoadingStatus(false));
            }
          },
          async error => {
            if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            dispatch(updateLoadingStatus(false));
            utils.Log(
              utils.logType.error,
              'error in acknowledgeSafeAlert',
              error,
            );
          },
        );
      } catch (error) {
        utils.Log(utils.logType.error, 'error in acknowledgeSafeAlert', error);
      }
    }
  };
};

/**
 * function to read lockdown summary from epic and sort them in manner that unresolved alerts comes on top
 * @param {number} id
 */
export const getLockdownDashboardSummary = id => {
  return async (dispatch, getState) => {
    const navigationInstance = getState().app.navigationInstance;
    const routeName = getState().globalReducer.routeName;
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      try {
        const verifiedServerUrl = await LocalStorageServices.getItem(
          VERIFIED_URL,
        );
        ApiManager.getApiCallNoDelay(
          verifiedServerUrl + ApiPaths.lockdownSummary(id),
          response => {
            response?.data?.alertData?.forEach(item => {
              item.alertStatus = item?.comment ? 'Resolved' : 'Unresolved';
            });
            response?.data?.alertData?.sort((a, b) => {
              if (
                a.alertStatus === 'Unresolved' &&
                b.alertStatus === 'Resolved'
              ) {
                return -1;
              }
              if (
                a.alertStatus === 'Resolved' &&
                b.alertStatus === 'Unresolved'
              ) {
                return 1;
              }
              return 0;
            });
            dispatch(updateAlertData('summaryData', response.data));
            dispatch(updateAlertData('showSummary', true));
            dispatch(updateLoadingStatus(false));
          },
          async error => {
            if (error.statusCode === 504) {
              dispatch(checkServerStatus());
              return;
            } else if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            dispatch(updateLoadingStatus(false));
          },
        );
      } catch (error) {
        utils.Log(
          utils.logType.error,
          'error in getLockdownDashboardSummary',
          error,
        );
      }
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to read maps list from the EPIC
 * @param {boolean} showMapScreen if we need to show maps listing modal on api success or not
 */
export const getMapsList = showMapScreen => {
  return async (dispatch, getState) => {
    try {
      const navigationInstance = getState().app.navigationInstance;
      const routeName = getState().globalReducer.routeName;
      const verifiedServerUrl = await LocalStorageServices.getItem(
        VERIFIED_URL,
      );
      if (isInternetConnected()) {
        dispatch(updateLoadingStatus(true));
        ApiManager.postApiCallNoStatus(
          verifiedServerUrl + ApiPaths.mapsList,
          {},
          response => {
            const mapsList = JSON.parse(response.message).mapList;
            dispatch(updateAlertData('mapsList', mapsList));
            dispatch(updateAlertData('mapsListCopy', mapsList));
            dispatch(updateLoadingStatus(false));
            showMapScreen &&
              dispatch(updateAlertData('mapScreenVisible', true));
          },
          async error => {
            dispatch(updateLoadingStatus(false));
            if (error.statusCode === 504) {
              dispatch(checkServerStatus());
              return;
            } else if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            utils.Log(utils.logType.error, 'error in maps list api', error);
          },
        );
      } else {
        utils.showToast(translate('offlineText'));
      }
    } catch (error) {
      utils.Log(utils.logType.error, 'error in maps list api', error);
    }
  };
};

/**
 * function to get configured buttons for safe alert events
 * @param {object} rowData
 * @param {function} callback function to execute after api call
 */
export const getConfiguredButtons = (rowData, callback) => {
  return async (dispatch, getState) => {
    const navigationInstance = getState().app.navigationInstance;
    const routeName = getState().globalReducer.routeName;
    const activeAlerts = getState().alert.activeAlerts;
    const verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCallNoDelay(
        verifiedServerUrl +
        ApiPaths.getConfiguredButtons +
        '?eventNames[]=' +
        `${rowData.item.event_name}`,
        response => {
          const apiResponse = JSON.parse(response.data[0]?.event_data);
          delete apiResponse[10];
          delete apiResponse[11];
          const arrayResponse = Object.values(apiResponse);
          if (
            arrayResponse.some(
              event => event?.eventName?.toLowerCase() === 'escalate',
            )
          ) {
            ApiManager.getApiCallNoStatus(
              verifiedServerUrl + ApiPaths.checkEscalateActions + '/37',
              response => {
                if (response?.length === 0) {
                  delete apiResponse[37];
                }
                const buttons = Object.values(apiResponse);
                callback(buttons);
                dispatch(updateAlertData('configuredButtons', buttons));
              },
              error => {
                utils.Log(
                  utils.logType.error,
                  'error in check escalate actions',
                  error,
                );
                callback(arrayResponse);
                dispatch(updateAlertData('configuredButtons', arrayResponse));
              },
            );
          } else {
            dispatch(updateAlertData('configuredButtons', arrayResponse));
            callback(arrayResponse);
          }
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};
