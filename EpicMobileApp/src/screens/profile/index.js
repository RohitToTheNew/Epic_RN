import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect} from 'react';

import styles from './styles';
import {BackArrow, User} from '../../config/imageConstants';
import {useDispatch, useSelector} from 'react-redux';
import {translate} from '../../translations/translationHelper';
import {saveSignedInUserInfo} from '../../services/authorization/action';
import {Mixins} from '../../config/styles';
import NotificationPopupModal from '../../components/common/customNotificationModal';

const Profile = props => {
  let {navigation} = props;
  const {user, verifiedServerUrl} = useSelector(state => state.auth);
  const top = useSelector(state => state.app.safeAreaInset.top);
  const icon = user && !!user.image ? user.image : null;
  let imageUrl = verifiedServerUrl + `/uploads/userImg/${icon}`;
  const toggleNotification = useSelector(
    state => state.notification.toggleNotification,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(saveSignedInUserInfo(async res => {}));
  }, []);

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer(top)}>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.goBack()}>
          <BackArrow
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
          <Text style={styles.headerTitleStyle}>{translate('profile')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderImage = () => {
    let image;
    if (user.image) {
      image = (
        <Image style={styles.profileImageStyle} source={{uri: imageUrl}} />
      );
    } else {
      image = (
        <User height={Mixins.scaleSize(137)} width={Mixins.scaleSize(137)} />
      );
    }
    return image;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.imageContainer}>{renderImage()}</View>
      <Text style={styles.personalInfoHeader}>{translate('personalInfo')}</Text>
      <View
        style={[
          styles.profileDetailsItemContainer,
          {marginBottom: Mixins.scaleSize(4)},
        ]}>
        <Text style={styles.profileDetailsHeader}>{translate('fullName')}</Text>
        <Text style={styles.profileDetailsValue}>{user.fullname || '-'}</Text>
      </View>
      <View style={styles.profileDetailsItemContainer}>
        <Text style={styles.profileDetailsHeader}>{translate('email')}</Text>
        <Text style={styles.profileDetailsValue}>{user.email || '-'}</Text>
      </View>
      {toggleNotification && <NotificationPopupModal navigation={navigation} />}
    </View>
  );
};

export default Profile;
