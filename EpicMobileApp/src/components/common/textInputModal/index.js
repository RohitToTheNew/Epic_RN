import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from './styles';
import {translate} from '../../../translations/translationHelper';
import CommonTextInput from '../../common/commonTextInput';
import utils from '../../../utils';
import CustomButton from '../customButton';
import {Colors, Mixins} from '../../../config/styles';
const {tablet} = utils;
const TextInputModal = ({title, subTitle, cancelAction, sendDataToParent}) => {
  const commentRef = useRef();
  const [comment, setcomment] = useState('');
  const onChangeText = (fieldName, value) => {
    setcomment(value || '');
  };

  const renderExitView = () => {
    return (
      <View style={styles.titleView}>
        <Text style={styles.textStyle}>{title}</Text>
        <CommonTextInput
          inputRef={commentRef}
          keyboardType="default"
          onSubmitEditing={() => sendDataToParent(comment)}
          label={subTitle}
          fieldName={'comment'}
          autoCapitalize={'none'}
          value={comment}
          onChangeText={onChangeText}
          style={{
            marginTop: tablet ? Mixins.scaleSize(16) : Mixins.scaleSize(16),
          }}
          returnKeyType={'done'}
        />
        <CustomButton
          onPress={() => sendDataToParent(comment)}
          buttonText={translate('submit')}
          containerStyle={styles.buttonStyle}
          textStyle={styles.textStyleButton}
          disabledStyle={{backgroundColor: Colors.COLOR_003D7D50}}
          disabledFlag={comment.length === 0}
        />
        <TouchableOpacity onPress={cancelAction}>
          <Text style={styles.subText}>{translate('cancel')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.centeredView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalView}>{renderExitView()}</View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default TextInputModal;
