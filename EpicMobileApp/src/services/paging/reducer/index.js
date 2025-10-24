import {
  UPDATE_RECORDING_PATH,
  UPDATE_SELECTED_ZONE,
  UPDATE_PAGING_MODAL_FIELDS,
} from '../constants';

const initialState = {
  recordingPath: '',
  selectedZoneData: {},
  preventTabSwitch: false,
  audioData:{}
};

export const pagingReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_RECORDING_PATH: {
      return {
        ...state,
        recordingPath: action.path,
      };
    }
    case UPDATE_SELECTED_ZONE: {
      return {
        ...state,
        selectedZone: action.zone,
      };
    }
    case UPDATE_PAGING_MODAL_FIELDS: {
      return {...state, ...action.payload};
    }
    default:
      return state;
  }
};
