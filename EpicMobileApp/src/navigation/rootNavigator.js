import React, {useEffect} from 'react';
import {AppState,Dimensions} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {
  saveSafeAreaInsets,
  updateAppModalFields,
  updateAppStatus,
  updateServerStatus,
} from '../services/app/action';
import MainNavigator from './mainNavigator';
import { globalStateUpdate } from '../services/globalState/action';

const RootNavigator = () => {
  const dispatch = useDispatch();
  var netUnscribeFunc;
  useEffect(() => {
    dispatch(updateAppStatus('active'));
    const subscription = AppState.addEventListener('change', nextAppState => {
      dispatch(updateAppStatus(nextAppState));
    });
    return () => {
      subscription.remove();
      dispatch(globalStateUpdate('serverDisconnected',false))
    };
  }, []);
  
  useEffect(() => {
    let deviceWidth = Dimensions.get('screen').width, deviceHeight = Dimensions.get('screen').height
    if(deviceHeight/deviceWidth<1.6){
      dispatch(updateAppModalFields('isFoldableDevice', true))
    }else{
      dispatch(updateAppModalFields('isFoldableDevice', false))
    }
  });


  useEffect(() => {
    netUnscribeFunc = NetInfo.addEventListener(networkState => {
      if (!networkState.isConnected) {
        dispatch(updateAppModalFields('internetConnected', true));
      } else if (networkState.isConnected) {
        dispatch(updateAppModalFields('internetConnected', false));
      }
    });
    return () => {
      netUnscribeFunc();
    };
  }, []);

  const insets = useSafeAreaInsets();
  dispatch(saveSafeAreaInsets(insets));
  return <MainNavigator />;
};

export default RootNavigator;
