import React, { useState, useEffect } from 'react';
/**
 * custom imports
 */
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import * as Sentry from '@sentry/react-native';
import * as RNLocalize from 'react-native-localize';
import NetInfo from '@react-native-community/netinfo';
import RootNavigator from './src/navigation/rootNavigator';
import { PersistGate } from 'redux-persist/integration/react';
import ConnectionScreen from './src/screens/connectionScreen';
import { persistor, store } from './src/store/configureStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomModal from './src/components/common/customBottomModal';
import { setI18nConfig } from './src/translations/translationHelper';
import CustomLoader from './src/components/common/customLoader';
import VersionUpdateScreen from './src/screens/versionUpdateScreen';
import ENV from './src/config/envs/env.json';
const { dsn, tracesSampleRate, environment } = ENV;
const App = () => {
    var netUnscribeFunc;
    const [isConnected, setIsConnected] = useState(false);

    function useForceUpdate() {
        const [value, setValue] = useState(0);
        console.log('Check force update value:', value);

        return () => setValue(value => ++value);
    }

    const forceUpdate = useForceUpdate();

    useEffect(() => {
        setI18nConfig();
        RNLocalize.addEventListener('change', handleLocalizationChange);
        netUnscribeFunc = NetInfo.addEventListener(networkState => {
            if (!networkState.isConnected) {
                setIsConnected(true);
            } else if (networkState.isConnected) {
                setIsConnected(false);
            }
        });

        return () => {
            RNLocalize.removeEventListener('change', handleLocalizationChange);
            netUnscribeFunc();
        };
    }, []);

    const handleLocalizationChange = () => {
        setI18nConfig();
        forceUpdate();
    };

    Sentry.init({
        dsn: dsn,
        tracesSampleRate: tracesSampleRate,
        environment: environment,
    });

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <SafeAreaProvider>
                    <RootNavigator />
                </SafeAreaProvider>
                <CustomModal isVisible={isConnected}>
                    <ConnectionScreen />
                </CustomModal>
                <VersionUpdateScreen />
                <Toast />
            </PersistGate>
            <CustomLoader />
        </Provider>
    );
};

export default Sentry.wrap(App);
