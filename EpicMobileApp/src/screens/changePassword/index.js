import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Keyboard} from 'react-native';
/**
 * custom imports
 */
import styles from './styles';
import utils from '../../utils/index';
import {useDispatch, useSelector} from 'react-redux';
import {Colors, Mixins} from '../../config/styles';
import CustomButton from '../../components/common/customButton';
import {translate} from '../../translations/translationHelper';
import {
  changePassword,
  fetchCSRFToken,
} from '../../services/authorization/action';
import CustomTextInput from '../../components/common/customTextInput';
import CustomHeaderView from '../../components/common/customHeaderView';
import {CheckDisabledIcon, CheckIcon} from '../../config/imageConstants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Instance from '../../config/rnfetchInstance.js'

const {
  checkNumberAndSpecialCharacter,
  checkNumberAndUpperCase,
  checkUpperCaseAndSpecialChar,
  isIpad,
  tablet,
} = utils;
const ChangePassword = props => {
  const {navigation} = props;
  const dispatch = useDispatch();

  const newPasswordRef = React.createRef();
  const confirmPasswordRef = React.createRef();
  const {isFoldableDevice} = useSelector(state => state.app);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [lengthSatisfied, setLengthSatisfied] = useState(false);
  const [policySatisfied, setPolicySatisfied] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [csrfToken, setCSRFToken] = useState('');

  useEffect(() => {
    dispatch(
      fetchCSRFToken(apiResponse => {
        if (apiResponse.statusCode === 200) {
          setCSRFToken(apiResponse.data['CSRF-Token']);
        }
      }),
    );
  }, []);

  const handlePasswordValidation = value => {
    if (value.length >= 8) {
      setLengthSatisfied(true);
    } else if (value.length < 8) {
      setLengthSatisfied(false);
    }
    setPolicySatisfied(
      checkNumberAndSpecialCharacter(value) ||
        checkUpperCaseAndSpecialChar(value) ||
        checkNumberAndUpperCase(value),
    );
  };

  const onChangeText = (fieldName, value) => {
    setError('');
    let tempValue = utils.removeSpace(value);
    switch (fieldName) {
      case 'newPassword':
        setNewPassword(tempValue);
        handlePasswordValidation(tempValue);
        break;
      case 'confirmPassword':
        setConfirmPassword(tempValue);
        break;
      default:
        break;
    }
    if (newPassword.trim() === confirmPassword.trim()) {
      setDisabled(false);
    }
  };

  const handleChangePassword = () => {
    if (newPassword.trim() === confirmPassword.trim()) {
      Keyboard.dismiss();
      let payload = {
        new_password: confirmPassword,
        forcePwChange: 0,
      };
      let headerWithCSRFToken = Instance.header
      headerWithCSRFToken['CSRF-Token']= csrfToken
      dispatch(
        changePassword(payload, res => {
          if (res.statusCode === 200) {
            utils.showToast(
              translate('passwordChangeSuccess'),
              translate('youWillBeLoggingOff'),
            );
            setTimeout(() => {
              navigation.replace('Login');
            }, 1000);
          } else if (res.statusCode === 406) {
            let result
            if(utils.IsJsonString(res.message)){
              result = JSON.parse(res.message)
            }else{
              result = res.message
            }
            utils.showToast(result.message);
            return;
          }
        }),
      );
    } else if (confirmPassword.length === 0) {
      setError('Please enter confirm password');
    } else {
      setError(`Password doesn't match`);
    }
  };

  const renderPasswordPolicy = () => {
    return (
      <View style={{marginTop: 16}}>
        <Text style={styles.passwordPolicyHeader}>
          {translate('passwordPolicy:')}
        </Text>
        <View style={styles.flexHorizontalStyle}>
          {!lengthSatisfied ? (
            <CheckDisabledIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(14) : Mixins.scaleSize(14)}
              width={tablet ? Mixins.scaleSize(14) : Mixins.scaleSize(14)}
            />
          ) : (
            <CheckIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
              width={tablet ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
            />
          )}
          <Text
            style={[
              styles.passwordPolicyDesc,
              {
                color: !lengthSatisfied
                  ? Colors.COLOR_484949
                  : Colors.COLOR_5D9D52,
              },
            ]}>
            {translate('passwordPolicyFirst')}
          </Text>
        </View>
        <View style={styles.flexHorizontalStyle}>
          {!policySatisfied ? (
            <CheckDisabledIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(14) : Mixins.scaleSize(14)}
              width={tablet ? Mixins.scaleSize(14) : Mixins.scaleSize(14)}
            />
          ) : (
            <CheckIcon
              style={styles.iconStyle}
              height={tablet ? Mixins.scaleSize(16) : Mixins.scaleSize(16)}
              width={tablet ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
            />
          )}
          <Text
            style={[
              styles.passwordPolicyDesc,
              {
                color: !policySatisfied
                  ? Colors.COLOR_484949
                  : Colors.COLOR_5D9D52,
              },
            ]}>
            {translate('passwordPolicySecond')}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container} testID={'changePasswordScreen'}>
      <CustomHeaderView
        hideImage={true}
        title={translate('changePassword')}
        subTitle={translate('changePasswordSubText')}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.subContainer}>
        <CustomTextInput
          inputRef={newPasswordRef}
          keyboardType="default"
          label={translate('enterNewPassword')}
          value={newPassword}
          fieldName={'newPassword'}
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          onChangeText={onChangeText}
          style={styles.inputStyle(isFoldableDevice)}
          errorMessage={error}
          returnKeyType={'next'}
          secureTextEntry
          showPasswordButton={true}
          hideErrorMessage={true}
        />
        <CustomTextInput
          inputRef={confirmPasswordRef}
          keyboardType="default"
          label={translate('confirmNewPassword')}
          value={confirmPassword}
          fieldName={'confirmPassword'}
          onSubmitEditing={handleChangePassword}
          onChangeText={onChangeText}
          style={styles.inputStyle}
          errorMessage={error}
          returnKeyType={'done'}
          secureTextEntry
          showPasswordButton={true}
        />
        {renderPasswordPolicy()}
        <CustomButton
          containerStyle={styles.buttonStyle}
          onPress={handleChangePassword}
          disabledStyle={{backgroundColor: Colors.COLOR_003D7D50}}
          disabledFlag={
            !lengthSatisfied || !policySatisfied || confirmPassword.length < 8
          }
          buttonText={translate('changePassword')}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ChangePassword;
