import {
  SAFE_AREA_VIEW_INSETS,
  UPDATE_SERVER_STATUS,
  UPDATE_APP_STATUS,
  UPDATE_APP_MODAL_FIELDS,
} from '../constants';
import NetInfo from '@react-native-community/netinfo';

export const saveSafeAreaInsets = insets => dispatch => {
  dispatch({
    type: SAFE_AREA_VIEW_INSETS,
    insets,
  });
};

export const updateServerStatus = status => dispatch => {
  dispatch({
    type: UPDATE_SERVER_STATUS,
    status,
  });
};

export const isInternetConnected = async () => {
  return NetInfo.fetch().then(state => {
    return state.isConnected;
  });
};

export const updateAppStatus = status => dispatch => {
  dispatch({
    type: UPDATE_APP_STATUS,
    status,
  });
};

export const updateAppModalFields = (key, value) => dispatch => {
  dispatch({
    type: UPDATE_APP_MODAL_FIELDS,
    payload: {[key]: value},
  });
};
