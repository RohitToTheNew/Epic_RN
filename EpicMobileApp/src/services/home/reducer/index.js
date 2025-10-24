import {
  SAVE_NOTIFICATIONS_LIST,
  STOP_NOTIFICATIONS,
  TOGGLE_NOTIFICATION_POPUP,
  NOTIFICATION_EVENT_DETAILS,
  NOTIFICATION_TITLE,
} from '../constants';
const initialHomeState = {
  notificationsList: [],
  toggleNotification: false,
  notificationEventTitle: '',
  notificationDetail: [],
};

export const homeReducer = (state = initialHomeState, action) => {
  switch (action.type) {
    case SAVE_NOTIFICATIONS_LIST: {
      return {
        ...state,
        notificationsList: action.notifications,
      };
    }

    case TOGGLE_NOTIFICATION_POPUP: {
      return {
        ...state,
        toggleNotification: action.value,
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

    default:
      return state;
  }
};
