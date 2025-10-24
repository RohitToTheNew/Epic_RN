import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import styles from './styles';

import {
  CheckSendIcon,
  CheckNotSendIcon,
  SendIcon,
} from '../../../config/imageConstants';
import {translate} from '../../../translations/translationHelper';
import utils from '../../../utils';
import {Mixins} from '../../../config/styles';

const {tablet} = utils;
const CustomPopupModal = ({
  title,
  startButton,
  cancelButton,
  cancelButtonAction,
  subTitle,
  selectedAlert,
  hideCancelButton,
  sendingButton,
  sendingTitle,
  startButtonAction,
  notificationAlert,
}) => {
  const [pageSent, setPageSent] = useState(hideCancelButton || false);
  const sending = hideCancelButton;
  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <View style={styles.titleView}>
          {sending && !pageSent ? (
            success ? (
              <CheckSendIcon style={styles.iconStyle} />
            ) : (
              <CheckNotSendIcon style={styles.iconStyle} />
            )
          ) : null}

          {hideCancelButton ? (
            !pageSent ? (
              success ? (
                <Text style={styles.textStyle}>{pageSentSuccessfully}</Text>
              ) : (
                <Text style={styles.textStyle}>{retryText}</Text>
              )
            ) : (
              <Text style={styles.textStyle}>{sendingTitle}</Text>
            )
          ) : (
            <Text style={styles.textStyle}>{title}</Text>
          )}

          {!notificationAlert && selectedAlert && (
            <Text style={{fontWeight: 'bold'}}>{selectedAlert}</Text>
          )}
          {subTitle && <Text style={styles.textStyle}>{subTitle}</Text>}
          {notificationAlert && (
            <Text style={styles.launch}>
              {translate('launch')}{' '}
              <Text style={styles.notificationItem}>{selectedAlert}</Text>{' '}
              {translate('notification')}
            </Text>
          )}
        </View>
        <TouchableOpacity
          disabled={!pageSent ? false : true}
          onPress={startButtonAction}
          style={styles.startButtonContainer(hideCancelButton)}>
          {hideCancelButton ? (
            !pageSent ? (
              success ? (
                <Text style={styles.startText}>{homeButton}</Text>
              ) : (
                <Text style={styles.startText}>{RetryButton}</Text>
              )
            ) : (
              <View style={styles.sendIconView}>
                <SendIcon
                  style={styles.sendIconStyle}
                  height={tablet ? Mixins.scaleSize(17) : Mixins.scaleSize(17)}
                  width={tablet ? Mixins.scaleSize(20) : Mixins.scaleSize(20)}
                />
                <Text style={styles.startText}>{sendingButton}</Text>
              </View>
            )
          ) : (
            <Text style={styles.startText}>{startButton}</Text>
          )}
        </TouchableOpacity>
        {cancelButton && (
          <TouchableOpacity
            onPress={cancelButtonAction}
            style={styles.cancelButtonContainer}>
            <Text style={styles.cancelText}>{cancelButton}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomPopupModal;
