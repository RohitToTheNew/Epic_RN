import {SAVE_CALENDAR_DATA, UPDATE_MARKED_DATES} from '../constants';
import utils from '../../../utils';
const {formatCurrentDate} = utils;
const initialState = {
  dayTypes: null,
  calendarData: null,
  currentDate: null,
  markedDates: {},
  selectedDaysArray:[],
  focusedMonthData: formatCurrentDate('YYYY-MM-DD'),
};

export const schedulerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_CALENDAR_DATA: {
      return {...state, ...action.payload};
    }

    case UPDATE_MARKED_DATES: {
      return {...state, markedDates:{...state.markedDates, ...action.payload.dayTappedObject}};
    }

    default:
      return state;
  }
};
