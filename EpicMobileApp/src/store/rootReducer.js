import {combineReducers} from 'redux';
import {appReducer} from '../services/app/reducer';
import {authReducer} from '../services/authorization/reducer';
import {homeReducer} from '../services/home/reducer';
import {notificationReducer} from '../services/notification/reducer';
import {pagingReducer} from '../services/paging/reducer';
import {schedulerReducer} from '../services/scheduler/reducer';
import { alertReducer } from '../services/alert/reducer';
import { globalReducer } from '../services/globalState/reducer';
export default combineReducers({
  app: appReducer,
  auth: authReducer,
  home: homeReducer,
  notification: notificationReducer,
  paging: pagingReducer,
  scheduler:schedulerReducer,
  alert: alertReducer,
  globalReducer:globalReducer
});
