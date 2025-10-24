import {
  TOGGLE_NOTIFICATION_POPUP,
  NOTIFICATION_EVENT_DETAILS,
  NOTIFICATION_TITLE,
  SAVE_NOTIFICATIONS_STATUS,
  TOGGLE_NOTIFICATION_ALERT,
  NOTIFICATION_EVENT_DETAILS_RESET,
  UPDATE_NOTIFICATION_MODAL_FIELDS
} from '../constants';
const initialState = {
  toggleNotification: false,
  notificationEventTitle: '',
  notificationDetail: [],
  notificationsStatus: [],
  notificationAlert: false,
  notificationsCopyList:[],
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NOTIFICATION_POPUP: {
      return {
        ...state,
        toggleNotification: action.value,
      };
    }
    case TOGGLE_NOTIFICATION_ALERT: {
      return {
        ...state,
        notificationAlert: action.value,
      };
    }

    case NOTIFICATION_TITLE: {
      return {
        ...state,
        notificationEventTitle: action.title,
      };
    }

    case NOTIFICATION_EVENT_DETAILS: {
      return {
        ...state,
        notificationDetail: [...state.notificationDetail, action.data],
      };
    }
    case NOTIFICATION_EVENT_DETAILS_RESET: {
      return {
        ...state,
        notificationDetail: [],
      };
    }
    case SAVE_NOTIFICATIONS_STATUS: {
      return {
        ...state,
        notificationsStatus: action.notificationsStatus,
      };
    }

    case UPDATE_NOTIFICATION_MODAL_FIELDS: {
      return {...state, ...action.payload};
    }

    default:
      return state;
  }
};
