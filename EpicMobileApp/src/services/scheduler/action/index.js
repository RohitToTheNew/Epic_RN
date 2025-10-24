import LocalStorageServices from '../../localStorage';
import {VERIFIED_URL, LOGGED_IN_SESSION} from '../../../config/constants';
import ApiManager from '../../../config/apiManager';
import ApiPaths from '../../../config/apiConfig';
import { isInternetConnected } from '../../app/action';
import {
  updateLoadingStatus,
} from '../../globalState/action';
import utils from '../../../utils';
import {translate} from '../../../translations/translationHelper';
import {resetPermissionData} from '../../authorization/action';

import {SAVE_CALENDAR_DATA, UPDATE_MARKED_DATES} from '../constants';
import moment from 'moment';
import { checkServerStatus } from '../../alert/action';
const {convertTimestampToDate} = utils;

export const updateSchedulerData = (key, value) => dispatch => {
  dispatch({
    type: SAVE_CALENDAR_DATA,
    payload: {[key]: value},
  });
};

export const getCalendarData = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.calendarData(2),
        response => {
          let filteredData = response.data.daytypes.filter(element => {
            return element.name !== 'System Event';
          });
          dispatch(updateSchedulerData('dayTypes', filteredData));
          dispatch(updateSchedulerData('calendarData', response.data));
          let formattedResponse = formatMarkedDates(response.data.schdeuleData);
          dispatch(updateSchedulerData('markedDates', formattedResponse));
          callback(formattedResponse);
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

export const formatMarkedDates = args => {
  var obj = args.reduce(
    (c, v) =>
      Object.assign(c, {
        [moment(v.bellDate).format('YYYY-MM-DD')]: {
          selected: false,
          customStyles: {
            container: {
              backgroundColor: v.dayTypeColorCode,
            },
          },
        },
      }),
    {},
  );
  return obj;
};

export const getTimeDetails = callback => {
  return async (dispatch, getState) => {
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      ApiManager.getApiCall(
        verifiedServerUrl + ApiPaths.timeDetails,
        response => {
          const formatTimeStamp = convertTimestampToDate(
            response.data.epicTime,
          );
          dispatch(updateSchedulerData('currentDate', formatTimeStamp));
          callback(formatTimeStamp);
        },
        async error => {
          if (error.statusCode === 504) {
            dispatch(checkServerStatus())
            return;
          } else if (error.statusCode === 401) {
          }
          callback(error);
        },
      );
    } else {
      utils.showToast(translate('offlineText'));
    }
  };
};

export const updateMarkedDates = (dayTappedObject, dateSelect) => dispatch => {
  dispatch({
    type: UPDATE_MARKED_DATES,
    payload: {dayTappedObject, dateSelect},
  });
};

export const updateScheduleData = (payload, callback) => {
  return async (dispatch, getState) => {
    let routeName = getState().globalReducer.routeName;
    let navigationInstance = getState().app.navigationInstance;
    let verifiedServerUrl = await LocalStorageServices.getItem(VERIFIED_URL);
    if (isInternetConnected()) {
      dispatch(updateLoadingStatus(true));
      ApiManager.postApiCallNoStatus(
        verifiedServerUrl + ApiPaths.addScheduleData,
        payload,
        response => {
          dispatch(updateLoadingStatus(false));
          callback(response);
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
