import React, {useRef} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {WebView} from 'react-native-webview';
import {Colors} from '../../../config/styles';
import styles from './styles';
const CustomWebView = ({
  redirectionUrl,
  containerStyle,
  loadingState,
  changeLoaderStyle,
  scalesPageToFit,
  contentMode, 
  onLoadEnd,
  onLoadStart,
  onError,
  onNavigationStateChange,
  contentStyle,
  userAgent
}) => {
  const webviewRef = useRef(null);


  const displayActivityIndicator = () => {
    return (
      <ActivityIndicator
        size={'large'}
        color={Colors.COLOR_003D7D}
        style={[styles.activityIndicator, changeLoaderStyle]}
      />
    );
  };


  return (
    <View style={[styles.contentViewStyle,contentStyle]}>
      <View style={[styles.containerDefaultStyle, containerStyle]}>
        <WebView
          startInLoadingState={loadingState || true}
          renderLoading={() => displayActivityIndicator()}
          source={{uri: redirectionUrl}}
          ref={webviewRef}
          bounces={false}
          contentMode = { contentMode ||'mobile'}
          scalesPageToFit={scalesPageToFit}
          onLoadEnd={onLoadEnd}
          userAgent={userAgent || ''}
          onLoadStart={onLoadStart}
          onHttpError={onError}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>
      </View>
  );
};

export default CustomWebView;
