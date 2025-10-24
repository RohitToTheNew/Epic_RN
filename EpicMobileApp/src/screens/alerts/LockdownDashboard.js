import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';

import styles from './styles';
import {
  MapIcon,
  AllClear,
  DropDownIcon,
  DropDownUpIcon,
} from '../../config/imageConstants';
import {Mixins, Colors} from '../../config/styles';
import {translate} from '../../translations/translationHelper';
import {useDispatch, useSelector} from 'react-redux';
import {
  allClearAction,
  getActiveAlerts,
  getLockdownDashboardSummary,
  getMapsList,
  updateAlertData,
} from '../../services/alert/action';
import ModalView from '../../components/common/modalView';
import {updateAppModalFields} from '../../services/app/action';
import {updateLoadingStatus} from '../../services/globalState/action';
import CustomLoader from '../../components/common/customLoader';

export default function LockdownDashboard(props) {
  const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();
  const {showLockdownDashboard, lockdownDashboardData} = useSelector(
    state => state.alert,
  );
  const [showDialogue, setShowDialogue] = useState(false);

  /**
   * function to fetch maps list from epic
   */
  const onViewMapAction = () => {
    dispatch(getMapsList(true));
  };

  /**
   * function to execute on AllClear button press
   */
  const onAllClearPress = () => {
    setShowDialogue(true);
  };

  /**
   * function to expand/collapse the lockdown dashboard card
   */
  const onPress = () => {
    setExpanded(!expanded);
  };

  return (
    <View testID='lockdownDashboard' style={[styles.alertContainer, {marginTop: Mixins.scaleSize(10)}]}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <View
          activeOpacity={0.8}
          onPress={onPress}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.accordionHeaderText}>
            {lockdownDashboardData?.displayName || translate('lockdown')}
          </Text>
          {expanded ? (
            <DropDownUpIcon
              width={Mixins.scaleSize(14)}
              height={Mixins.scaleSize(14)}
            />
          ) : (
            <DropDownIcon
              width={Mixins.scaleSize(14)}
              height={Mixins.scaleSize(14)}
            />
          )}
        </View>
      </TouchableOpacity>
      {expanded && (
        <React.Fragment>
          <View style={styles.lineView} />
          <View style={styles.belowSeparatorContainer}>
            <View
              style={[
                styles.countContainerStyle,
                {backgroundColor: Colors.COLOR_EF9291},
              ]}>
              <Text style={styles.countText}>
                {lockdownDashboardData?.alerts || 0}
              </Text>
              <Text style={styles.countHeadingText}>{translate('alerts')}</Text>
            </View>
            <View
              style={[
                styles.countContainerStyle,
                {backgroundColor: Colors.COLOR_FB8C0099},
              ]}>
              <Text style={styles.countText}>
                {lockdownDashboardData?.pending || 0}
              </Text>
              <Text style={styles.countHeadingText}>
                {translate('pending')}
              </Text>
            </View>
            <View
              style={[
                styles.countContainerStyle,
                {backgroundColor: Colors.COLOR_9ABD83},
              ]}>
              <Text style={styles.countText}>
                {lockdownDashboardData?.secure || 0}
              </Text>
              <Text style={styles.countHeadingText}>{translate('secure')}</Text>
            </View>
          </View>
          <View style={styles.peopleSecuredContainer}>
            <Text style={styles.peopleSecuredText}>
              {translate('peopleSecured')}
            </Text>
            <Text style={styles.peopleSecuredText}>
              {lockdownDashboardData?.peopleSecured || 0}
            </Text>
          </View>
          <View style={styles.actionButtonContainer}>
            <TouchableOpacity testID='viewMapButton'
              onPress={onViewMapAction}
              style={styles.actionButtonViewMap}>
              <MapIcon
                width={Mixins.scaleSize(16)}
                height={Mixins.scaleSize(16)}
              />
              <Text
                style={[styles.actionButtonText, {color: Colors.COLOR_003D7D}]}>
                {translate('viewMap')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity testID='allClearButton'
              onPress={onAllClearPress}
              style={[
                styles.actionButton,
                {backgroundColor: Colors.COLOR_5D9D52},
              ]}>
              <AllClear
                width={Mixins.scaleSize(16)}
                height={Mixins.scaleSize(16)}
              />
              <Text
                style={[styles.actionButtonText, {color: Colors.COLOR_FFFFFF}]}>
                {translate('allClear')}
              </Text>
            </TouchableOpacity>
          </View>
        </React.Fragment>
      )}
      <Modal visible={showDialogue} transparent={true}>
        <ModalView 
          testID='allClearpopupModal'
          title={translate('areYouSure')}
          firstButtonText={translate('yes')}
          secondButtonText={translate('notNow')}
          testIDFirstButton = {'allClearPopupButton'}
          testIDSecondButton = {'hideAllClearPopupButton'}
          firstButtonAction={() => {
            dispatch(
              allClearAction(() => {
                dispatch(updateAlertData('showLockdownDashboard', false));
                dispatch(
                  getLockdownDashboardSummary(
                    lockdownDashboardData?.data[0]?.alert_id,
                  ),
                );
                dispatch(
                  getActiveAlerts(false, () => {
                    setShowDialogue(false);
                    dispatch(updateLoadingStatus(false));
                  }),
                );
              }),
            );
          }}
          secondButtonAction={() => {
            setShowDialogue(false);
          }}
        />
        <CustomLoader />
      </Modal>
    </View>
  );
}