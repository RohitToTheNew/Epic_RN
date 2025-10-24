import LocalStorageServices from '../../localStorage';
import {LOGGED_IN_SESSION, VERIFIED_URL} from '../../../config/constants';
import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import {isInternetConnected} from '../../app/action';
import {updateLoadingStatus} from '../../globalState/action';
import utils from '../../../utils';
import {translate} from '../../../translations/translationHelper';
import {
  UPDATE_RECORDING_PATH,
  UPDATE_SELECTED_ZONE,
  UPDATE_PAGING_MODAL_FIELDS,
} from '../constants';
import {resetPermissionData} from '../../authorization/action';
import { checkServerStatus } from '../../alert/action';

export const getZones = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.getApiCallNoStatus(
        verifiedServerUrl + ApiPaths.getAllZones,
        response => {
          callback(response);
          dispatch(updateLoadingStatus(false));
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus())
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

export const getZonesPaging = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.postApiCallNoStatus(
        verifiedServerUrl + ApiPaths.zonesListPaging,
        {zoneId: 'ENTIRESCHOOL'},
        response => {
          callback(JSON.parse(response.message).zones);
          dispatch(updateLoadingStatus(false));
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus())
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

export const hitSendPage = (payload, callback) => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      ApiManager.postApiCall(
        verifiedServerUrl + ApiPaths.sendPage,
        payload,
        response => {
          dispatch(updateLoadingStatus(false));
          callback(response);
        },
        async error => {
          if (error.statusCode === 401) {
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            dispatch(resetPermissionData());
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
          } else {
            dispatch(updateLoadingStatus(false));
            callback(error);
          }
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

export const updateRecordingPath = path => dispatch => {
  dispatch({
    type: UPDATE_RECORDING_PATH,
    path,
  });
};

export const updateSelectedZone = zone => dispatch => {
  dispatch({
    type: UPDATE_SELECTED_ZONE,
    zone,
  });
};

export const updatePagingModalFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_PAGING_MODAL_FIELDS,
    payload: {[key]: value},
  });
};
