import {
  UPDATE_LOADING_STATUS,
  GLOBAL_STATE_UPDATE
} from '../constants';



export const updateLoadingStatus = isLoading => dispatch => {
  dispatch({
    type: UPDATE_LOADING_STATUS,
    isLoading,
  });
};

export const globalStateUpdate = (key, value) => dispatch => {
  dispatch({
    type: GLOBAL_STATE_UPDATE,
    payload: {[key]: value},
  });
};
