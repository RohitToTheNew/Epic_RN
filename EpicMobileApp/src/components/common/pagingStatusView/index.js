import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';
import {translate} from '../../../translations/translationHelper';
import {Mixins} from '../../../config/styles';
import {CheckSendIcon, CheckNotSendIcon} from '../../../config/imageConstants';
import utils from '../../../utils';

const {tablet} = utils
const PagingStatusView = ({success, successAction, failureAction, hideModal, backdrop, cancelAction}) => {
  const renderSuccessView = () => {
    return (
      <View>
        <CheckSendIcon
          style={styles.iconStyle}
          height={tablet ? Mixins.scaleSize(35) : Mixins.scaleSize(35)}
          width={tablet ? Mixins.scaleSize(35) : Mixins.scaleSize(35)}
        />
        <Text style={styles.textStyle}>
          {translate('PageSentsuccessfully')}
        </Text>
        <TouchableOpacity
          onPress={successAction}
          style={styles.buttonContainer}>
          <Text style={styles.defaultButtonTextStyle}>{translate('home')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const renderFailView = () => {
    return (
      <View>
        <CheckNotSendIcon
          style={styles.iconStyle}
          height={tablet ? Mixins.scaleSize(35) : Mixins.scaleSize(35)}
          width={tablet ? Mixins.scaleSize(35) : Mixins.scaleSize(35)}
        />
        <Text style={styles.textStyle}>{translate('pagingApiFail')}</Text>
        <TouchableOpacity
          onPress={failureAction}
          style={styles.buttonContainer1}>
          <Text style={styles.defaultButtonTextStyle}>
            {translate('retry')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cancelAction} style = {styles.cancelButton} >
          <Text style = {styles.cancelText}>{translate('cancel')}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <TouchableOpacity disabled={backdrop ? false  : true} activeOpacity={1} onPress={hideModal} style={styles.centeredView}>
      <TouchableOpacity onPress={()=>{}} activeOpacity={1} style={styles.modalView}>
        <View style={styles.titleView}>
          {success ? renderSuccessView() : renderFailView()}
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default PagingStatusView;
