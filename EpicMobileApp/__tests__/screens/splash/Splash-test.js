/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Splash from '../../../src/screens/splash';
import { fireEvent, render } from '@testing-library/react-native';
import { getUserPermissions, savePasswordChnage } from '../../../src/services/authorization/action';
import * as AppActionFunctions from '../../../src/services/app/action';
import { store } from '../../../src/store/configureStore';
import LocalStorageServices from '../../../src/services/localStorage';
import * as Translation from '../../../src/translations/translationHelper';
import apiManager from '../../../src/config/apiManager';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn()
};

jest.mock('../../../src/config/apiManager', () => ({
  getApiCall: jest
    .fn()
    .mockImplementation((endpoint, successCallback, errorCallback) => {
      if (endpoint.includes('roles/getuserpermissions')) {
        successCallback({
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
      }
    }),
  getApiCallNoStatus: jest
    .fn()
    .mockImplementation((endpoint, params, successCallback, errorCallback) => {
      if (endpoint.includes('/config/getschooldetail')) {
        successCallback({
          config: {
            id: '1',
            title: 'EPIC System',
            schoolName: 'Ermysteds Grammar Schools, Wimborne Minster, India ',
            schoolUrl: 'SCHOOL_LOGO',
            ae_pin_check: 'false',
            ae_pin_value: '@AE_PIN_VALUE@',
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
}));

describe('Splash Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should match the snapshot', () => {
    const tree = renderer.create(<Splash />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the Splash component correctly', () => {
    const { getByTestId } = render(<Splash navigation={navigation} />);
    expect(getByTestId('splashLottie')).toBeTruthy();
  });

  it('should read user permission from epic and show tabs with active permissions', async () => {
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
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://development.audioenhancement.com/');
    jest
      .spyOn(AppActionFunctions, 'isInternetConnected')
      .mockResolvedValueOnce(true);
    await store.dispatch(getUserPermissions(true, () => { }));
    expect(store.getState().auth.userPermission).toStrictEqual([
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

  it('should logout the user if read user permission api gives 401 as response', async () => {
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
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://development.audioenhancement.com/');
    jest
      .spyOn(AppActionFunctions, 'isInternetConnected')
      .mockResolvedValueOnce(true);
    jest
      .spyOn(apiManager, 'getApiCall')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: 'false',
          statusCode: 401,
          message: 'Something went wrong',
        });
      });
    await store.dispatch(getUserPermissions(true, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show error if read user permission api fails due to some error', async () => {
    const toastSpy = jest.spyOn(Toast, 'show');
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
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://development.audioenhancement.com/');
    jest
      .spyOn(AppActionFunctions, 'isInternetConnected')
      .mockResolvedValueOnce(true);
    jest
      .spyOn(apiManager, 'getApiCall')
      .mockImplementation((endpoint, successCallback, errorCallback) => {
        errorCallback({
          success: 'false',
          statusCode: 504,
          message: 'Something went wrong',
        });
      });
    await store.dispatch(getUserPermissions(true, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
    expect(toastSpy).toBeCalled();
  });

  it('should show toast when reading user permission from EPIC, and internet is not connected', async () => {
    const toastSpy = jest.spyOn(Toast, 'show');
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
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://development.audioenhancement.com/');
    jest
      .spyOn(AppActionFunctions, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getUserPermissions(true, () => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should naviagte to login screen after splash screen animation is finished', async () => {
    const mockSetState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [false, mockSetState]);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce(false);
    const { getByTestId } = render(
      <Provider store={store}>
        <Splash navigation={navigation} />
      </Provider>
    );
    const animationView = getByTestId('splashLottie');
    fireEvent(animationView, 'onAnimationFinish');
    expect(navigation.replace).toHaveBeenCalledWith('Login');
  });

  it('should naviagte to change password screen after splash screen animation is finished', async () => {
    const mockSetState = jest.fn();
    jest.spyOn(React, 'useState').mockImplementation(() => [true, mockSetState]);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce(true);
    const { getByTestId } = render(
      <Provider store={store}>
        <Splash navigation={navigation} />
      </Provider>
    );
    await store.dispatch(savePasswordChnage(true))
    const animationView = getByTestId('splashLottie');
    fireEvent(animationView, 'onAnimationFinish');
    expect(navigation.replace).toHaveBeenCalledWith('ChangePassword');
  });
});
