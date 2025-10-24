import {Linking, Platform, Alert} from 'react-native';
import Toast from 'react-native-toast-message';
import {translate} from '../translations/translationHelper';
import {isTablet, hasNotch, getDeviceId} from 'react-native-device-info';
import moment from 'moment';
import {sentryErrorHandler} from './errorHandler';
import config from '../config';
const privacyLink = 'https://audioenhancement.com/privacy/';
const termsCondition = 'https://audioenhancement.com/terms/';

const openLinkUrl = url => {
  Linking.canOpenURL(url)
    .then(async supported => {
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log('Unable to open the url');
      }
    })
    .catch(err => {
      sentryErrorHandler(err);
    });
};

const showAlert = (title, message, buttons) => {
  Alert.alert(title, message, [...buttons]);
};

const checkNumberAndSpecialCharacter = string => {
  return /^(?=.*[0-9])(?=.*[\@\#\$\%\^\&\*\(\)\_\+\!])/.test(string);
};

const checkNumberAndUpperCase = string => {
  return /^(?=.*[0-9])(?=.*[A-Z])/.test(string);
};

const checkUpperCaseAndSpecialChar = string => {
  return /^(?=.*[A-Z])(?=.*[\@\#\$\%\^\&\*\(\)\_\+\!])/.test(string);
};

const isAndroid = Platform.OS === 'android';

const isIOS = Platform.OS === 'ios';

const isIpad = Platform.isPad;
const tablet = isTablet();
const deviceHasNotch = hasNotch();

const showToast = (message = translate('apiFailed'), message2) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: message2,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
  });
};
const showToastLong = (message = translate('apiFailed'), message2) => {
  Toast.show({
    type: 'error',
    text1: message,
    text2: message2,
    position: 'bottom',
    visibilityTime: 10000,
    autoHide: true,
  });
};

const showMessageOnToast = ({text1, ...rest}) => {
  Toast.show({
    type: 'success',
    position: 'bottom',
    text1: text1,
    visibilityTime: 3000,
    autoHide: true,
    ...rest,
  });
};

const removeSpace = string => {
  return string.replace(/\s/g, '');
};

/**
 * @description Conditional rendering.
 * @param condition to be passed on which render will be checked.
 * @param content to be rendered on condition true.
 */

const renderIf = (condition, content) => {
  if (condition) {
    return content;
  } else {
    return null;
  }
};

const findDay = date => {
  var check = moment(date, 'YYYY/MM/DD');
  var day = check.format('dddd');
  return day;
};

/**
 * @description Format date in specified Format.
 * @param date date to be parsed.
 * @param format format in which date is required.
 */

const formatDate = (date, format) => moment(date).format(format);

/**
 * @description Format Current date in specified Format.
 * @param format format in which date is required.
 */

const formatCurrentDate = format => moment().format(format);

/**
 * @description Format Timestamp to date Format.
 */

const convertTimestampToDate = timeStamp =>
  moment(timeStamp).format('YYYY-MM-DD');

/**
 * @description Check if date falls on same month,year,day.
 * @param date date to check.
 * @param timePeriod year,month,day.
 * @param dateToCompare year,month,day.
 */

const isSame = (dateToCompare, date, timePeriod) =>
  moment(date).isSame(dateToCompare, timePeriod);

/**
 * @description Check if object is empty or not.
 * @param inputObject object to check.
 */
const isEmpty = inputObject => {
  return Object.keys(inputObject).length === 0;
};

const dowObject = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

const getDaysOfMonth = (year, month, dow) => {
  --month;
  var d = new Date(year, month, 1);
  var dow_first = d.getDay();
  var date = ((7 + dow - dow_first) % 7) + 1;
  var dates = [];
  d.setDate(date);
  do {
    dates.push(moment(d).format('YYYY-MM-DD'));
    date += 7;
    d.setDate(date);
  } while (d.getMonth() === month);
  return dates;
};

const getYear = date => moment(date).year().toString();

const getMonth = date => moment(date).month() + 1;
const credentialsErrorMessage = 'Please enter valid username and password.';

function compare(a, b) {
  if (a.id < b.id) {
    return -1;
  }
  if (a.id > b.id) {
    return 1;
  }
  return 0;
}
const cameraDriver = [
  'eduCam360_C',
  'eduCam360_P',
  'eduCam_PTZ',
  'eduCam_PTZ_B',
  'eduCam360',
];

const capitalizeText = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getTabPermission = (arr, module) => {
  return (
    arr?.filter(item => item.module === module && item.Permission === 1)
      ?.length > 0
  );
};

const IsJsonString = str => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const splitJoin = string => {
  return string.split('.').join('');
};

const checkApiVersion = apiVersion => {
  let epicVersion = splitJoin(apiVersion),
    appApiVersion = splitJoin(config.AppConfig.apiVersion),
    errorMessage = '',
    updateRequired,
    forceUpdateFlag = true;

  if (epicVersion === appApiVersion) {
    forceUpdateFlag = true;
    updateRequired = 'none';
  } else if (epicVersion > appApiVersion) {
    errorMessage =
      'Your mobile app version is outdated. Please update your mobile app.';
    updateRequired = 'mobile';
    forceUpdateFlag = false;
  }
  // else if (
  //   epicVersion === null ||
  //   epicVersion === undefined ||
  //   epicVersion < appApiVersion
  // ) {
  //   errorMessage = `Your epic api version is outdated. Please install epic API version ${config.AppConfig.apiVersion}.`;
  //   forceUpdateFlag = false;
  //   updateRequired = 'epic';
  // }
  return {forceUpdateFlag, errorMessage, updateRequired};
};

const appStoreLink = 'itms-apps://apps.apple.com/';

const playStoreLink = 'https://play.google.com/store';

const onUpdateTapped = () => {
  if (isAndroid) {
    openLinkUrl(playStoreLink);
  } else {
    openLinkUrl(appStoreLink);
  }
};

const isIphone8 = (deviceId = getDeviceId()) => {
  return deviceId === 'iPhone10,1' || deviceId === 'iPhone10,4';
};

const logType = {
  log: 'log',
  error: 'error',
};

const Log = (
  type = logType.log,
  message = translate('somethingWentWrong'),
  value,
) => {
  type === logType.log
    ? console.log(message, value)
    : console.error(message, value);
};

export default {
  Log,
  logType,
  openLinkUrl,
  showAlert,
  isAndroid,
  isIOS,
  privacyLink,
  termsCondition,
  checkNumberAndUpperCase,
  checkUpperCaseAndSpecialChar,
  checkNumberAndSpecialCharacter,
  showToast,
  removeSpace,
  renderIf,
  isIpad,
  tablet,
  findDay,
  formatDate,
  formatCurrentDate,
  convertTimestampToDate,
  isSame,
  isEmpty,
  dowObject,
  getDaysOfMonth,
  getYear,
  getMonth,
  credentialsErrorMessage,
  compare,
  cameraDriver,
  capitalizeText,
  getTabPermission,
  IsJsonString,
  checkApiVersion,
  appStoreLink,
  playStoreLink,
  onUpdateTapped,
  showMessageOnToast,
  deviceHasNotch,
  isIphone8,
  splitJoin,
  showToastLong,
};
