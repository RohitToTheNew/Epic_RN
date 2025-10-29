import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LockdownDashboard from '../../../src/screens/alerts/LockdownDashboard';
import { fireEvent, render } from '@testing-library/react-native';
import * as AlertsAction from '../../../src/services/alert/action';
import * as AppAction from '../../../src/services/app/action';
import LocalStorageServices from '../../../src/services/localStorage';
import apiManager from '../../../src/config/apiManager';
import { store } from '../../../src/store/configureStore';
import Toast from 'react-native-toast-message';

const props = {
  showMapView: jest.fn(),
};

const toastSpy = jest.spyOn(Toast, 'show');

jest.mock('../../../src/config/apiManager', () => ({
  getApiCallNoDelay: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('lockdown/room-status')) {
        successCallback({
          success: true,
          data: [
            {
              id: 968,
              alert_id: 340,
              mapId: null,
              room_status:
                '{"38": {"people": null, "status": 1}, "39": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
            {
              id: 971,
              alert_id: 340,
              mapId: 1,
              room_status:
                '{"61": {"people": null, "status": 1}, "63": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
            {
              id: 966,
              alert_id: 340,
              mapId: 7,
              room_status:
                '{"4": {"people": null, "status": 1}, "5": {"people": null, "status": 1}, "59": {"people": null, "status": 1}, "62": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
            {
              id: 976,
              alert_id: 340,
              mapId: 84,
              room_status: '{"84": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
            {
              id: 974,
              alert_id: 340,
              mapId: 86,
              room_status: '{"80": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
            {
              id: 975,
              alert_id: 340,
              mapId: 89,
              room_status: '{"83": {"people": null, "status": 1}}',
              created_on: '2024-03-06 09:53:59',
              updated_on: '2024-03-06 09:53:59',
            },
          ],
          displayName: 'Lock Down',
          listenEnabled: true,
          safeViewEnabled: false,
          pending: 11,
          alerts: 0,
          secure: 0,
          peopleSecured: 0,
        });
      }
    }),
}));

describe('Lockdown Summary component', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<LockdownDashboard {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const { getByTestId } = render(<LockdownDashboard {...props} />);
    const allClearSpy = jest.spyOn(AlertsAction, 'allClearAction');
    const getMapsListSpy = jest.spyOn(AlertsAction, 'getMapsList');
    expect(getByTestId('lockdownDashboard')).toBeTruthy();
    expect(getByTestId('allClearButton')).toBeTruthy();
    expect(getByTestId('viewMapButton')).toBeTruthy();
    fireEvent.press(getByTestId('allClearButton'));
    expect(getByTestId('allClearpopupModal')).toBeTruthy();
    expect(getByTestId('allClearPopupButton')).toBeTruthy();
    expect(getByTestId('hideAllClearPopupButton')).toBeTruthy();
    fireEvent.press(getByTestId('allClearPopupButton'));
    expect(allClearSpy).toBeCalled();
    fireEvent.press(getByTestId('viewMapButton'));
    expect(getMapsListSpy).toBeCalled();
  });

  it('should fetch lockdown dashboard data from EPIC', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    await store.dispatch(AlertsAction.getLockdownDashboardData(() => { }));
    expect(store.getState().alert.lockdownDashboardData.data).toHaveLength(6);
  });

  it('should log out the user if api gives 401 as response', async () => {
    const navigationInstance = {
      routeName: 'Alerts',
      navigate: jest.fn(),
      replace: jest.fn(),
    };
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    store.dispatch(
      AppAction.updateAppModalFields('navigationInstance', navigationInstance),
    );
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(AlertsAction.getLockdownDashboardData(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when fetching lockdown dashboard data from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(AlertsAction.getLockdownDashboardData(() => { }));
    expect(toastSpy).toBeCalled();
  });
});
