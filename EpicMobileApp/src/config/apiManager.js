//custom imports
import Instance from './rnfetchInstance';
import {sentryErrorHandler} from '../utils/errorHandler';
import utils from '../utils';
/**
 * post api
 *
 * @param params
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

/**
 * payload to send into api response callback when server is Unreachable
 */
const serverUnreachablePayload = {
  message: 'Server Unreachable',
  statusCode: 401,
};

const postApiCall = (
  endPoint,
  params,
  successCallback,
  errorCallback,
  header = Instance.header,
) => {
  Instance.rnfetchInstance
    .fetch('POST', endPoint, header, JSON.stringify(params))
    .then(response => {
      if (checkServerUnreachable(response)) {
        errorCallback(serverUnreachablePayload);
        return;
      }
      let parsedResponse;
      if (utils.IsJsonString(response.data)) {
        parsedResponse = JSON.parse(response.data);
      } else {
        parsedResponse = response.data;
      }
      if (response.respInfo.status === 406) {
        let payload = {
          message: response.data,
          statusCode: 406,
        };
        errorCallback(payload);
        return;
      }
      setTimeout(() => {
        if (parsedResponse.statusCode == 200) {
          successCallback(parsedResponse);
        } else if (parsedResponse.statusCode == 400) {
          errorCallback(parsedResponse);
        } else if (
          parsedResponse.statusCode === 401 &&
          parsedResponse.message.includes('No user session found')
        ) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
          return;
        } else if (parsedResponse.statusCode === 401) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
          return;
        } else if (parsedResponse.success) {
          successCallback(parsedResponse);
        }
      }, 1000);
    })
    .catch(error => {
      let errorPayload = {
        message: error.message,
      };
      if (checkUnsupportedUrl(error)) {
        errorPayload.statusCode = 401;
      }
      sentryErrorHandler(error);
      if (
        error.message === 'Could not connect to the server.' ||
        error.message.includes('Failed to connect to')
      ) {
        errorPayload.statusCode = 504;
      } else if (
        error.message === 'The request timed out.' ||
        error.message.includes('The request timed out')
      ) {
        errorPayload.statusCode = 504;
      }
      setTimeout(() => {
        errorCallback(errorPayload);
      }, 1000);
    });
};

/**
 * get api
 *
 * @param endPoint
 * @param errorCalback
 * @param successCallback
 */

const getApiCall = (endPoint, successCallback, errorCallback) => {
  Instance.rnfetchInstance
    .fetch('GET', endPoint, Instance.header)
    .then(response => {
      setTimeout(() => {
        let parsedResponse;
        if (checkServerUnreachable(response)) {
          errorCallback(serverUnreachablePayload);
          return;
        }
        let contentType =
          response.respInfo.headers[
            Object.keys(response.respInfo.headers).find(
              key => key.toLowerCase() === 'content-type',
            )
          ];
        if (contentType.includes('text/html')) {
          let errorPayload = {
            message: 'Invalid server url',
          };
          sentryErrorHandler(errorPayload);
          errorCallback(errorPayload);
        }
        try {
          if (utils.IsJsonString(response.data)) {
            parsedResponse = JSON.parse(response.data);
          } else {
            parsedResponse = response.data;
          }
          if (parsedResponse.success) {
            parsedResponse.statusCode = 200;
            successCallback(parsedResponse);
          }
          if (parsedResponse.statusCode == 200) {
            successCallback(parsedResponse);
          } else if (parsedResponse.statusCode == 400) {
            errorCallback(parsedResponse);
          } else if (
            parsedResponse.statusCode === 401 &&
            parsedResponse.message.includes('No user session found')
          ) {
            let errorPayload = {
              statusCode: parsedResponse.statusCode,
              message: parsedResponse.message,
            };
            errorCallback(errorPayload);
          } else if (parsedResponse.statusCode === 401) {
            let errorPayload = {
              statusCode: parsedResponse.statusCode,
              message: parsedResponse.message,
            };
            errorCallback(errorPayload);
            return;
          } else if (parsedResponse.statusCode === 500) {
            let errorPayload = {
              statusCode: parsedResponse.statusCode,
              message: parsedResponse.message,
            };
            errorCallback(errorPayload);
            return;
          } else if (parsedResponse.success) {
            parsedResponse.statusCode = 200;
            successCallback(parsedResponse);
          } else if (parsedResponse.success) {
            parsedResponse.statusCode = 200;
            successCallback(parsedResponse);
          }
        } catch (e) {
          let errorPayload = {
            message: 'Invalid server url',
          };
          sentryErrorHandler(e);
          errorCallback(errorPayload);
        }
      }, 1000);
    })
    .catch(error => {
      let errorPayload = {
        message: error.message,
      };
      if (checkUnsupportedUrl(error)) {
        errorPayload.statusCode = 401;
      }
      sentryErrorHandler(error);
      if (
        error.message === 'Could not connect to the server.' ||
        error.message.includes('Failed to connect to')
      ) {
        errorPayload.statusCode = 504;
      } else if (
        error.message === 'The request timed out.' ||
        error.message.includes('The request timed out')
      ) {
        errorPayload.statusCode = 504;
      }
      setTimeout(() => {
        errorCallback(errorPayload);
      }, 1000);
    });
};

/**
 * getApi call wrapper function when no status is received
 * @param {string} endPoint api endpoint
 * @param {function} successCallback function to call when api success
 * @param {function} errorCallback function to call when api fails
 * @param {number} timeout timeout in number (ms)
 */
const getApiCallNoStatus = (
  endPoint,
  successCallback,
  errorCallback,
  timeout = 1000,
) => {
  Instance.rnfetchInstance
    .fetch('GET', endPoint, Instance.header)
    .then(response => {
      if (checkServerUnreachable(response)) {
        errorCallback(serverUnreachablePayload);
        return;
      }
      setTimeout(() => {
        let parsedResponse;
        if (utils.IsJsonString(response.data)) {
          parsedResponse = JSON.parse(response.data);
        } else {
          parsedResponse = response.data;
        }
        if (
          parsedResponse.statusCode === 401 &&
          parsedResponse.message.includes('No user session found')
        ) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
          return;
        } else if (parsedResponse.statusCode === 401) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
          return;
        }
        successCallback(parsedResponse);
      }, timeout);
    })
    .catch(error => {
      let errorPayload = {
        message: error.message,
      };
      if (checkUnsupportedUrl(error)) {
        errorPayload.statusCode = 401;
      }
      sentryErrorHandler(error);
      if (
        error.message === 'Could not connect to the server.' ||
        error.message.includes('Failed to connect to')
      ) {
        errorPayload.statusCode = 504;
      } else if (
        error.message === 'The request timed out.' ||
        error.message.includes('The request timed out')
      ) {
        errorPayload.statusCode = 504;
      }
      setTimeout(() => {
        errorCallback(errorPayload);
      }, timeout);
    });
};

/**
 * post api call wrapper with no status code
 * @param {string} endPoint api endpoint
 * @param {object} params params to send in post api call
 * @param {function} successCallback function to call when api success
 * @param {function} errorCallback function to call when api fails
 * @param {number} timeout timeout in number (ms)
 */
const postApiCallNoStatus = (
  endPoint,
  params,
  successCallback,
  errorCallback,
) => {
  Instance.rnfetchInstance
    .fetch('POST', endPoint, Instance.header, JSON.stringify(params))
    .then(response => {
      let parsedResponse;
      if (checkServerUnreachable(response)) {
        errorCallback(serverUnreachablePayload);
        return;
      }
      if (utils.IsJsonString(response.data)) {
        parsedResponse = JSON.parse(response.data);
      } else {
        parsedResponse = response.data;
      }
      if (
        utils.IsJsonString(response.data) &&
        parsedResponse.statusCode === 401 &&
        parsedResponse.message.includes('No user session found')
      ) {
        let errorPayload = {
          statusCode: parsedResponse.statusCode,
          message: parsedResponse.message,
        };
        errorCallback(errorPayload);
        return;
      } else if (
        utils.IsJsonString(response.data) &&
        parsedResponse.statusCode === 401
      ) {
        let errorPayload = {
          statusCode: parsedResponse.statusCode,
          message: parsedResponse.message,
        };
        errorCallback(errorPayload);
        return;
      }
      let apiResponse = {
        statusCode: 200,
        message: response.data,
      };
      setTimeout(() => {
        successCallback(apiResponse);
      }, 1000);
    })
    .catch(error => {
      let errorPayload = {
        message: error.message,
      };
      if (checkUnsupportedUrl(error)) {
        errorPayload.statusCode = 401;
      }
      if (
        error.message === 'Could not connect to the server.' ||
        error.message.includes('Failed to connect to')
      ) {
        errorPayload.statusCode = 504;
      } else if (
        error.message === 'The request timed out.' ||
        error.message.includes('The request timed out')
      ) {
        errorPayload.statusCode = 504;
      }
      sentryErrorHandler(error);
      setTimeout(() => {
        errorCallback(errorPayload);
      }, 1000);
    });
};

/**
 * get api call handler with no delay
 * @param {string} endPoint api endpoint
 * @param {function} successCallback function to call when api success
 * @param {function} errorCallback function to call when api fails
 */
const getApiCallNoDelay = (endPoint, successCallback, errorCallback) => {
  Instance.rnfetchInstance
    .fetch('GET', endPoint, Instance.header)
    .then(response => {
      try {
        let parsedResponse;
        if (utils.IsJsonString(response.data)) {
          parsedResponse = JSON.parse(response.data);
        } else {
          parsedResponse = response.data;
        }
        if (checkServerUnreachable(response)) {
          errorCallback(serverUnreachablePayload);
          return;
        }
        if (parsedResponse.statusCode == 200 || parsedResponse.success) {
          successCallback(parsedResponse);
        } else if (parsedResponse.statusCode == 400) {
          errorCallback(parsedResponse);
        } else if (
          parsedResponse.statusCode === 401 &&
          parsedResponse.message.includes('No user session found')
        ) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
        } else if (parsedResponse.statusCode === 401) {
          let errorPayload = {
            statusCode: parsedResponse.statusCode,
            message: parsedResponse.message,
          };
          errorCallback(errorPayload);
          return;
        } else if (parsedResponse.success) {
          parsedResponse['statusCode'] = 200;
          successCallback(parsedResponse);
        }
      } catch (e) {
        let errorPayload = {
          message: 'Invalid server url',
        };
        sentryErrorHandler(e);
        errorCallback(errorPayload);
      }
    })
    .catch(error => {
      let errorPayload = {
        message: error.message,
      };
      if (checkUnsupportedUrl(error)) {
        errorPayload.statusCode = 401;
      }
      sentryErrorHandler(error);
      if (
        error.message === 'Could not connect to the server.' ||
        error.message.includes('Failed to connect to')
      ) {
        errorPayload.statusCode = 504;
      } else if (
        error.message === 'The request timed out.' ||
        error.message.includes('The request timed out')
      ) {
        errorPayload.statusCode = 504;
      }
      setTimeout(() => {
        errorCallback(errorPayload);
      }, 1500);
    });
};

/**
 * function to check if there is error into the URL when connecting with EPIC
 * @param {object} error object containing the error obtained from the RNFetchModule
 * @returns returns boolean indicating if the url has any error
 */
const checkUnsupportedUrl = error => {
  if (
    error?.message?.includes('unsupported URL') ||
    error?.message?.includes('RNFetchBlob request error: url == null')
  ) {
    return true;
  }
  return false;
};

/**
 *
 * @param {object} response object containing the server response
 * @returns returns boolean indicating if the server is reachable or not
 */
const checkServerUnreachable = response => {
  response?.respInfo?.statusCode == 502 || response?.respInfo?.status == 502
    ? true
    : false;
};

export default {
  getApiCall,
  postApiCall,
  postApiCallNoStatus,
  getApiCallNoStatus,
  getApiCallNoDelay,
};
