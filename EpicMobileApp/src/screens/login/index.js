import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  Keyboard,
  ScrollView,
  Modal,
  TouchableOpacity,
  Linking,
} from 'react-native';

/**
 * custom imports
 */
import styles from './styles';
import utils from '../../utils';
import {Colors, Mixins} from '../../config/styles';
import {useDispatch, useSelector} from 'react-redux';
import LinkButton from '../../components/common/linkButton';
import CustomButton from '../../components/common/customButton';
import {translate} from '../../translations/translationHelper';
import CustomTextInput from '../../components/common/customTextInput';
import CustomHeaderView from '../../components/common/customHeaderView';
import {
  login,
  validateServerUrl,
  getUserPermissions,
  saveSignedInUserInfo,
  updateAuthUserDeatils,
  loginWithSSO,
  getSSOToken,
} from '../../services/authorization/action';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomRadioButtons from '../../components/common/customRadioButtons';
import {updateAppModalFields} from '../../services/app/action';
import {
  updateLoadingStatus,
  globalStateUpdate,
} from '../../services/globalState/action';
import {getActiveAlerts} from '../../services/alert/action';
import {
  ClasslinkIcon,
  CleverIcon,
  GoogleLoginIcon,
  MicrosoftLoginIcon,
  RapidIdentityIcon,
  SeparatorIcon,
} from '../../config/imageConstants';
import SSOLoginScreen from './SSOLoginScreen';
import config from '../../config';

const {privacyLink, termsCondition, tablet} = utils;

const Login = props => {
  const dispatch = useDispatch();
  const {
    serverUrl,
    userName,
    password,
    verifiedServerUrl,
    showDomainPicker,
    isVerified,
  } = useSelector(state => state.auth);

  const [showWebView, setShowWebView] = useState(false);
  const {isFoldableDevice} = useSelector(state => state.app);
  const {activeSSO, epicApiVersion} = useSelector(state => state.globalReducer);
  const serverUrlRef = React.createRef();
  const userNameRef = React.createRef();
  const passwordRef = React.createRef();

  const [serverUrlError, setServerUrlError] = useState('');
  const [credentialsError, setCredentialsError] = useState('');
  const [urlVerified, setUrlVerified] = useState(false);
  const [domainLogin, setDomainLogin] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(1);
  const [hyperlink, setHyperlink] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [invalidCertificate, setInvalidCertificate] = useState(false);
  const [certificatePopupFlag, setCertificatePopupFlag] = useState(false);
  const [ssoModalVisible, setSSOModalVisible] = useState(false);

  useEffect(() => {
    dispatch(updateLoadingStatus(false));
    return () => {
      if (!isVerified) {
        dispatch(updateAuthUserDeatils('serverUrl', ''));
      }
    };
  }, [isVerified]);

  useEffect(() => {
    if (verifiedServerUrl || isVerified || urlVerified) {
      // if (
      //   epicApiVersion &&
      //   utils.splitJoin(epicApiVersion) >=
      //     utils.splitJoin(config.AppConfig.apiVersion)
      // ) {
      dispatch(getSSOToken());
      // }
    }
  }, [verifiedServerUrl, isVerified, urlVerified]);

  useEffect(() => {
    if (verifiedServerUrl && isVerified) {
      setUrlVerified(true);
      dispatch(
        updateAuthUserDeatils('serverUrl', verifiedServerUrl.slice(0, -1)),
      );
    } else {
      setUrlVerified(false);
      dispatch(updateAuthUserDeatils('serverUrl', ''));
    }
    if (showDomainPicker) {
      setDomainLogin(true);
      setSelectedUserType(0);
    }
  }, [verifiedServerUrl, isVerified, showDomainPicker]);

  /**
   * function to handle the onChangeText callback in textinput
   * @param {string} fieldName name of textinput field
   * @param {string} value value of textinput filed
   */
  const onChangeText = (fieldName, value) => {
    switch (fieldName) {
      case 'serverUrl':
        dispatch(globalStateUpdate('activeSSO', {}));
        setServerUrlError('');
        setUrlVerified(false);
        dispatch(updateAuthUserDeatils('serverUrl', utils.removeSpace(value)));
        break;
      case 'userName':
        dispatch(updateAuthUserDeatils('userName', value));
        setCredentialsError('');
        break;
      case 'password':
        dispatch(updateAuthUserDeatils('password', value));
        setCredentialsError('');
        break;
      default:
        break;
    }
  };

  /**
   * function to handle the texxtinput focus
   */
  const onFocus = () => {
    if (serverUrl?.length === 0) {
      dispatch(updateAuthUserDeatils('serverUrl', 'https://'));
    }
  };

  /**
   * function to handle the texxtinput blur
   */
  const onBlur = () => {
    if (serverUrl?.length === 0) {
      dispatch(updateAuthUserDeatils('serverUrl', ''));
    } else if (serverUrl === 'https://') {
      dispatch(updateAuthUserDeatils('serverUrl', ''));
      setServerUrlError('');
    }
  };

  /**
   * function to perform the login action
   */
  const handleLoginAction = () => {
    setCredentialsError('');
    let payload = {
      uid: userName,
      passwd: password,
    };
    if (selectedUserType === 0) {
      payload.userType = 'domain';
    }
    Keyboard.dismiss();
    dispatch(
      login(payload, res => {
        if (res.statusCode === 200) {
          res.data.passwordChange
            ? props.navigation.replace('ChangePassword')
            : getUserPermissionApiHandler();
        } else {
          if (res.message.includes('Already logged in')) {
            setCredentialsError(res.message);
          } else if (res.statusCode === 504) {
            setServerUrlError('Incorrect server URL');
          } else {
            setCredentialsError(translate('credentialsError'));
          }
        }
      }),
    );
  };

  /**
   * function to fetch the user permissions from epic
   */
  const getUserPermissionApiHandler = () => {
    dispatch(
      getUserPermissions(true, async res => {
        let filteredData;
        if (res) {
          filteredData =
            res?.length > 0 &&
            res.map(item => {
              return {
                module: item.module_name,
                Permission: item.permission,
              };
            });
        }
        let alertsPermission =
          filteredData?.length > 0
            ? utils.getTabPermission(filteredData, translate('alertsModule'))
            : null;
        if (alertsPermission) {
          dispatch(
            getActiveAlerts(true, apiResponse => {
              if (apiResponse?.length > 0 && alertsPermission) {
                dispatch(updateAppModalFields('initialRouteName', 'Alerts'));
                props.navigation.replace('AppNavigator');
              } else {
                if (props.navigation.getState().routes[0].name === 'Login') {
                  props.navigation.replace('AppNavigator');
                }
              }
              dispatch(saveSignedInUserInfo(async res => {}));
            }),
          );
        } else {
          props.navigation.replace('AppNavigator');
        }
      }),
    );
  };

  /**
   * function to handle the verify url action
   */
  const handleVerifyUrl = () => {
    if (serverUrl?.length === 0) {
      setServerUrlError('Please enter server URL');
      return;
    } else if (serverUrl === 'https://') {
      dispatch(updateAuthUserDeatils('serverUrl', ''));
      setServerUrlError('');
      Keyboard.dismiss();
    } else if (urlVerified) {
      return;
    } else {
      Keyboard.dismiss();
      setCredentialsError('');
      setServerUrlError('');
      setHyperlink(false);
      let unverifiedUrl = serverUrl;
      dispatch(
        validateServerUrl(true, unverifiedUrl, res => {
          if (res.statusCode == 200) {
            let forceUpdateRequest = utils.checkApiVersion(res.data.apiVersion);
            dispatch(
              updateAppModalFields('epicApiVersion', res.data.apiVersion),
            );
            if (!forceUpdateRequest.forceUpdateFlag) {
              setServerUrlError(forceUpdateRequest.errorMessage);
              forceUpdateRequest.updateRequired === 'mobile' &&
                setHyperlink(true);
              setAlignment('left');
              return;
            }
            if (res.data.ldapEnable == 'true') {
              setDomainLogin(true);
              dispatch(updateAuthUserDeatils('showDomainPicker', true));
              setSelectedUserType(0);
            } else {
              setDomainLogin(false);
              dispatch(updateAuthUserDeatils('showDomainPicker', false));
              setSelectedUserType(1);
            }
            !!res.data &&
              setCertificatePopupFlag(!res.data.isValidCertificates);
            dispatch(
              updateAppModalFields(
                'certificatesValid',
                res.data.isValidCertificates,
              ),
            );
            setUrlVerified(res.success);
            setCredentialsError('');
          } else {
            if (res.message === 'The request timed out.') {
              setServerUrlError('Incorrect server URL');
              return;
            } else {
              setServerUrlError('Incorrect server URL');
              return;
            }
          }
        }),
      );
    }
  };

  /**
   * function to handle the radio button toggle
   * @param {number} index index of the radio button
   */
  const handleRadioButtonAction = index => {
    setSelectedUserType(index);
    setCredentialsError('');
  };

  /**
   * function to render the footer element
   * @returns Footer element on login screen
   */
  const renderFooter = () => {
    return (
      <View style={styles.textContainer(isFoldableDevice)}>
        <Text style={styles.byLoginText}>{translate('byLoginText')}</Text>
        <LinkButton
          onPress={() => {
            Linking.openURL(privacyLink);
          }}
          buttonText={translate('privacyPolicy')}
          textStyle={styles.privacyText}
        />
        <Text style={styles.byLoginText}>{translate('and')}</Text>
        <LinkButton
          onPress={() => {
            Linking.openURL(termsCondition);
          }}
          buttonText={translate('termsCondition')}
          textStyle={styles.privacyText}
        />
      </View>
    );
  };

  /**
   * function to render the invalid url component
   * @returns Invalid Url component
   */
  const invalidServerUI = () => {
    return (
      <View style={styles.invalidServerContainer}>
        <View style={styles.invalidServerTextContainer}>
          <Text style={styles.serverTextStyle}>
            {translate('invalidServerUrlText')}
          </Text>
          <TouchableOpacity
            style={styles.continueButtonContainer}
            onPress={() => {
              setInvalidCertificate(true);
            }}>
            <Text style={styles.continueButttonStyle}>{translate('ok')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * function to render the invalid Url modal content
   * @returns Invalid Url error modal content
   */
  const ssoErrorUI = () => {
    return (
      <View style={styles.invalidServerContainer}>
        <View style={styles.invalidServerTextContainer}>
          <Text style={styles.serverTextStyle}>
            {translate('ssoLoginErrorMessage')}
          </Text>
          <TouchableOpacity
            style={styles.continueButtonContainer}
            onPress={() => {
              setSSOModalVisible(false);
            }}>
            <Text style={styles.continueButttonStyle}>{translate('ok')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * function to handle the navigation state change in webview, to hide webview modal on SSO login successful
   * @param {object} state object containing the state of the webview
   */
  const onNavigationStateChange = state => {
    let urlToLogin = '';
    const codeMatch = state.url.match(/code=([^&]*)/);
    if (codeMatch && codeMatch[1]) {
      const codeValue = decodeURIComponent(codeMatch[1]);
      urlToLogin = `${verifiedServerUrl}login?code=${codeValue}`;
      setShowWebView(false);
      setCredentialsError('');
      Keyboard.dismiss();
      dispatch(
        loginWithSSO(urlToLogin, res => {
          if (res.statusCode === 200) {
            setTimeout(() => {
              res.data.passwordChange
                ? props.navigation.replace('ChangePassword')
                : getUserPermissionApiHandler();
            }, 200);
          } else {
            if (res.message.includes('Already logged in')) {
              setCredentialsError(res.message);
            } else if (res.statusCode === 504) {
              setServerUrlError('Incorrect server URL');
            } else if (res.statusCode === 500) {
              setSSOModalVisible(true);
            } else {
              setCredentialsError(translate('credentialsError'));
            }
          }
        }),
      );
    }
  };

  return (
    <ScrollView
      testID="loginScreen"
      style={styles.container}
      contentContainerStyle={{alignItems: 'center', flexGrow: 1}}
      keyboardShouldPersistTaps={'handled'}
      bounces={false}>
      <CustomHeaderView
        title={translate('logIntoAccount')}
        subTitle={translate('enterCredentials')}
        isFoldableDevice={isFoldableDevice}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.subContainer,
          {height: isFoldableDevice ? '120%' : '100%'},
        ]}
        style={{flexGrow: 1}}
        bounces={false}>
        <CustomTextInput
          inputRef={serverUrlRef}
          keyboardType="default"
          label={translate('enterServerUrl')}
          testID={'serverUrlInput'}
          value={serverUrl}
          fieldName={'serverUrl'}
          onInputFocus={onFocus}
          onInputBlur={onBlur}
          auxButtonTestID={'verifyUrlButton'}
          autoCapitalize={'none'}
          onSubmitEditing={handleVerifyUrl}
          onChangeText={onChangeText}
          style={{
            marginTop:
              tablet || isFoldableDevice
                ? Mixins.scaleSize(18)
                : Mixins.scaleSize(28),
          }}
          errorMessage={serverUrlError}
          auxiliaryButtonAction={handleVerifyUrl}
          auxiliaryButton={translate('verify')}
          returnKeyType={'done'}
          auxiliaryDisabled={serverUrl?.length === 0 || urlVerified}
          hyperlink={hyperlink}
          alignment={alignment}
          auxiliaryButtonStyle={{
            color:
              serverUrl?.length === 0 || urlVerified || serverUrl === 'https://'
                ? Colors.COLOR_808284
                : serverUrlError
                ? Colors.COLOR_003D7D
                : Colors.COLOR_003D7D,
          }}
        />
        {urlVerified && (
          <>
            {domainLogin && (
              <CustomRadioButtons
                selectedIndex={selectedUserType}
                onValueChanged={handleRadioButtonAction}
                buttons={[translate('domainUser'), translate('localUser')]}
              />
            )}
            <CustomTextInput
              inputRef={userNameRef}
              keyboardType="default"
              testID={'usernameInput'}
              label={translate('enterUsername')}
              fieldName={'userName'}
              autoCapitalize={'none'}
              value={userName}
              onSubmitEditing={() => passwordRef.current.focus()}
              onChangeText={onChangeText}
              style={{
                marginTop:
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(13)
                    : Mixins.scaleSize(28),
              }}
              errorMessage={credentialsError}
              hideErrorMessage={true}
              returnKeyType={'next'}
            />
            <CustomTextInput
              inputRef={passwordRef}
              keyboardType="default"
              testID={'passwordInput'}
              onSubmitEditing={handleLoginAction}
              fieldName={'password'}
              label={translate('enterPassword')}
              value={password}
              autoCapitalize={'none'}
              secureTextEntry
              showPasswordButton={true}
              onChangeText={onChangeText}
              style={{
                marginTop:
                  tablet || isFoldableDevice
                    ? Mixins.scaleSize(12)
                    : Mixins.scaleSize(28),
              }}
              returnKeyType={'done'}
              errorMessage={credentialsError}
            />
            <CustomButton
              onPress={handleLoginAction}
              buttonText={translate('login')}
              containerStyle={styles.buttonStyle(
                isFoldableDevice,
                Object.keys(activeSSO).length > 0,
              )}
              disabledFlag={
                userName?.length === 0 || password?.length === 0 || !urlVerified
              }
              disabledStyle={{backgroundColor: Colors.COLOR_003D7D50}}
            />
            {Object.keys(activeSSO).length > 0 && (
              <>
                <SeparatorIcon
                  width={Mixins.scaleSize(343)}
                  height={Mixins.scaleSize(16)}
                  style={styles.separator(
                    isFoldableDevice,
                    Object.keys(activeSSO).length > 0,
                  )}
                />
                <TouchableOpacity
                  style={styles.classlinkButton(isFoldableDevice)}
                  onPress={() => setShowWebView(true)}>
                  {activeSSO?.name.toLowerCase() === 'classlink' && (
                    <ClasslinkIcon
                      width={Mixins.scaleSize(257)}
                      height={Mixins.scaleSize(46)}
                    />
                  )}
                  {activeSSO?.name.toLowerCase() === 'google' && (
                    <GoogleLoginIcon
                      width={Mixins.scaleSize(257)}
                      height={Mixins.scaleSize(46)}
                    />
                  )}
                  {activeSSO?.name.toLowerCase() === 'microsoft' && (
                    <MicrosoftLoginIcon
                      width={Mixins.scaleSize(257)}
                      height={Mixins.scaleSize(46)}
                    />
                  )}
                  {activeSSO?.name.toLowerCase() === 'rapididentity' && (
                    <RapidIdentityIcon
                      width={Mixins.scaleSize(257)}
                      height={Mixins.scaleSize(46)}
                    />
                  )}
                  {activeSSO?.name.toLowerCase() === 'clever' && (
                    <CleverIcon
                      width={Mixins.scaleSize(257)}
                      height={Mixins.scaleSize(46)}
                    />
                  )}
                </TouchableOpacity>
              </>
            )}
          </>
        )}
        <Modal
          visible={certificatePopupFlag && !invalidCertificate}
          transparent={true}>
          {invalidServerUI()}
        </Modal>
        <Modal visible={ssoModalVisible} transparent={true}>
          {ssoErrorUI()}
        </Modal>
        <Modal visible={showWebView} animationType={'slide'}>
          <SSOLoginScreen
            onPress={() => {
              setShowWebView(false);
            }}
            onNavigationStateChange={onNavigationStateChange}
          />
        </Modal>
        {renderFooter()}
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

export default Login;
