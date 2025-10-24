import {
  SAFE_ALERT_EVENT,
  NAVIGATE_TO_ALERT_SCREEN,
  SAVE_ALERT_DATA,
} from '../constants';

const initialState = {
  safeAlertEventDetail: [],
  toggleNavigate: false,
  activeAlerts: [],
  alertToken:'',
  alertTokenForMap : '',
  visible: false,
  alertMapViewToken: '',
  cameraDriverName: null,
  prevMapToken: '',
  prevStreamToken: '',
  showLockdownDashboard: false,
  lockdownDashboardData:{},
  mapsList:[],
  mapsListCopy:[],
  showSummary: false,
  summaryData:{},
  mapId:null,
  mapScreenVisible: false,
  configuredButtons:[],
  deviceNameOnCanvasString:'',
  lockdownDashboardAction:false
};

export const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAFE_ALERT_EVENT: {
      return {
        ...state,
        safeAlertEventDetail: [...state.safeAlertEventDetail, action.event],
      };
    }
    case SAVE_ALERT_DATA: {
      return {...state, ...action.payload};
    }
    case NAVIGATE_TO_ALERT_SCREEN: {
      return {
        ...state,
        toggleNavigate: action.toggleEvent,
      };
    }
    case SAVE_ALERT_DATA: {
      return {...state, ...action.payload};
    }
    default:
      return state;
  }
};
