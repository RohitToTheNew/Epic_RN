import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import LockdownSummary from '../../../src/screens/alerts/LockdownSummary';
import {getLockdownDashboardSummary} from '../../../src/services/alert/action';
import {store} from '../../../src/store/configureStore';
import Toast from 'react-native-toast-message';
import apiManager from '../../../src/config/apiManager';
import * as AppAction from '../../../src/services/app/action';
import {fireEvent, render} from '@testing-library/react-native';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => {
    return 100;
  },
}));

jest.mock('../../../src/config/apiManager', () => ({
  getApiCallNoDelay: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('lockdown/summary?alertId')) {
        successCallback({
          success: true,
          data: {
            id: 440,
            displayName: 'Lock Down',
            startTime: '2024-07-09 14:00:24',
            endTime: '2024-07-09 14:00:37',
            endedBy: 'vishal001',
            alertData: [],
            roomStatus: [
              {
                status_id: 1,
                rooms_count: 22,
                people_secure: null,
              },
            ],
          },
        });
      }
    }),
}));

const toastSpy = jest.spyOn(Toast, 'show');

const navigation = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

const props = {
  route: {
    params: {
      notificationPermission: true,
    },
  },
};

describe('Lockdown Summary component', () => {
  it('should match the snapshot', () => {
    const tree = renderer
      .create(<LockdownSummary {...props} navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const {getByTestId} = render(
      <LockdownSummary {...props} navigation={navigation} />,
    );
    expect(getByTestId('lockdownSummary')).toBeTruthy();
  });

  it('should fetch Lockdown Summary from EPIC and show summary screen modal', async () => {
    const id = 134;
    await store.dispatch(getLockdownDashboardSummary(id));
    expect(store.getState().alert.summaryData.alertData.length).toBe(0);
    expect(store.getState().alert.showSummary).toBe(true);
    const {getByTestId} = render(
      <LockdownSummary {...props} navigation={navigation} />,
    );
    expect(getByTestId('overAllDropdownButton')).toBeTruthy();
    const overAllView = getByTestId('overAllSummary');
    expect(getByTestId('overAllDropdownButton')).toBeTruthy();
    fireEvent.press(getByTestId('overAllDropdownButton'));
    expect(overAllView).toBeTruthy();
    expect(store.getState().alert.showSummary).toBe(true);
  });

  it('should fetch Lockdown Summary from EPIC and show summary screen modal, with alerts status', async () => {
    const id = 134;
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        successCallback({
          success: true,
          data: {
            id: 445,
            displayName: 'Lock Down',
            startTime: '2024-07-09 15:12:21',
            endTime: '2024-07-09 15:12:37',
            endedBy: 'vishal001',
            alertData: [
              {
                id: 444,
                log_time: '2024-07-09 15:12:08',
                updated_on: '2024-07-09 15:12:37',
                active: 0,
                comment: 'SafeAlert ended on clearing of Lockdown',
                event_params:
                  '{"event":{"eventName":"safeAlert","minorAlert":false,"source":"XD","unpaired":"false","deviceInfo":{"schoolId":null,"schoolName":"Staging-Updater","mapId":"10","mapName":"Map 10","zoneId":"","zoneName":"","roomId":"40","roomName":"40","roomDisplayName":"400 Testing The App - 1314 On IOS and Android","id":23,"deviceTypeId":6,"driverName":"ms500","deviceName":"Autofifuf","ip":"34.230.46.247","rtspUrl":"","hlsUrl":"","httpSnapShotUrl":"","educamType":"","port":4444,"extension":8523,"capabilities":"SPEAKER,SIP,XD","username":"admin","password":"admin","created":"2024-06-28 12:31:28","offlineAlertTime":"2024-07-03 03:00:00","modified":null,"status":2,"heartbeat":null,"passThroughDeviceID":"0","deviceSerialGW":"12303","deviceTCPControlPort":"12302","fwVersion":"","mac":"20:87:55:10:69:41","isListenAll":0,"barionetOutputActive":0,"barionetOutputs":null,"conferenceExtension":1231415,"deviceId":23,"type":"Ms-x00","remotePort":"","icon":"img_ms450_icon.png","description":""},"senderInfo":{"nearestDevices":[{"receiverId":"87A0A","deviceId":23,"pairedStatus":"1","signalStrength":"0.4"}],"senderId":"10BCD","devicePointOnCanvasString":""},"dateTimeOfEvent":"7/9/2024, 3:12:07 PM","emailActionUrl":"https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=","actionParams":[{"driver":null,"method":"resetAlert","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":1,"capabilityName":"xd"},{"driver":"MS-x50","method":"resetLED","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":3,"capabilityName":null},{"driver":null,"method":"broadcastMessage","className":"ui","params":{},"actionOrder":5,"capabilityName":null},{"driver":null,"method":"startRecording","className":"viewpathapi","params":{},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["1"],"subject":"safeAlert – Staging-Updater Room 40 ","message":"Event safeAlert has occurred in Staging-Updater 40 at 7/9/2024, 3:12:07 PM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=>https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=</a> ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["1"],"message":"Event safeAlert has occurred in Staging-Updater 40 at 7/9/2024, 3:12:07 PM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=>https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=</a> ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["1"],"subject":"safeAlert - Staging-Updater Room 40 ","message":"SAFE Alert - Staging-Updater Room 40! <br><br> View EPIC System Status https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["1"],"message":"SAFE Alert - Staging-Updater Room 40! <br><br> View EPIC System Status https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notificationAlert","className":"ui","params":{"input":{"title":"SAFE ALERT! ","caption":"Demo Staging-Updater Dummy Room 40! Testing Demo dummy safeAlert Autofifuf Map 10 7/9/2024, 3:12:07 PM https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= {alertName} ","delay":0,"start":"Start with previous","isAlert":"false","audioFile":"safe-alert.wav","bindingVariables":"title,caption","executeEverytime":"true"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notifyEventOnDistrict","className":"district","params":{"input":{"title":"SAFE Alert at Staging-Updater! ","caption":"Staging-Updater Room 40! ","delay":0,"start":"Start with previous","bindingVariables":"title,caption"}},"actionOrder":7,"capabilityName":null}],"freshEvent":true}}',
                user_id: 39,
                username: 'vishal001',
                fullname: 'vishal001',
                alertStatus: 'Resolved',
              },
            ],
            roomStatus: [
              {
                status_id: 1,
                rooms_count: 21,
                people_secure: null,
              },
              {
                status_id: 2,
                rooms_count: 1,
                people_secure: null,
              },
            ],
          },
        });
      });
    await store.dispatch(getLockdownDashboardSummary(id));
    const {getByTestId} = render(
      <LockdownSummary {...props} navigation={navigation} />,
    );
    expect(store.getState().alert.summaryData.alertData.length).toBe(1);
    fireEvent.press(getByTestId('alertsDropdownButton'));
    expect(store.getState().alert.showSummary).toBe(true);
  });

  it('should log out the user if 401 received in the LockdownSummary api', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    const id = 134;
    await store.dispatch(getLockdownDashboardSummary(id));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('it should show toast message if internet is not connected, when fetching Lockdown Summary from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    const id = 134;
    await store.dispatch(getLockdownDashboardSummary(id));
    expect(toastSpy).toBeCalled();
  });
});
