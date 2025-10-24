import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import {
  SAVE_USER_INFO,
  SAVE_SERVER_URL,
  SAVE_USER_PERMISSION,
  RESET_PERMISSION_STATE,
  SAVE_SCHOOL_NAME,
  SAVE_PASSWORD_CHANGE,
  UPDATE_AUTH_USER_DETAILS,
} from '../constants';
import LocalStorageServices from '../../localStorage';
import {LOGGED_IN_SESSION, VERIFIED_URL} from '../../../config/constants';
import {
  isInternetConnected,
  updateAppModalFields,
  updateServerStatus,
} from '../../app/action';
import {globalStateUpdate, updateLoadingStatus} from '../../globalState/action';
import {translate} from '../../../translations/translationHelper';
import utils from '../../../utils';
import {checkServerStatus} from '../../alert/action';
import rnfetchInstance from '../../../config/rnfetchInstance';
import {sentryErrorHandler} from '../../../utils/errorHandler';

/**
 * function to save the user info to the redux store
 * @param {object} userInfo object containing the user info
 * @returns
 */
export const saveUserInfo = userInfo => ({
  type: SAVE_USER_INFO,
  user: userInfo?.data?.user,
});

/**
 * function to save the signed in user info
 * @param {function} callback function to call after info is saved successfully
 * @returns
 */
export const saveSignedInUserInfo = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.userInfo,
        response => {
          dispatch(saveUserInfo(response));
          callback(response);
        },
        async error => {
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to save the server url
 * @param {string} serverUrl server url
 * @returns
 */
export const saveServerUrl = serverUrl => ({
  type: SAVE_SERVER_URL,
  url: serverUrl,
});

/**
 * function to save weather password change is required
 * @param {boolean} passwordChange weather password change is required
 * @returns
 */
export const savePasswordChnage = passwordChange => ({
  type: SAVE_PASSWORD_CHANGE,
  passwordChange: passwordChange,
});

/**
 * function to update the Auth User details reducer
 * @param {string} key key to update in reducer
 * @param {object} value value to update
 * @returns
 */
export const updateAuthUserDeatils = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_AUTH_USER_DETAILS,
    payload: {[key]: value},
  });
};

/**
 * function to validate the server url
 * @param {boolean} closeLoaderFlag boolean indicating weather to show loader
 * @param {string} serverUrl server url value
 * @param {function} callback callback function to execute
 * @returns
 */
export const validateServerUrl = (closeLoaderFlag, serverUrl, callback) => {
  let url = serverUrl + '/' + ApiPaths.validateServerUrl;
  return (dispatch, getState) => {
    if (isInternetConnected()) {
      closeLoaderFlag && dispatch(updateLoadingStatus(true));
      ApiManager.getApiCall(
        url,
        async response => {
          dispatch(updateLoadingStatus(false));
          if (response.statusCode === 200) {
            callback(response);
            await LocalStorageServices.setItem(VERIFIED_URL, serverUrl + '/');
            dispatch(saveServerUrl(serverUrl + '/'));
            dispatch(updateAuthUserDeatils('isVerified', true));
            dispatch(updateAppModalFields('isLoggedOut', false));
          }
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          dispatch(updateAuthUserDeatils('isVerified', false));
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to check if Secure Check-in is enabled or not
 */
export const getSecureCheckIn = () => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      try {
        ApiManager.postApiCall(
          verifiedServerUrl + ApiPaths.secureCheckIn,
          {eventName: ['lockDown'], eventIds: [18]},
          response => {
            if (response?.data[0]?.secureCheckIn === 1) {
              dispatch(updateAppModalFields('secureCheckIn', true));
            } else {
              dispatch(updateAppModalFields('secureCheckIn', false));
            }
          },
          async error => {
            dispatch(updateLoadingStatus(true));
            dispatch(updateAppModalFields('secureCheckIn', false));
            if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
          },
        );
      } catch (error) {
        utils.Log(utils.logType.error, 'error in getSecureCheckIn', error);
      }
    }
  };
};

/**
 * function to perform the login function
 * @param {object} payload object containing the login credentials
 * @param {function} callback callback function to execute
 * @returns
 */
export const login = (payload, callback) => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.postApiCall(
        verifiedServerUrl + ApiPaths.logIn,
        payload,
        async response => {
          if (response.statusCode === 200) {
            await LocalStorageServices.setItem(
              LOGGED_IN_SESSION,
              JSON.parse(true),
            );
            dispatch(
              getSchoolDetails(async res => {
                dispatch(saveSchoolName(res));
              }),
            );
            dispatch(getSecureCheckIn());
            callback(response);
            dispatch(savePasswordChnage(response.data.passwordChange));
            setTimeout(() => {
              dispatch(updateAuthUserDeatils('userName', ''));
              dispatch(updateAuthUserDeatils('password', ''));
            }, 5000);
          } else {
            callback(response);
          }
          dispatch(updateLoadingStatus(false));
        },
        error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            callback(error);
            return;
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
 * function to perform the logout action
 * @param {function} callback callback function to execute
 * @returns
 */
export const logout = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.logout,
        async response => {
          callback(response);
          dispatch(updateLoadingStatus(false));
          await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
        },
        error => {
          callback(error);
          dispatch(updateLoadingStatus(false));
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to get roles of the user
 * @param {function} callback callback function to execute
 * @returns
 */
export const getRoles = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);

    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.getrole,
        response => {
          dispatch(updateLoadingStatus(false));
          callback(response);
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
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
 * function to change the password on epic
 * @param {object} payload object containing the password data
 * @param {function} callback callback function to execute
 * @returns
 */
export const changePassword = (payload, callback) => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.postApiCall(
        verifiedServerUrl + ApiPaths.changepassword,
        payload,
        response => {
          dispatch(updateLoadingStatus(false));
          dispatch(savePasswordChnage(false));
          callback(response);
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
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
 * function to filter out the user permissions
 * @param {object} response
 * @returns
 */
export const filteredUserPermission = response => {
  const {data, statusCode} = response;
  const dataAvailable = statusCode === 200 && response?.data?.length > 0;
  if (dataAvailable) {
    const filteredPermission = data.filter(
      item =>
        (item.module_name === translate('pagingModule') &&
          item.permission === 1) ||
        (item.module_name === translate('notificationsModule') &&
          item.permission === 1) ||
        (item.module_name === translate('alertsModule') &&
          item.permission === 1) ||
        (item.module_name === translate('scheduleModule') &&
          item.permission === 1) ||
        (item.module_name === translate('startNotificationsModule') &&
          item.permission === 1) ||
        (item.module_name === translate('copySchedulerModule') &&
          item.permission === 1) ||
        (item.module_name === translate('acknowledgePermission') &&
          item.permission === 1) ||
        (item.module_name === translate('lockdownPermission') &&
          item.permission === 1) ||
        (item.module_name === translate('escalatePermission') &&
          item.permission === 1) ||
        (item.module_name === translate('eventLogsPermission') &&
          item.permission === 1) ||
        (item.module_name === translate('endEventPermission') &&
          item.permission === 1) ||
        (item.module_name === translate('stopAllPermission') &&
          item.permission === 1),
    );
    return filteredPermission;
  }
};

/**
 * function to save the permissions data into reducer
 * @param {object} response permissions response
 * @returns
 */
export const savePermissionData = response => ({
  type: SAVE_USER_PERMISSION,
  response: response,
});

/**
 * function to handle the get user permission call
 * @param {boolean} closeLoaderFlag boolean to undicate weather to show the loader or not
 * @param {function} callback callback function to execute
 * @returns
 */
export const getUserPermissions = (closeLoaderFlag, callback) => {
  return async (dispatch, getState) => {
    const routeName = getState().globalReducer.routeName;
    const navigationInstance = getState().app.navigationInstance;
    const verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      closeLoaderFlag && dispatch(updateLoadingStatus(true));
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.getUserPermissions,
        response => {
          dispatch(updateLoadingStatus(false));
          dispatch(resetPermissionData());
          dispatch(
            getSchoolDetails(async res => {
              dispatch(saveSchoolName(res));
            }),
          );
          const filteredResponse = filteredUserPermission(response);
          callback(filteredResponse);
          dispatch(savePermissionData(filteredResponse));
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            utils.showToast(translate('apiFailed'));
            return;
          } else if (error.statusCode === 401) {
            dispatch(resetPermissionData());
            if (routeName !== 'Login') {
              navigationInstance.replace('Login');
            }
            await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            return;
          } else {
            callback(error);
          }
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

/**
 * function to reset the user permissions to initial state in reducer
 */
const resetPermissionState = () => ({
  type: RESET_PERMISSION_STATE,
});

/**
 * function to handle the reset permission call
 */
export const resetPermissionData = () => dispatch => {
  dispatch(resetPermissionState());
};

/**
 * function to handle the save school data call
 * @param {object} response object containing the school name data
 */
const schoolNameData = response => ({
  type: SAVE_SCHOOL_NAME,
  response: response.config.schoolName,
});

/**
 * function to save the school name
 * @param {object} response school data response
 * @returns
 */
export const saveSchoolName = response => dispatch => {
  dispatch(schoolNameData(response));
};

/**
 * function to get the school details from epic
 * @param {function} callback callback function to execute
 * @returns
 */
export const getSchoolDetails = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCallNoStatus(
        verifiedServerUrl + ApiPaths.getSchooldetail,
        response => {
          callback(response);
          dispatch(saveSchoolName(response));
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
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
 * function to fetch the CSRF Token from epic
 * @param {function} callback callback function to execute
 */
export const fetchCSRFToken = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.csrfToken,
        response => {
          dispatch(updateLoadingStatus(false));
          callback(response);
        },
        async error => {
          dispatch(updateLoadingStatus(false));
          if (error.statusCode === 504) {
            dispatch(checkServerStatus());
            return;
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
 * function to perform login action after SSO validation code is obtained
 * @param {string} url login code embedded server url
 * @param {function} callback callback function to execute
 */
export const loginWithSSO = (url, callback) => {
  return async (dispatch, getState) => {
    try {
      if (isInternetConnected()) {
        dispatch(updateLoadingStatus(true));
        ApiManager.getApiCall(
          url,
          async response => {
            if (response.statusCode === 200) {
              await LocalStorageServices.setItem(
                LOGGED_IN_SESSION,
                JSON.parse(true),
              );
              dispatch(
                getSchoolDetails(async res => {
                  dispatch(saveSchoolName(res));
                }),
              );
              callback(response);
              dispatch(savePasswordChnage(response.data.passwordChange));
              setTimeout(() => {
                dispatch(updateAuthUserDeatils('userName', ''));
                dispatch(updateAuthUserDeatils('password', ''));
              }, 5000);
            } else {
              callback(response);
            }
            dispatch(updateLoadingStatus(false));
          },
          error => {
            dispatch(updateLoadingStatus(false));
            callback(error);
          },
        );
      } else {
        utils.showToast(translate('offlineText'));
      }
    } catch (error) {
      dispatch(updateLoadingStatus(false));
      sentryErrorHandler(error);
    }
  };
};

/**
 * function to get SSO credentials from epic
 * @param {string} token token obtained
 * @param {function} callback callback function to execute
 */
export const getSSOCredentials = (token, callback) => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    try {
      if (isInternetConnected()) {
        ApiManager.getApiCallNoDelay(
          `${verifiedServerUrl + ApiPaths.getSSOCredsMobile}?token=${token}`,
          async response => {
            const activeSSO = response?.data?.filter(
              element => element.is_active === 1,
            );
            if (activeSSO?.length > 0) {
              dispatch(globalStateUpdate('activeSSO', activeSSO[0]));
            } else {
              dispatch(globalStateUpdate('activeSSO', {}));
            }
            dispatch(updateLoadingStatus(false));
          },
          async error => {
            dispatch(updateLoadingStatus(false));
            if (error.statusCode === 504) {
              dispatch(checkServerStatus());
              return;
            }
            if (error.statusCode === 401) {
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
    } catch (error) {
      dispatch(updateLoadingStatus(false));
      sentryErrorHandler(error);
    }
  };
};

/**
 * function to fetch the SSO token
 */
export const getSSOToken = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    try {
      if (isInternetConnected()) {
        let newHeader = rnfetchInstance.header;
        newHeader['appId'] = 'a#dR%4G2Df$3D@Fsfe#';
        ApiManager.getApiCallNoDelay(
          `${verifiedServerUrl + ApiPaths.getToken}?data=abcd`,
          async response => {
            const token = response.data;
            dispatch(getSSOCredentials(token, () => {}));
            dispatch(updateLoadingStatus(false));
          },
          async error => {
            dispatch(updateLoadingStatus(false));
            if (error.statusCode === 504) {
              // dispatch(globalStateUpdate('activeSSO', {}));
              dispatch(checkServerStatus());
              return;
            }
            if (error.statusCode === 401) {
              if (routeName !== 'Login') {
                navigationInstance.replace('Login');
              }
              dispatch(resetPermissionData());
              await LocalStorageServices.removeItem(LOGGED_IN_SESSION);
            }
            callback && callback(error);
          },
        );
      } else {
        utils.showToast(translate('offlineText'));
      }
    } catch (error) {
      dispatch(updateLoadingStatus(false));
      sentryErrorHandler(error);
    }
  };
};
