import React from 'react';
import {View, Modal} from 'react-native';
import {translate} from '../../../translations/translationHelper';
import {useDispatch, useSelector} from 'react-redux';
import { toggleNotificationPopup } from '../../../services/notification/action';
import CustomPopupModal from '../customModal';
import { navigateToAlertScreen } from '../../../services/alert/action';

const NotificationPopupModal = props => {
  const dispatch = useDispatch();
  const isvisible = useSelector(state => state.notification.toggleNotification);
  const eventTitle = useSelector(state => state.notification.notificationEventTitle);

  return (
    <View>
      <Modal visible={isvisible} transparent={true}>
        <CustomPopupModal
          title={`${eventTitle} Notification`}
          subTitle={translate('goToNotificationScreen')}
          startButton={translate('yes')}
          cancelButton={translate('no')}
          cancelButtonAction={() => {
            dispatch(toggleNotificationPopup(false));
          }}
          startButtonAction={() => {
            dispatch(navigateToAlertScreen(false));
            props.navigation.navigate('Notifications');
            dispatch(toggleNotificationPopup(false));
          }}
        />
      </Modal>
    </View>
  );
};

export default NotificationPopupModal;
