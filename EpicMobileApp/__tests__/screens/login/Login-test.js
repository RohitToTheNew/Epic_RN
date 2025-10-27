import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Login from '../../../src/screens/login';
import { fireEvent, render } from '@testing-library/react-native';
import {
  changePassword,
  fetchCSRFToken,
  filteredUserPermission,
  getRoles,
  getSchoolDetails,
  getSecureCheckIn,
  getSSOCredentials,
  getSSOToken,
  login,
  logout,
  saveSignedInUserInfo,
  validateServerUrl,
} from '../../../src/services/authorization/action';
import { store } from '../../../src/store/configureStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import * as Translation from '../../../src/translations/translationHelper';
import * as AppAction from '../../../src/services/app/action';
import Toast from 'react-native-toast-message';
import apiManager from '../../../src/config/apiManager';
import { globalStateUpdate } from '../../../src/services/globalState/action';
import { updateAppModalFields } from '../../../src/services/app/action';

const toastSpy = jest.spyOn(Toast, 'show');

jest.mock('../../../src/config/apiManager', () => ({
  getApiCall: jest
    .fn()
    .mockImplementation((endpoint, successCallback, errorCallback) => {
      if (endpoint.includes('/config/validateServerUrl')) {
        successCallback({
          data: {
            ldapEnable: 'true',
            ldapUrl: '20.84.36.151',
            ldapBaseDN: 'dc=aetest,dc=local',
            ldapDomain: 'aetest.local',
            ldapPort: '636',
            ldapSsl_support: 'true',
            apiVersion: '2.0.0.0',
            isValidCertificates: false,
          },
          message: 'Server URL validated successfully.',
          success: true,
          statusCode: 200,
        });
      } else if (endpoint.includes('/logout')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'user logged out successfully!',
        });
      } else if (endpoint.includes('/getrole')) {
        successCallback({
          roleId: 6,
          uid: 60,
        });
      } else if (endpoint.includes('userinfo')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'User info fetched successfully.',
          data: {
            user: {
              username: 'vishal',
              fullname: 'vishal',
              email: '',
              role_id: 6,
              image: '',
            },
          },
        });
      } else if (endpoint.includes('/csrfToken')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'CSRF Token fetched successfully.',
          data: {
            'CSRF-Token': '5I0M0FCk-O4HlJXar7Ys7K61qsZ0hgG-D-IY',
          },
        });
      }
    }),
  postApiCall: jest
    .fn()
    .mockImplementation((endpoint, params, successCallback, errorCallback) => {
      if (endpoint.includes('/login')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'successfull login',
          data: {
            redirectQueryString: '/',
            passwordChange: true,
            defaultCreds: false,
          },
        });
      } else if (endpoint.includes('/changepassword')) {
        successCallback({
          data: { result: '1' },
          success: true,
          statusCode: 200,
          message: 'Password updated Successfully.',
        });
      } else if (endpoint.includes('events/info')) {
        successCallback({
          data: [{ secureCheckIn: 1 }],
          success: true,
          statusCode: 200,
          message: 'Password updated Successfully.',
        })
      }
    }),
  getApiCallNoStatus: jest
    .fn()
    .mockImplementation((endpoint, params, successCallback, errorCallback) => {
      if (endpoint.includes('config/getschooldetail')) {
        successCallback({
          config: {
            id: '1',
            title: 'EPIC System',
            schoolName: 'Ermysteds Grammar Schools, Wimborne Minster, India ',
            schoolUrl: 'SCHOOL_LOGO',
            ae_pin_check: 'false',
            ae_pin_value: 'null',
            ae_externalcall_check: 'false',
            VIEWpathLiveEnabled: '@VIEWpathLiveEnabled@',
          },
          versionNumber: '2.5.2.0',
          sip_detail: {
            sip_extension: '',
            sip_username: 'vishal',
            sip_password: '',
          },
        });
      }
    }),
  getApiCallNoDelay: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('/getToken')) {
        successCallback({
          success: true,
          data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWJjZCIsImlhdCI6MTcwNzIxMzc0MywiZXhwIjoxNzA3MjE0MDQzfQ.fhipTrHjiIffMuggwHgqOcu3GTQsAMd9l5wh56K1msw',
        });
      } else if (endPoint.includes('get-sso-creds-mobile')) {
        successCallback({
          success: 1,
          data: [
            {
              id: 1,
              name: 'ClassLink',
              client_id: 'c166910512444454ce3d2f2e65bd54ce754678342bff',
              client_secret_exists: 1,
              domain: '',
              variable_hostname: 0,
              hostname: '',
              is_active: 0,
            },
            {
              id: 2,
              name: 'RapidIdentity',
              client_id: '',
              client_secret_exists: 0,
              domain: '',
              variable_hostname: 1,
              hostname: '',
              is_active: 0,
            },
            {
              id: 3,
              name: 'Microsoft',
              client_id: 'e0ad407c-bb30-4780-a019-cfbda72f4f22',
              client_secret_exists: 1,
              domain: '',
              variable_hostname: 0,
              hostname: '',
              is_active: 0,
            },
            {
              id: 4,
              name: 'Google',
              client_id:
                '679887497295-ovu9h39lb02dp3fgla5j6suj1rf1lqk4.apps.googleusercontent.com',
              client_secret_exists: 1,
              domain: 'gmail.com',
              variable_hostname: 0,
              hostname: '',
              is_active: 1,
            },
            {
              id: 5,
              name: 'Clever',
              client_id: '4ca50ac408cbb929f500',
              client_secret_exists: 1,
              domain: '',
              variable_hostname: 0,
              hostname: '',
              is_active: 0,
            },
          ],
          recordsTotal: 5,
          recordsFiltered: 5,
        });
      }
    }),
}));

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('Login Component', () => {
  let dispatchSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    render(<Login navigation={navigation} />);
    const reactRedux = { useDispatch, useSelector };
    dispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    selectorSpy = jest.spyOn(reactRedux, 'useSelector');
  });

  it('should match the snapshot', () => {
    jest.spyOn(React, 'createRef').mockImplementation(() => { });
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('render the component correctly', () => {
    const { getByTestId } = render(<Login navigation={navigation} />);
    expect(getByTestId('loginScreen')).toBeTruthy();
    expect(getByTestId('serverUrlInput')).toBeTruthy()
    fireEvent.changeText(getByTestId('serverUrlInput'), 'https://development.audioenhancement.com')
    expect(getByTestId('verifyUrlButton')).toBeTruthy()
    fireEvent.press(getByTestId('verifyUrlButton'))
    expect(dispatchSpy).toBeCalled()
  });

  it('should validate server url', async () => {
    const localStorageSpy = jest.spyOn(AsyncStorage, 'setItem');
    await store.dispatch(
      validateServerUrl(
        false,
        'https://development.audioenhancement.com',
        () => { },
      ),
    );
    expect(localStorageSpy).toBeCalledWith(
      'VERIFIED_URL',
      JSON.stringify('https://development.audioenhancement.com/'),
    );
  });

  it('should validate server url', async () => {
    const localStorageSpy = jest.spyOn(AsyncStorage, 'setItem');
    jest.spyOn(apiManager, 'getApiCall').mockImplementationOnce((endpoint, successCallback, errorCallback) => {
      errorCallback({
        success: false,
        message: 'Something went wrong',
        statusCode: 502
      })
    })
    await store.dispatch(
      validateServerUrl(
        false,
        'https://development.audioenhancement.com',
        () => { },
      ),
    );
    expect(store.getState().auth.isVerified).toBeFalsy()
  });

  it('should show Toast due to Internet not connected, when validating the server url from epic', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementationOnce(() => false);
    await store.dispatch(validateServerUrl(
      true,
      'https://development.audioenhancement.com',
      () => { },
    ))
    expect(toastSpy).toBeCalled();
  })

  it('should login to the EPIC mobile app', async () => {
    const localStorageSpy = jest.spyOn(AsyncStorage, 'setItem');
    const loginCredentials = {
      uid: 'demouser',
      passwd: 'demopassword',
    };
    await store.dispatch(login(loginCredentials, () => { }));
    expect(localStorageSpy).toBeCalledWith(
      'LOGGED_IN_SESSION',
      JSON.stringify(true),
    );
  });

  it('should logout of the EPIC mobile app', async () => {
    const localStorageSpy = jest.spyOn(AsyncStorage, 'removeItem');
    await store.dispatch(logout(() => { }));
    expect(localStorageSpy).toBeCalledWith('LOGGED_IN_SESSION');
  });

  it('should fetch role of the user, and store the active role into reducer', async () => {
    const localStorageSpy = jest.spyOn(AsyncStorage, 'removeItem');
    await store.dispatch(getRoles(() => { }));
    expect(store.getState().globalReducer.isLoading).toBe(false);
  });

  it('should check if SecureCheckin is enabled on epic and show the Lockdown dashboard', async () => {
    await store.dispatch(getSecureCheckIn())
    expect(store.getState().app.secureCheckIn).toBeTruthy()
  })

  it('should check if SecureCheckin is disabled on epic and hide the Lockdown dashboard', async () => {
    jest.spyOn(apiManager, 'postApiCall').mockImplementationOnce((endpoint, params, successCallback, errorCallback) => {
      successCallback({
        data: [{ secureCheckIn: 0 }],
        success: true,
        statusCode: 200,
        message: 'Password updated Successfully.',
      })
    })
    await store.dispatch(getSecureCheckIn())
    expect(store.getState().app.secureCheckIn).toBeFalsy()
  })

  it('should log out the user if fetch secured checkin flag api gives 401 as response', async () => {
    jest.spyOn(apiManager, 'postApiCall').mockImplementationOnce((endpoint, params, successCallback, errorCallback) => {
      errorCallback({
        success: false,
        statusCode: 401,
        message: 'Something went wrong.',
      })
    })
    await store.dispatch(getSecureCheckIn())
    expect(store.getState().auth.userPermission).toBe(null);
  })

  it('should fetch details of the logged in user', async () => {
    await store.dispatch(saveSignedInUserInfo(() => { }));
    expect(store.getState().auth.user.username).toBe('vishal');
  });

  it('should log out the user if get user roles api gives 401 as response', async () => {
    jest
      .spyOn(apiManager, 'getApiCall')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: 'false',
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    await store.dispatch(getRoles(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should log out the user if get signed in usr info api gives 401 as response', async () => {
    store.dispatch(globalStateUpdate('routeName', 'Splash'))
    store.dispatch(updateAppModalFields('navigationInstance', navigation))
    jest
      .spyOn(apiManager, 'getApiCall')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: false,
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    await store.dispatch(saveSignedInUserInfo(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should change password of the user on EPIC', async () => {
    const payload = {
      new_password: 'Epic@1234',
      forcePwChange: 0,
    };
    await store.dispatch(changePassword(payload, () => { }));
    expect(store.getState().auth.passwordChange).toBe(false);
  });

  it('should log out the user if change password api gives 401 as response', async () => {
    jest
      .spyOn(apiManager, 'postApiCall')
      .mockImplementation(
        (endpoint, params, successCallback, errorCallback) => {
          errorCallback({
            success: false,
            statusCode: 401,
            message: 'Something went wrong.',
          });
        },
      );
    const payload = {
      new_password: 'Epic@1234',
      forcePwChange: 0,
    };
    await store.dispatch(changePassword(payload, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should filter the available user permissions on EPIC, and show tabs with active permissions', () => {
    jest
      .spyOn(Translation, 'translate')
      .mockImplementationOnce(() => {
        return 'View Home Page';
      })
      .mockImplementationOnce(() => {
        return 'Paging';
      })
      .mockImplementationOnce(() => {
        return 'Initiate Paging';
      });
    const permissions = filteredUserPermission({
      succes: true,
      statusCode: 200,
      message: 'User permissions fetched successfully!',
      data: [
        {
          module_id: 1,
          module_name: 'View Home Page',
          action_id: 1,
          permission: 1,
        },
        {
          module_id: 1,
          module_name: 'Paging',
          action_id: 2,
          permission: 1,
        },
        {
          module_id: 1,
          module_name: 'Initiate Paging',
          action_id: 4,
          permission: 1,
        },
      ],
    });
    expect(permissions).toStrictEqual([
      {
        module_id: 1,
        module_name: 'View Home Page',
        action_id: 1,
        permission: 1,
      },
      {
        module_id: 1,
        module_name: 'Paging',
        action_id: 2,
        permission: 1,
      },
      {
        module_id: 1,
        module_name: 'Initiate Paging',
        action_id: 4,
        permission: 1,
      },
    ]);
  });

  it('should fetch school details from EPIC and show into the header compoonent', () => {
    store.dispatch(getSchoolDetails(() => { }));
    expect(store.getState().auth.schoolName).toBe(
      'Ermysteds Grammar Schools, Wimborne Minster, India ',
    );
  });

  it('should log out the user if get school details api gives 401 as response', () => {
    jest
      .spyOn(apiManager, 'getApiCallNoStatus')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: false,
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    store.dispatch(getSchoolDetails(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should fetch csrf token from the EPIC', () => {
    const callbackFn = () => { };
    store.dispatch(fetchCSRFToken(callbackFn));
    expect(dispatchSpy).toBeCalled();
  });

  it('should log out the user if get CSRF token api gives 401 as response', () => {
    jest
      .spyOn(apiManager, 'getApiCall')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: false,
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    store.dispatch(fetchCSRFToken(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should fetch SSO token from EPIC', async () => {
    await store.dispatch(getSSOToken(() => { }));
    expect(dispatchSpy).toBeCalled();
  });

  it('should log out the user if get SSO token api gives 401 as response', () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: false,
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    store.dispatch(getSSOToken(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should fetch SSO credentials from EPIC, and enable the Google SSO button on Login Screen', async () => {
    const ssoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    await store.dispatch(getSSOCredentials(ssoToken, () => { }));
    expect(store.getState().globalReducer.activeSSO).toStrictEqual({
      id: 4,
      name: 'Google',
      client_id:
        '679887497295-ovu9h39lb02dp3fgla5j6suj1rf1lqk4.apps.googleusercontent.com',
      client_secret_exists: 1,
      domain: 'gmail.com',
      variable_hostname: 0,
      hostname: '',
      is_active: 1,
    });
  });

  it('should log out the user if get SSO credentials api gives 401 as response', async () => {
    const ssoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: false,
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    await store.dispatch(getSSOCredentials(ssoToken, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

});
