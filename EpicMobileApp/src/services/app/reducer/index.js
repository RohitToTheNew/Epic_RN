import {
  SAFE_AREA_VIEW_INSETS,
  UPDATE_SERVER_STATUS,
  UPDATE_APP_MODAL_FIELDS,
  UPDATE_APP_STATUS,
} from '../constants';

const initialAppState = {
  safeAreaInset: {},
  serverDisconnected: false,
  appStatus: '',
  internetConnected: false,
  initialRouteName:'Notifications',
  isFoldableDevice: false,
  navigationInstance: {},
  certificatesValid: false,
  isLoggedOut: true,
  secureCheckIn: false
};

export const appReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case SAFE_AREA_VIEW_INSETS: {
      return {
        ...state,
        safeAreaInset: action.insets,
      };
    }
    case UPDATE_SERVER_STATUS: {
      return {
        ...state,
        serverDisconnected: action.status,
      };
    }
    case UPDATE_APP_STATUS: {
      return {
        ...state,
        appStatus: action.status,
      };
    }
    case UPDATE_APP_MODAL_FIELDS: {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return state;
  }
};
