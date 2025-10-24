import LocalStorageServices from '../../localStorage';
import {LOGGED_IN_SESSION, VERIFIED_URL} from '../../../config/constants';

import {
  TOGGLE_NOTIFICATION_POPUP,
  NOTIFICATION_TITLE,
  NOTIFICATION_EVENT_DETAILS,
  SAVE_NOTIFICATIONS_STATUS,
  TOGGLE_NOTIFICATION_ALERT,
  NOTIFICATION_EVENT_DETAILS_RESET,
  UPDATE_NOTIFICATION_MODAL_FIELDS,
} from '../constants';
import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import {isInternetConnected} from '../../app/action';
import utils from '../../../utils';
import {translate} from '../../../translations/translationHelper';
import {resetPermissionData} from '../../authorization/action';
import {checkServerStatus} from '../../alert/action';
import {updateLoadingStatus} from '../../globalState/action';

export const toggleNotificationPopup = value => dispatch => {
  dispatch({
    type: TOGGLE_NOTIFICATION_POPUP,
    value,
  });
};

export const toggleNotificationAlert = value => dispatch => {
  dispatch({
    type: TOGGLE_NOTIFICATION_ALERT,
    value,
  });
};

export const notificationTitle = title => dispatch => {
  dispatch({
    type: NOTIFICATION_TITLE,
    title,
  });
};

export const notificationEventDetails = data => dispatch => {
  dispatch({
    type: NOTIFICATION_EVENT_DETAILS,
    data,
  });
};
export const notificationEventDetailsReset = () => dispatch => {
  dispatch({
    type: NOTIFICATION_EVENT_DETAILS_RESET,
  });
};

export const saveNotificationsStatus = notifications => ({
  type: SAVE_NOTIFICATIONS_STATUS,
  notificationsStatus: notifications,
});

export const updateNotificationModalFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_NOTIFICATION_MODAL_FIELDS,
    payload: {[key]: value},
  });
};

/**
 * function to read notification status from epic and store into redux
 * @param {function} callback function to call once the notification status is read successfully
 */
export const getNotificationsStatus = callback => {
  return async (dispatch, getState) => {
    let {notificationsList} = getState().home;
    let routeName = getState().globalReducer.routeName;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      ApiManager.getApiCallNoStatus(
        verifiedServerUrl + ApiPaths.notificationStatus,
        response => {
          let tempData = notificationsList;
          if (response?.length > 0) {
            response?.forEach(element => {
              let index = tempData.findIndex(
                innerElement => innerElement.id === element.notificationEventId,
              );
              if (index > -1) {
                tempData[index].notificationPlaying = true;
              }
            });
            dispatch(
              updateNotificationModalFields('notificationsCopyList', tempData),
            );
          } else {
            let tempData = notificationsList;
            tempData.forEach(element => {
              element.notificationPlaying = false;
            });
            dispatch(
              updateNotificationModalFields('notificationsCopyList', tempData),
            );
          }
          callback();
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
        },
        0,
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};
