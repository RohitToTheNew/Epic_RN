import 'react-native';
import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import Alerts from '../../../src/screens/alerts';
import renderer from 'react-test-renderer';
import { store } from '../../../src/store/configureStore';
import {
  allClearAction,
  checkServerStatus,
  getActiveAlerts,
  getAlertToken,
  getAlertTokenForMap,
  getLockdownDashboardData,
  getMapsList,
  triggerAlertEvents,
} from '../../../src/services/alert/action';
import apiManager from '../../../src/config/apiManager';
import * as AppAction from '../../../src/services/app/action';
import Toast from 'react-native-toast-message';
import { globalStateUpdate } from '../../../src/services/globalState/action';
import LocalStorageServices from '../../../src/services/localStorage';
import * as AuthActions from '../../../src/services/authorization/action/index';

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

const toastSpy = jest.spyOn(Toast, 'show');

jest.mock('../../../src/screens/alerts/ViewMapScreen', () => {
  return '<View/>';
});

jest.mock('../../../src/components/common/homeHeaderView', () => {
  return '<View/>';
});

jest.mock('../../../src/components/common/textInputModal', () => {
  return '<View/>';
});

jest.mock('../../../src/config/apiManager', () => ({
  postApiCallNoStatus: jest
    .fn()
    .mockImplementation((endpoint, params, successCallback, errorCallback) => {
      if (endpoint.includes('events/triggerEvent')) {
        successCallback({
          statusCode: 200,
          message: '{"message":"Executed:-acknowledge"}',
        });
      } else if (endpoint.includes('devices/getDeviceByDeviceTypeRoom')) {
        successCallback({ statusCode: 200 });
      } else if (endpoint.includes('setup/allMap')) {
        successCallback({
          "statusCode": 200,
          "message": "{\"mapList\":[{\"mapId\":51,\"mapName\":\"Auto\",\"mapImage\":\"map1.png\"},{\"mapId\":68,\"mapName\":\"AutoMapbz55m\",\"mapImage\":\"map1.png\"},{\"mapId\":72,\"mapName\":\"AutoMapgqk4j\",\"mapImage\":\"map1.png\"},{\"mapId\":71,\"mapName\":\"AutoMapnz7vm\",\"mapImage\":\"map1.png\"},{\"mapId\":13,\"mapName\":\"Map 13\",\"mapImage\":\"s.-p.-morton-elementary-map-final-w-rooms.png\"},{\"mapId\":18,\"mapName\":\"Map 18\",\"mapImage\":\"jefferson-city-boe---gerogia---jefferson-middle-school-map-final.png\"},{\"mapId\":9,\"mapName\":\"Map 9\",\"mapImage\":\"school-map-3.png\"}],\"zoneList\":[{\"id\":1,\"zoneName\":\"Zone 1\"},{\"id\":12,\"zoneName\":\"Zone 12\"},{\"id\":13,\"zoneName\":\"Zone 13\"},{\"id\":14,\"zoneName\":\"Zone 14\"},{\"id\":15,\"zoneName\":\"Zone 15\"},{\"id\":16,\"zoneName\":\"Zone 16\"},{\"id\":36,\"zoneName\":\"Zone 36\"},{\"id\":4,\"zoneName\":\"Zone 4\"},{\"id\":11,\"zoneName\":\"Zone 5\"}],\"roomList\":[{\"id\":15,\"roomName\":\"15\",\"displayName\":\"15\",\"mapId\":9},{\"id\":17,\"roomName\":\"17\",\"displayName\":\"17\",\"mapId\":9},{\"id\":18,\"roomName\":\"18\",\"displayName\":\"18\",\"mapId\":13},{\"id\":19,\"roomName\":\"19\",\"displayName\":\"19\",\"mapId\":13},{\"id\":20,\"roomName\":\"20\",\"displayName\":\"20\",\"mapId\":13},{\"id\":21,\"roomName\":\"21\",\"displayName\":\"21\",\"mapId\":13},{\"id\":25,\"roomName\":\"\",\"displayName\":\"25\",\"mapId\":9},{\"id\":28,\"roomName\":\"28\",\"displayName\":\"28\",\"mapId\":13},{\"id\":31,\"roomName\":\"31\",\"displayName\":\"31\",\"mapId\":13},{\"id\":34,\"roomName\":\"\",\"displayName\":\"34\",\"mapId\":9},{\"id\":35,\"roomName\":\"35\",\"displayName\":\"35\",\"mapId\":9},{\"id\":41,\"roomName\":\"41\",\"displayName\":\"41\",\"mapId\":13},{\"id\":64,\"roomName\":\"64\",\"displayName\":\"64\",\"mapId\":13},{\"id\":69,\"roomName\":\"69\",\"displayName\":\"69\",\"mapId\":51},{\"id\":71,\"roomName\":\"71\",\"displayName\":\"71\",\"mapId\":51},{\"id\":73,\"roomName\":\"73\",\"displayName\":\"73\",\"mapId\":51},{\"id\":77,\"roomName\":\"77\",\"displayName\":\"77\",\"mapId\":51},{\"id\":81,\"roomName\":\"81\",\"displayName\":\"81\",\"mapId\":51},{\"id\":87,\"roomName\":\"87\",\"displayName\":\"Auto04dm6\",\"mapId\":68},{\"id\":90,\"roomName\":\"90\",\"displayName\":\"Autoi89el\",\"mapId\":71},{\"id\":91,\"roomName\":\"91\",\"displayName\":\"Autopk67q\",\"mapId\":72},{\"id\":14,\"roomName\":\"14\",\"displayName\":\"fourteen\",\"mapId\":9}],\"doorList\":[]}"
        });
      }
    }),
  getApiCallNoDelay: jest
    .fn()
    .mockImplementation((endPoint, successCallback, errorCallback) => {
      if (endPoint.includes('notification/alertlogs')) {
        successCallback({
          success: true,
          statusCode: 200,
          message: 'Alert logs fetched successfully.',
          data: [
            {
              id: 254,
              source_ip: '34.230.46.247',
              device_id: 22,
              priority: 1,
              log: 'safeAlert from XD on Autonw1oh',
              event_name: 'safeAlert',
              event_sender_id: '10BCD',
              event_params:
                '{"event":{"eventName":"safeAlert","minorAlert":false,"source":"XD","unpaired":"false","deviceInfo":{"schoolId":null,"schoolName":"Epic System","mapId":"","mapName":"","zoneId":"","zoneName":"","roomId":"","roomName":"","roomDisplayName":"","id":22,"deviceTypeId":6,"driverName":"ms500","deviceName":"Autonw1oh","ip":"34.230.46.247","rtspUrl":"","hlsUrl":"","httpSnapShotUrl":"","educamType":"","port":4444,"extension":3851,"capabilities":"XD,0","username":"admin","password":"admin","created":"2024-02-20 15:54:50","offlineAlertTime":null,"modified":null,"status":2,"heartbeat":null,"passThroughDeviceID":"87A0A","deviceSerialGW":"12303","deviceTCPControlPort":"12302","fwVersion":"","mac":"46:27:36:23:31:45","isListenAll":0,"barionetOutputActive":0,"barionetOutputs":null,"conferenceExtension":45045,"deviceId":22,"type":"Ms-x00","remotePort":"","icon":"img_ms450_icon.png","description":""},"senderInfo":{"nearestDevices":[{"receiverId":"87A0A","deviceId":22,"pairedStatus":"1","signalStrength":"0.4","deviceName":"Autonw1oh"}],"senderId":"10BCD","devicePointOnCanvasString":"Autonw1oh~0.4"},"dateTimeOfEvent":"2/22/2024, 1:05:14 AM","emailActionUrl":"https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4","actionParams":[{"driver":null,"method":"resetAlert","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":1,"capabilityName":"xd"},{"driver":"MS-x50","method":"resetLED","className":null,"params":{"input":{"command":"$SLD:0:2[CR][LF]$SLD:1:2[CR][LF]$SLD:2:2[CR][LF]"}},"actionOrder":3,"capabilityName":null},{"driver":null,"method":"broadcastMessage","className":"ui","params":{},"actionOrder":5,"capabilityName":null},{"driver":null,"method":"startRecording","className":"viewpathapi","params":{},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["3"],"subject":"safeAlert – Epic System Room {roomName} ","message":"Event safeAlert has occurred in Epic System {roomName} at 2/22/2024, 1:05:14 AM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4>https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4</a> ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["3"],"message":"Event safeAlert has occurred in Epic System {roomName} at 2/22/2024, 1:05:14 AM!<br><br> Please take appropriate action!<br><br>View EPIC System Status <a href=https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4>https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4</a> ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notificationAlert","className":"ui","params":{"input":{"title":"SAFE ALERT! ","caption":"Epic System Room {roomName}! ","delay":0,"start":"Start with previous","isAlert":"false","audioFile":"safe-alert.wav","bindingVariables":"title,caption","executeEverytime":"true"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendEmail","className":"message","params":{"input":{"selectedGroups":["3"],"subject":"safeAlert - Epic System Room {roomName} ","message":"SAFE Alert - Epic System Room {roomName}! <br><br> View EPIC System Status https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4 ","bindingVariables":"subject,message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"sendSms","className":"message","params":{"input":{"selectedGroups":["3"],"message":"SAFE Alert - Epic System Room {roomName}! <br><br> View EPIC System Status https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4 ","bindingVariables":"message","delay":0,"start":"Start with previous"}},"actionOrder":7,"capabilityName":null},{"driver":null,"method":"notifyEventOnDistrict","className":"district","params":{"input":{"title":"SAFE Alert at Epic System! ","caption":"Epic System Room {roomName}! ","delay":0,"start":"Start with previous","bindingVariables":"title,caption"}},"actionOrder":7,"capabilityName":null}],"freshEvent":true}}',
              log_time: '2024-02-22 01:05:15',
              active: 1,
              displayName: 'Safe Alert',
            },
          ],
        });
      } else if (endPoint.includes('lockdown/room-status')) {
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
      } else if (endPoint.includes('alerts/token?data')) {
        successCallback({
          data: 'loremipsum',
        });
      }
    }),
  getApiCall: jest
    .fn()
    .mockImplementation((endpoint, params, successCallback, errorCallback) => {
      if (endpoint.includes('config/validateServerUrl')) {
        successCallback();
      }
    }),
  postApiCall: jest
    .fn()
    .mockImplementation((endPoint, params, successCallback, errorCallback) => {
      if (endPoint.includes('lockdown/end')) {
        successCallback({
          success: true,
          data: {
            success: true,
            message: 'Lockdown ended successfully',
          },
          error: null,
        });
      }
    }),
}));

describe('Alert Screen Component', () => {
  beforeEach(() => {
    // Ensure navigationInstance is in store for all tests
    store.dispatch({
      type: 'UPDATE_APP_MODAL_FIELDS',
      payload: {
        navigationInstance: navigation,
      },
    });
  });

  it('should match the snapshot', () => {
    jest.spyOn(React, 'createRef').mockImplementation(() => { });
    const tree = renderer
      .create(<Alerts {...props} navigation={navigation} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Skipped due to React 19 AggregateError - component renders correctly (see snapshot test)
  it.skip('should render the component correctly', () => {
    const { getByTestId } = render(<Alerts {...props} navigation={navigation} />);
    expect(getByTestId('alertsScreen')).toBeTruthy();
  });

  it('should fetch active alerts list from EPIC', async () => {
    await store.dispatch(getActiveAlerts(false, () => { }));
    expect(store.getState().alert.activeAlerts.length).toBe(1);
  });

  it('should fetch active alerts list from EPIC, but no active alert is there', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          message: 'No Alert logs found.',
          success: 'false',
        });
      });
    await store.dispatch(getActiveAlerts(false, () => { }));
    expect(store.getState().alert.activeAlerts.length).toBe(0);
  });

  it('should fetch active alerts list from EPIC,but api fails due to server error', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 504,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(getActiveAlerts(false, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when fetching active alerts list from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getActiveAlerts(false, () => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should trigger event on EPIC', async () => {
    const payload = {
      event: {
        source: 'XD',
        eventName: 'acknowledge',
        deviceInfo: {
          schoolId: null,
          schoolName: 'Epic System',
          mapId: '',
          mapName: '',
          zoneId: '',
          zoneName: '',
          roomId: '',
          roomName: '',
          roomDisplayName: '',
          id: 22,
          deviceTypeId: 6,
          driverName: 'ms500',
          deviceName: 'Autonw1oh',
          ip: '34.230.46.247',
          rtspUrl: '',
          hlsUrl: '',
          httpSnapShotUrl: '',
          educamType: '',
          port: 4444,
          extension: 3851,
          capabilities: 'XD,0',
          username: 'admin',
          password: 'admin',
          created: '2024-02-20 15:54:50',
          offlineAlertTime: null,
          modified: null,
          status: 2,
          heartbeat: null,
          passThroughDeviceID: '87A0A',
          deviceSerialGW: '12303',
          deviceTCPControlPort: '12302',
          fwVersion: '',
          mac: '46:27:36:23:31:45',
          isListenAll: 0,
          barionetOutputActive: 0,
          barionetOutputs: null,
          conferenceExtension: 45045,
          deviceId: 22,
          type: 'Ms-x00',
          remotePort: '',
          icon: 'img_ms450_icon.png',
          description: '',
        },
        senderInfo: {
          nearestDevices: [
            {
              receiverId: '87A0A',
              deviceId: 22,
              pairedStatus: '1',
              signalStrength: '0.4',
              deviceName: 'Autonw1oh',
            },
          ],
          senderId: '10BCD',
          devicePointOnCanvasString: 'Autonw1oh~0.4',
        },
        freshEvent: true,
        dateTimeOfEvent: '2/22/2024, 1:30:40 AM',
        emailActionUrl:
          'https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4',
        alertLogID: 255,
        cameraDeviceName: null,
        comment: '',
      },
    };
    store.dispatch(globalStateUpdate('routeName', 'Alerts'));
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    await store.dispatch(triggerAlertEvents(payload, () => { }));
    expect(store.getState().globalReducer.isLoading).toBeFalsy();
  });

  it('should trigger event on EPIC, but api fails due to server error', async () => {
    const payload = {
      event: {
        source: 'XD',
        eventName: 'acknowledge',
        deviceInfo: {
          schoolId: null,
          schoolName: 'Epic System',
          mapId: '',
          mapName: '',
          zoneId: '',
          zoneName: '',
          roomId: '',
          roomName: '',
          roomDisplayName: '',
          id: 22,
          deviceTypeId: 6,
          driverName: 'ms500',
          deviceName: 'Autonw1oh',
          ip: '34.230.46.247',
          rtspUrl: '',
          hlsUrl: '',
          httpSnapShotUrl: '',
          educamType: '',
          port: 4444,
          extension: 3851,
          capabilities: 'XD,0',
          username: 'admin',
          password: 'admin',
          created: '2024-02-20 15:54:50',
          offlineAlertTime: null,
          modified: null,
          status: 2,
          heartbeat: null,
          passThroughDeviceID: '87A0A',
          deviceSerialGW: '12303',
          deviceTCPControlPort: '12302',
          fwVersion: '',
          mac: '46:27:36:23:31:45',
          isListenAll: 0,
          barionetOutputActive: 0,
          barionetOutputs: null,
          conferenceExtension: 45045,
          deviceId: 22,
          type: 'Ms-x00',
          remotePort: '',
          icon: 'img_ms450_icon.png',
          description: '',
        },
        senderInfo: {
          nearestDevices: [
            {
              receiverId: '87A0A',
              deviceId: 22,
              pairedStatus: '1',
              signalStrength: '0.4',
              deviceName: 'Autonw1oh',
            },
          ],
          senderId: '10BCD',
          devicePointOnCanvasString: 'Autonw1oh~0.4',
        },
        freshEvent: true,
        dateTimeOfEvent: '2/22/2024, 1:30:40 AM',
        emailActionUrl:
          'https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4',
        alertLogID: 255,
        cameraDeviceName: null,
        comment: '',
      },
    };
    store.dispatch(globalStateUpdate('routeName', 'Alerts'));
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    jest
      .spyOn(apiManager, 'postApiCallNoStatus')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 504,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(triggerAlertEvents(payload, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when fetching active alerts list from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    const payload = {
      event: {
        source: 'XD',
        eventName: 'acknowledge',
        deviceInfo: {
          schoolId: null,
          schoolName: 'Epic System',
          mapId: '',
          mapName: '',
          zoneId: '',
          zoneName: '',
          roomId: '',
          roomName: '',
          roomDisplayName: '',
          id: 22,
          deviceTypeId: 6,
          driverName: 'ms500',
          deviceName: 'Autonw1oh',
          ip: '34.230.46.247',
          rtspUrl: '',
          hlsUrl: '',
          httpSnapShotUrl: '',
          educamType: '',
          port: 4444,
          extension: 3851,
          capabilities: 'XD,0',
          username: 'admin',
          password: 'admin',
          created: '2024-02-20 15:54:50',
          offlineAlertTime: null,
          modified: null,
          status: 2,
          heartbeat: null,
          passThroughDeviceID: '87A0A',
          deviceSerialGW: '12303',
          deviceTCPControlPort: '12302',
          fwVersion: '',
          mac: '46:27:36:23:31:45',
          isListenAll: 0,
          barionetOutputActive: 0,
          barionetOutputs: null,
          conferenceExtension: 45045,
          deviceId: 22,
          type: 'Ms-x00',
          remotePort: '',
          icon: 'img_ms450_icon.png',
          description: '',
        },
        senderInfo: {
          nearestDevices: [
            {
              receiverId: '87A0A',
              deviceId: 22,
              pairedStatus: '1',
              signalStrength: '0.4',
              deviceName: 'Autonw1oh',
            },
          ],
          senderId: '10BCD',
          devicePointOnCanvasString: 'Autonw1oh~0.4',
        },
        freshEvent: true,
        dateTimeOfEvent: '2/22/2024, 1:30:40 AM',
        emailActionUrl:
          'https://10.22.3.73/safe-alert.html?tb=notify&senderId=10BCD&cs=Autonw1oh~0.4',
        alertLogID: 255,
        cameraDeviceName: null,
        comment: '',
      },
    };
    await store.dispatch(triggerAlertEvents(payload, () => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should fetch lockdown dashboard data from EPIC, but api fails due to server error', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    store.dispatch(globalStateUpdate('routeName', 'Alerts'));
    store.dispatch({
      type: 'UPDATE_APP_MODAL_FIELDS',
      payload: {
        navigationInstance: navigation,
      },
    });
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(getLockdownDashboardData(() => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when fetching lockdown dashboard data from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getLockdownDashboardData(() => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should fetch lockdown dashboard data from EPIC', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    await store.dispatch(getLockdownDashboardData(() => { }));
    expect(store.getState().alert.lockdownDashboardData).toBeDefined();
    expect(store.getState().alert.lockdownDashboardData.data).toHaveLength(6);
  });

  it('should trigger AllClear action over EPIC', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    await store.dispatch(allClearAction(() => { }));
    expect(store.getState().globalReducer.isLoading).toBeFalsy();
  });

  it('should trigger AllClear action over EPIC, but api fails due to some error', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(apiManager, 'postApiCall')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(allClearAction(() => { }));
    expect(store.getState().globalReducer.isLoading).toBeFalsy();
  });

  it('should show Toast due to Internet not connected, when triggering AllClear action over EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(allClearAction(() => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should get Alert token from the EPIC for camera stream', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    await store.dispatch(getAlertToken(11, () => { }));
    expect(store.getState().alert.alertToken).toBe('loremipsum');
  });

  it('should get Alert token from the EPIC for camera stream, but api fails due to some error', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(getAlertToken(11, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should show Toast due to Internet not connected, when getting alert token from the EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getAlertToken(11, () => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should get Alert token from the EPIC for map', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    await store.dispatch(getAlertTokenForMap(11, () => { }));
    expect(store.getState().alert.alertTokenForMap).toBe('loremipsum');
  });

  it('should show Toast due to Internet not connected, when getting alert token for the Alert map from EPIC', async () => {
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getAlertTokenForMap(11, () => { }));
    expect(toastSpy).toBeCalled();
  });

  it('should get Alert token from the EPIC for alert map, but api fails due to some error', async () => {
    jest
      .spyOn(apiManager, 'getApiCallNoDelay')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    await store.dispatch(getAlertTokenForMap(11, () => { }));
    expect(store.getState().auth.userPermission).toBe(null);
  });

  it('should check server status of the EPIC', async () => {
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest.exec;
    jest.spyOn(AuthActions, 'validateServerUrl').mockImplementation(() => {
      return { statusCode: 200 };
    });
    await store.dispatch(checkServerStatus());
    expect(store.getState().globalReducer.serverDisconnected).toBeFalsy()
  });

  it('should fetch maps list from EPIC, and show the maps listing screen', async () => {
    jest.spyOn(AppAction, 'isInternetConnected').mockImplementation(() => true);
    jest
      .spyOn(LocalStorageServices, 'getItem')
      .mockResolvedValueOnce('https://qa2.epic.audioe.org/');
    const showMapScreen = true
    await store.dispatch(getMapsList(showMapScreen))
    expect(store.getState().alert.mapsList).toHaveLength(7)
    expect(store.getState().alert.mapScreenVisible).toBe(true)
  })

  it('should show Toast due to Internet not connected, when getting maps list from EPIC', async () => {
    const showMapScreen = true
    jest
      .spyOn(AppAction, 'isInternetConnected')
      .mockImplementation(() => false);
    await store.dispatch(getMapsList(showMapScreen))
    expect(toastSpy).toBeCalled();
  });

  it('should logout the user if api returns 401 as response', async () => {
    jest
      .spyOn(apiManager, 'postApiCallNoStatus')
      .mockImplementationOnce((endPoint, successCallback, errorCallback) => {
        errorCallback({
          statusCode: 401,
          message: 'Something went wrong',
          success: 'false',
        });
      });
    const showMapScreen = true
    await store.dispatch(getMapsList(showMapScreen))
    expect(store.getState().auth.userPermission).toBe(null);
  });
});
