import {
  SAVE_USER_INFO,
  SAVE_SERVER_URL,
  SAVE_USER_PERMISSION,
  RESET_PERMISSION_STATE,
  SAVE_SCHOOL_NAME,
  SAVE_PASSWORD_CHANGE,
  UPDATE_AUTH_USER_DETAILS
} from '../constants';
const initialUserState = {
  user: null,
  verifiedServerUrl: null,
  userPermission: null,
  schoolName: null,
  passwordChange: false,
  serverUrl: '',
  userName: '',
  password: '',
  showDomainPicker: false,
  selectedUserType:1,
  isVerified:false
};

export const authReducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SAVE_USER_INFO: {
      return {
        ...state,
        user: action.user,
      };
    }
    case SAVE_SERVER_URL: {
      return {
        ...state,
        verifiedServerUrl: action.url,
      };
    }
    case SAVE_USER_PERMISSION: {
      return {
        ...state,
        userPermission: action.response,
      };
    }
    case RESET_PERMISSION_STATE: {
      return {
        ...state,
        userPermission: null,
      };
    }
    case SAVE_SCHOOL_NAME: {
      return {
        ...state,
        schoolName: action.response,
      };
    }
    case SAVE_PASSWORD_CHANGE: {
      return {
        ...state,
        passwordChange: action.passwordChange,
      };
    }
    case UPDATE_AUTH_USER_DETAILS:{
      return {
        ...state,
        ...action.payload
      }


    }
    default:
      return state;
  }
};
