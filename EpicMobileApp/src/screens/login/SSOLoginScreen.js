import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import utils from '../../utils';
import styles from './styles';
import {Mixins} from '../../config/styles';
import {useSelector} from 'react-redux';
import {CloseIcon} from '../../config/imageConstants';
import CustomWebView from '../../components/common/customWebView';
import {sentryErrorHandler} from '../../utils/errorHandler';
import config from '../../config';
const {tablet} = utils;

const SSOLoginScreen = ({onPress, onNavigationStateChange}) => {
  const {verifiedServerUrl} = useSelector(state => state.auth);
  const {activeSSO} = useSelector(state => state.globalReducer);

  /**
   * on modal close action function
   */
  const onClose = () => {
    onPress();
  };

  /**
   * function to handle the error in webview
   * @param {object} arg error obtained from webview
   */
  const onError = arg => {
    sentryErrorHandler(arg);
  };

  /**
   * function to generate webview url on the basis of active sso
   * @returns url to open in webview
   */
  const getRedirectionUrl = () => {
    let url;
    if (activeSSO?.name.toLowerCase() === 'classlink') {
      url = `${
        config.AppConfig.classlinkConfig.login_url
      }?scope=openid&redirect_uri=${
        config.AppConfig.classlinkConfig.callback_url
      }&client_id=${
        activeSSO.client_id
      }&response_type=code&state=${verifiedServerUrl
        .replace(/^https?:\/\//, '')
        .slice(0, -1)}`;
    } else if (activeSSO?.name.toLowerCase() === 'google') {
      url = `${config.AppConfig.googleConfig.login_url}?scope=${
        config.AppConfig.googleConfig.scope
      }&redirect_uri=${config.AppConfig.googleConfig.callback_url}&client_id=${
        activeSSO.client_id
      }&response_type=code&state=${verifiedServerUrl
        .replace(/^https?:\/\//, '')
        .slice(0, -1)}`;
    } else if (activeSSO?.name.toLowerCase() === 'microsoft') {
      url = `${config.AppConfig.microsoftConfig.login_url}?scope=${
        config.AppConfig.microsoftConfig.scope
      }&redirect_uri=${
        config.AppConfig.microsoftConfig.callback_url
      }&client_id=${
        activeSSO.client_id
      }&response_type=code&state=${verifiedServerUrl
        .replace(/^https?:\/\//, '')
        .slice(0, -1)}`;
    } else if (activeSSO?.name.toLowerCase() === 'rapididentity') {
      url = `https://${activeSSO.hostname}${
        config.AppConfig.rapidIdentity.login_url
      }?scope=${config.AppConfig.rapidIdentity.scope}&redirect_uri=${
        config.AppConfig.rapidIdentity.callback_url
      }&client_id=${
        activeSSO.client_id
      }&response_type=code&state=${verifiedServerUrl
        .replace(/^https?:\/\//, '')
        .slice(0, -1)}`;
    } else if (activeSSO?.name.toLowerCase() === 'clever') {
      url = `${config.AppConfig.clever.login_url}?redirect_uri=${
        config.AppConfig.clever.callback_url
      }&client_id=${
        activeSSO.client_id
      }&response_type=code&state=${verifiedServerUrl
        .replace(/^https?:\/\//, '')
        .slice(0, -1)}`;
    }
    return url;
  };
  return (
    <>
      <View testID="ssoLoginScreenComponent" style={styles.mapViewContainer}>
        <View style={styles.mapViewHeader}>
          <TouchableOpacity testID="closeButton" onPress={onClose}>
            <CloseIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(25) : Mixins.scaleSize(35)}
              width={tablet ? Mixins.scaleSize(25) : Mixins.scaleSize(35)}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.mapViewSubConatiner}>
          {
            <CustomWebView
              redirectionUrl={getRedirectionUrl()}
              loadingState={true}
              scalesPageToFit={true}
              onLoadEnd={() => {}}
              onError={onError}
              onNavigationStateChange={onNavigationStateChange}
              contentStyle={styles.contentStyle}
              containerStyle={styles.containerStyle}
              userAgent="Mozilla/5.0 (Linux; Android 12; Pixel a5 Build/SP1A.210812.016) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/114.0.5735.130 Mobile Safari/537.36"
              changeLoaderStyle={{
                marginBottom: tablet
                  ? Mixins.scaleSize(146)
                  : Mixins.scaleSize(200),
              }}
            />
          }
        </View>
      </View>
    </>
  );
};
export default SSOLoginScreen;
