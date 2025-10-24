import {
  UPDATE_LOADING_STATUS,
  GLOBAL_STATE_UPDATE
} from '../constants';

const initialAppState = {
    isLoading: false,
    isVisible: false,
    apiVersionStatus: '',
    stopAllFlag: false,
    routeName:'',
    showClasslink: false,
    activeSSO:{},
    epicApiVersion:null,
    serverDisconnected: false,
    revalidateSession: false
};

export const globalReducer = (state = initialAppState, action) => {
  switch (action.type) {
    case UPDATE_LOADING_STATUS: {
      return {
        ...state,
        isLoading: action.isLoading,
      };
    }
    case GLOBAL_STATE_UPDATE: {
      return {...state, ...action.payload};
    }
    default:
      return state;
  }
};
