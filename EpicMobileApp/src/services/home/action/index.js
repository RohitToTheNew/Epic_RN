import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import {LOGGED_IN_SESSION, VERIFIED_URL} from '../../../config/constants';
import {SAVE_NOTIFICATIONS_LIST} from '../constants';
import LocalStorageServices from '../../localStorage';
import {isInternetConnected} from '../../app/action';
import {updateLoadingStatus} from '../../globalState/action';
import {translate} from '../../../translations/translationHelper';
import utils from '../../../utils';
import {resetPermissionData} from '../../authorization/action';
import {checkServerStatus} from '../../alert/action';

/***
 * actions for notifications tab
 */
export const saveNotificationsList = notifications => ({
  type: SAVE_NOTIFICATIONS_LIST,
  notifications: notifications,
});

export const getNotificationsList = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.getNotificationsList,
        response => {
          let tempData = response.data;
          tempData?.forEach(element => {
            element.notificationPlaying = false;
          });
          dispatch(saveNotificationsList(tempData));
          callback(tempData);
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
          } else if (error.statusCode === 401) {
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

export const stopNotification = callback => {
  return async (dispatch, getState) => {
    let navigationInstance = getState().app.navigationInstance;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.getApiCallNoStatus(
        verifiedServerUrl + ApiPaths.stopNotifications,
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

export const startNotification = (payload, callback) => {
  return async (dispatch, getState) => {
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let navigationInstance = getState().app.navigationInstance;
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
