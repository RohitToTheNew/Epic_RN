import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import SSOLoginScreen from '../../../src/screens/login/SSOLoginScreen';
import { render } from '@testing-library/react-native';
import { store } from '../../../src/store/configureStore';
import { loginWithSSO } from '../../../src/services/authorization/action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiManager from '../../../src/config/apiManager';

jest.mock('../../../src/config/apiManager', () => ({
  getApiCall: jest
    .fn()
    .mockImplementation((endpoint, successCallback, errorCallback) => {
      if (endpoint.includes('login?code=')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'successfull login',
          data: {
            redirectQueryString:
              '/?code=4/0AfJohXn4twQSJdBRViocRpJtvOdGDLPHztu-23qZLwqx2NvQJnY55IDtJh0gba2SkqSRWw',
            passwordChange: false,
            defaultCreds: false,
          },
        });
      }
    }),
  getApiCallNoStatus: jest.fn().mockImplementation((endpoint, successCallback) => {
    successCallback({
      success: true,
      statusCode: 200,
      message: 'School details fetched',
      config: {
        schoolName: 'Test School',
      },
    });
  })
}));

describe('SSOLoginScreen Component', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<SSOLoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  const localStorageSpy = jest.spyOn(AsyncStorage, 'setItem');
  const onPress = jest.fn();
  const onNavigationStateChange = jest.fn();

  it('should render the SSOLoginScreen correctly', () => {
    const { getByTestId } = render(
      <SSOLoginScreen
        onPress={onPress}
        onNavigationStateChange={onNavigationStateChange}
      />,
    );
    expect(getByTestId('ssoLoginScreenComponent')).toBeTruthy();
  });

  it('should login to EPIC after SSO validation is completed', () => {
    const url =
      'https://development.audioenhancement.com/login?code=4/0AfJohXn4twQSJdBRViocRpJtvOdGDLPHztu-23qZLwqx2NvQJnY55IDtJh0gba2SkqSRWw';
    store.dispatch(loginWithSSO(url, () => { }));
    expect(localStorageSpy).toBeCalledWith(
      'LOGGED_IN_SESSION',
      JSON.stringify(true),
    );
    expect(store.getState().auth.passwordChange).toBe(false);
  });
  it('should show error when api gives 500 as response', () => {
    const url =
      'https://development.audioenhancement.com/login?code=4/0AfJohXn4twQSJdBRViocRpJtvOdGDLPHztu-23qZLwqx2NvQJnY55IDtJh0gba2SkqSRWw';
    jest.spyOn(apiManager, 'getApiCall').mockImplementationOnce((endpoint, successCallback, errorCallback) => {
      errorCallback({
        success: false,
        statusCode: 500,
        message:
          'This user or domain is not authorized to sign in with this SSO provider. Please contact your administrator.',
      });
    })
    store.dispatch(loginWithSSO(url, () => { }));
    expect(store.getState().globalReducer.isLoading).toBe(false);
  });
});
