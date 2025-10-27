import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import AlertItem from '../../../src/screens/alerts/alertItem';
import {
  acknowledgeSafeAlert,
  getConfiguredButtons,
} from '../../../src/services/alert/action';
import { store } from '../../../src/store/configureStore';
import Toast from 'react-native-toast-message';
import apiManager from '../../../src/config/apiManager';
import * as AppAction from '../../../src/services/app/action';
import { render } from '@testing-library/react-native';

jest.mock('../../../src/config/apiManager', () => ({
  getApiCallNoDelay: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('eventNames[]=')) {
        successCallback({
          success: true,
          data: [
            {
              id: 1,
              event_id: 2,
              event_data:
                '{"10": {"eventName": "acknowledge", "displayName": "Acknowledge"}, "11": {"eventName": "endEvent", "displayName": "End Event"}, "18": {"eventName": "lockDown", "displayName": "Lock Down"}, "37": {"eventName": "escalate", "displayName": "Escalate"}}',
            },
          ],
        });
      }
    }),
  postApiCall: jest
    .fn()
    .mockImplementation((endPoint, params, successCallback, errorCallback) => {
      if (endPoint.includes('alerts/acknowledge')) {
        successCallback({
          success: true,
          data: {
            success: true,
            message: 'SafeAlert acknowledged successfully',
          },
          error: null,
        });
      }
    }),
  getApiCallNoStatus: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('events/getEventActionMapping')) {
        successCallback([{ actionName: 'escalate' }]);
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
  rowData: {
    item: {
      id: 435,
      source_ip: '34.230.46.247',
      device_id: 23,
      priority: 1,
      log: 'safeAlert from XD on undefined',
      event_name: 'safeAlert',
      event_sender_id: '10BCD',
      event_params:
        '{"event":{"eventName":"safeAlert","minorAlert":false,"source":"XD","unpaired":"false","deviceInfo":{"schoolId":null,"schoolName":"Staging-Updater","mapId":"10","mapName":"Map 10","zoneId":"","zoneName":"","roomId":"40","roomName":"40","roomDisplayName":"400 Testing The App - 1314 On IOS and Android","id":23,"deviceTypeId":6,"driverName":"ms500","deviceName":"Autofifuf","ip":"34.230.46.247","rtspUrl":"","hlsUrl":"","httpSnapShotUrl":"","educamType":"","port":4444,"extension":8523,"capabilities":"SPEAKER,SIP,XD","username":"admin","password":"admin","created":"2024-06-28 12:31:28","offlineAlertTime":"2024-07-03 03:00:00","modified":null,"status":2,"heartbeat":null,"passThroughDeviceID":"0","deviceSerialGW":"12303","deviceTCPControlPort":"12302","fwVersion":"","mac":"20:87:55:10:69:41","isListenAll":0,"barionetOutputActive":0,"barionetOutputs":null,"conferenceExtension":1231415,"deviceId":23,"type":"Ms-x00","remotePort":"","icon":"img_ms450_icon.png","description":""},"senderInfo":{"nearestDevices":[{"receiverId":"87A0A","deviceId":23,"pairedStatus":"1","signalStrength":"0.4"}],"senderId":"10BCD","devicePointOnCanvasString":""},"dateTimeOfEvent":"7/8/2024, 3:17:23 PM","emailActionUrl":"https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=","actionParams":[{"driver":null,"method":"resetAlert","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":1,"capabilityName":"xd"},{"driver":"MS-x50","method":"resetLED","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":3,"capabilityName":null},{"driver":null,"method":"broadcastMessage","className":"ui","params":{},"actionOrder":5,"capabilityName":null},{"driver":null,"method":"startRecording","className":"viewpathapi","params":{},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["1"],"subject":"safeAlert – Staging-Updater Room 40 ","message":"Event safeAlert has occurred in Staging-Updater 40 at 7/8/2024, 3:17:23 PM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=>https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=</a> ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["1"],"message":"Event safeAlert has occurred in Staging-Updater 40 at 7/8/2024, 3:17:23 PM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=>https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs=</a> ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["1"],"subject":"safeAlert - Staging-Updater Room 40 ","message":"SAFE Alert - Staging-Updater Room 40! <br><br> View EPIC System Status https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["1"],"message":"SAFE Alert - Staging-Updater Room 40! <br><br> View EPIC System Status https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notificationAlert","className":"ui","params":{"input":{"title":"SAFE ALERT! ","caption":"Demo Staging-Updater Dummy Room 40! Testing Demo dummy safeAlert Autofifuf Map 10 7/8/2024, 3:17:23 PM https://staging2.epic.audioe.org/safe-alert.html?tb=notify&senderId=10BCD&cs= {alertName} ","delay":0,"start":"Start with previous","isAlert":"false","audioFile":"safe-alert.wav","bindingVariables":"title,caption","executeEverytime":"true"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notifyEventOnDistrict","className":"district","params":{"input":{"title":"SAFE Alert at Staging-Updater! ","caption":"Staging-Updater Room 40! ","delay":0,"start":"Start with previous","bindingVariables":"title,caption"}},"actionOrder":7,"capabilityName":null}],"freshEvent":false}}',
      log_time: '2024-07-08 15:17:23',
      active: 1,
      displayName: 'Safe Alert',
      msDeviceId: 23,
    },
  },
  acknowledgePerformAction: true,
  showNotificationPopup:true
};

describe('Alert Item component', () => {
  it('should match the snapshot', () => {
    const tree = renderer
      .create(<AlertItem {...props} navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render the component correctly', () => {
    const { getByTestId } = render(<AlertItem {...props} navigation={navigation} />);
    expect(getByTestId('alertItem435')).toBeTruthy();
  })

  it('should fetch configured buttons for the SAFE Alert, and show the configured buttons under the safe alert item', async () => {
    const rowData = { item: { id: 1, event_name: 'safeAlert' } };
    const callback = jest.fn();
    await store.dispatch(getConfiguredButtons(rowData, callback));
    expect(store.getState().alert.configuredButtons.length).toBe(2);
  });

  it('should fetch configured buttons for the SAFE Alert, when escalate button is not configured, and show the configured buttons under the safe alert item', async () => {
    const rowData = { item: { id: 1, event_name: 'safeAlert' } };
    const callback = jest.fn();
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        successCallback({
          success: true,
          data: [
            {
              id: 1,
              event_id: 2,
              event_data:
                '{"10": {"eventName": "acknowledge", "displayName": "Acknowledge"}, "11": {"eventName": "endEvent", "displayName": "End Event"}, "18": {"eventName": "lockDown", "displayName": "Lock Down"}, "37": {"eventName": "fire", "displayName": "Fire"}}',
            },
          ],
        });
      });
    await store.dispatch(getConfiguredButtons(rowData, callback));
    expect(store.getState().alert.configuredButtons.length).toBe(2);
  });

  it('should fetch configured buttons for the SAFE Alert, and hide the escalate button, as it is not having any actions added', async () => {
    const rowData = {item: {id: 1, event_name: 'safeAlert'}};
    const callback = jest.fn();
    jest
      .spyOn(apiManager, 'getApiCallNoStatus')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        successCallback([]);
      });
    await store.dispatch(getConfiguredButtons(rowData, callback));
    expect(store.getState().alert.configuredButtons.length).toBe(1);
  });

  it('should logout the user if api gives 401 as response', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    const rowData = {item: {id: 1, event_name: 'safeAlert'}};
    const callback = jest.fn();
    await store.dispatch(getConfiguredButtons(rowData, callback));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when fetching configured buttons for the SAFE Alert', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    const rowData = {item: {id: 1, event_name: 'safeAlert'}};
    const callback = jest.fn();
    await store.dispatch(getConfiguredButtons(rowData, callback));
    expect(toastSpy).toBeCalled();
  });

  it('should acknowledge the SAFE Alert', async () => {
    const payload = {
      alertId: 1,
      eventName: 'safeAlert',
      devicePointOnCanvasString: '1.0',
      msDeviceId: 'MS1',
      listenSettingEnabled: true,
    };
    await store.dispatch(acknowledgeSafeAlert(payload));
    expect(store.getState().globalReducer.isLoading).toBe(false);
  });

  it('should show Toast due to Internet not connected, when acknowledging the SAFE Alert', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    const payload = {
      alertId: 1,
      eventName: 'safeAlert',
      devicePointOnCanvasString: '1.0',
      msDeviceId: 'MS1',
      listenSettingEnabled: true,
    };
    await store.dispatch(acknowledgeSafeAlert(payload));
    expect(toastSpy).toBeCalled();
  });

  it('should logout the user if api returns 401 as response', async () => {
    jest
      .spyOn(apiManager, 'postApiCall')
      .mockImplementation((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    const payload = {
      alertId: 1,
      eventName: 'safeAlert',
      devicePointOnCanvasString: '1.0',
      msDeviceId: 'MS1',
      listenSettingEnabled: true,
    };
    await store.dispatch(acknowledgeSafeAlert(payload));
    expect(store.getState().auth.userPermission).toBe(null);
  });
});
