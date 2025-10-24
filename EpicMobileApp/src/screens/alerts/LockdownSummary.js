import React, {useState} from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {Mixins, Colors} from '../../config/styles';
import styles from './styles';
const {WINDOW_HEIGHT} = Mixins;
import {useDispatch, useSelector} from 'react-redux';
import {updateAlertData} from '../../services/alert/action';
import {translate} from '../../translations/translationHelper';
import BottomSheetModal from '../../components/common/bottomSheetModal';
import {
  CloseIcon,
  DropDownIcon,
  DropDownUpIcon,
} from '../../config/imageConstants';
import CustomLoader from '../../components/common/customLoader';
import utils from '../../utils';
import moment from 'moment';

const LockdownSummary = props => {
  const [expanded, setExpanded] = useState(0);
  const {showSummary, summaryData} = useSelector(state => state.alert);
  const dispatch = useDispatch();

  /**
   * close summary modal on clicking close button
   */
  const onClose = () => {
    dispatch(updateAlertData('showSummary', false));
  };

  /**
   * function to render the summary header view
   * @returns header view for the summary modal with close icon
   */
  const renderHeader = () => {
    return (
      <View style={styles.summaryHeaderContainer}>
        <Text style={styles.summaryHeaderText}>
          {translate('lockdownSummary')}
        </Text>
        <TouchableOpacity testID="closeSummaryButton" onPress={onClose}>
          <CloseIcon
            width={Mixins.scaleSize(24)}
            height={Mixins.scaleSize(24)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * function to handle the expand/collapse of the overall summary
   */
  const dropdownPress = () => {
    setExpanded(expanded === 0 ? -1 : 0);
  };

  /**
   * function to handle the expand/collapse of the Alerts List on summary screen
   */
  const onExpandList = () => {
    summaryData?.alertData?.length > 0 && setExpanded(expanded === 1 ? 0 : 1);
  };

  /**
   * function to calculate the total time elapsed between two events
   * @param {string} endTime Date string for the end event time
   * @param {string} startTime Date string for the start event time
   * @returns total time in minutes
   */
  const calculateTotalTime = (endTime, startTime) => {
    return moment(endTime).diff(startTime, 'minutes');
  };

  const roomsSecured =
    (summaryData?.roomStatus?.find(item => item.status_id === 3)?.rooms_count ||
      0) +
    (summaryData?.roomStatus?.find(item => item.status_id === 4)?.rooms_count ||
      0);
  const roomsPending =
    summaryData?.roomStatus?.find(item => item.status_id === 1)?.rooms_count ||
    0;
  let totalPeopleSecured = 0;
  summaryData?.roomStatus?.forEach(item =>
    item?.people_secure && item.status_id === 3
      ? (totalPeopleSecured += item.people_secure)
      : totalPeopleSecured + 0,
  );

  /**
   * function to render the Overall Summary card
   * @returns overall summary view
   */
  const renderOverAllSummary = () => {
    return (
      <View
        style={[
          styles.overallSummaryContainer,
          {marginTop: Mixins.scaleSize(10)},
        ]}>
        <TouchableOpacity
          testID="overAllDropdownButton"
          activeOpacity={0.9}
          onPress={dropdownPress}>
          <View
            testID="overAllSummary"
            activeOpacity={0.8}
            onPress={dropdownPress}
            style={styles.overallTappable}>
            <Text style={[styles.accordionHeaderText, {flex: 1}]}>
              {translate('overall')}
            </Text>
            {expanded === 0 ? (
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
        {expanded === 0 && (
          <React.Fragment>
            <View style={styles.lineView} />
            <View
              style={[
                styles.belowSeparatorContainer,
                {justifyContent: 'flex-start'},
              ]}>
              <View
                style={[
                  styles.summaryCountContainer,
                  {backgroundColor: Colors.COLOR_9ABD83},
                ]}>
                <Text style={styles.summaryCountHeadingText}>
                  {translate('secure')}
                </Text>
                <Text style={styles.summaryCountText}>{roomsSecured}</Text>
              </View>
              <View
                style={[
                  styles.summaryCountContainer,
                  {backgroundColor: Colors.COLOR_FB8C0099},
                ]}>
                <Text style={styles.summaryCountHeadingText}>
                  {translate('pending')}
                </Text>
                <Text style={styles.summaryCountText}>{roomsPending}</Text>
              </View>
              <View
                style={[
                  styles.summaryCountContainer,
                  {backgroundColor: Colors.COLOR_DFE2E4, flex: 1, marginEnd: 0},
                ]}>
                <Text style={styles.summaryCountHeadingText}>
                  {translate('peopleSecured')}
                </Text>
                <Text style={styles.summaryCountText}>
                  {totalPeopleSecured}
                </Text>
              </View>
            </View>
            <View style={styles.summaryCardContainer}>
              <View style={styles.alertItemContainer}>
                <Text style={styles.summaryCountHeadingText}>
                  {translate('startTime')}
                </Text>
                <Text
                  style={[
                    styles.summaryCountText,
                    {minWidth: Mixins.scaleSize(154)},
                  ]}>
                  {moment(summaryData?.startTime, 'YYYY-MM-DD hh:mm:ss').format(
                    'DD/MM/YYYY, hh:mmA',
                  )}
                </Text>
              </View>
              <View style={styles.totalTimeContainer}>
                <Text style={styles.summaryCountHeadingText}>
                  {translate('totalTime')}
                </Text>
                <Text style={styles.summaryCountText}>
                  {calculateTotalTime(
                    summaryData?.endTime,
                    summaryData?.startTime,
                  )}{' '}
                  mins
                </Text>
              </View>
            </View>
            <View style={styles.lockdownEndContainer}>
              <Text style={styles.summaryCountHeadingText}>
                {translate('lockdownEndBy')}
              </Text>
              <Text style={styles.summaryCountText}>
                {summaryData?.endedBy}
              </Text>
            </View>
          </React.Fragment>
        )}
      </View>
    );
  };

  /**
   * function to render the Alert item
   * @param {object} rowData object containing the row data
   * @returns alert item view
   */
  const renderAlertItem = rowData => {
    const {item} = rowData;
    const startTime = moment(item.log_time, 'YYYY-MM-DD hh:mm:ss').format(
      'hh:mm A',
    );
    const endTime = item.comment
      ? moment(item.updated_on, 'YYYY-MM-DD hh:mm:ss').format('hh:mm A')
      : '-';
    const totalTime = item.comment
      ? `${calculateTotalTime(
          rowData.item.updated_on,
          rowData.item.log_time,
        )} mins`
      : '-';
    const e = item.event_params && JSON.parse(item.event_params);
    const roomId =
      e?.event?.senderInfo?.roomId || e?.event?.deviceInfo?.roomName || 'NA';
    const alertStatus = item.alertStatus;
    const endedBy = item.fullname ? item.fullname : item.username;
    return (
      <View style={styles.alertItem(alertStatus)} key={item.id}>
        <View style={styles.alertItemInnerContainer(alertStatus)}>
          <View>
            <Text style={styles.alertDetailHeading}>{translate('room')}</Text>
            <Text style={styles.alertHeadingText}>{roomId}</Text>
          </View>
          <Text
            style={[
              styles.alertHeadingText,
              {
                color:
                  alertStatus === 'Resolved'
                    ? Colors.COLOR_569131
                    : Colors.COLOR_E53935,
              },
            ]}>
            {alertStatus}
          </Text>
        </View>
        <View style={styles.alertItemDetails}>
          <View>
            <Text style={styles.alertDetailHeading}>
              {translate('startTime')}
            </Text>
            <Text style={styles.alertDetail}>{startTime}</Text>
          </View>
          <View>
            <Text style={styles.alertDetailHeading}>
              {translate('endTime')}
            </Text>
            <Text style={styles.alertDetail}>{endTime}</Text>
          </View>
          <View>
            <Text style={styles.alertDetailHeading}>
              {translate('totalTime')}
            </Text>
            <Text style={styles.alertDetail}>{totalTime || '-'}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.alertDetailHeading,
            {
              marginHorizontal: Mixins.scaleSize(12),
              marginTop: Mixins.scaleSize(20),
            },
          ]}>
          {translate('endedBy')}
        </Text>
        <Text
          style={[
            styles.alertDetail,
            {
              marginHorizontal: Mixins.scaleSize(12),
              marginBottom: Mixins.scaleSize(16),
            },
          ]}>
          {endedBy}
        </Text>
      </View>
    );
  };

  /**
   * function to render the Alerts List view on summary screen
   * @returns Alert list view
   */
  const renderAlertsList = () => {
    return (
      <View
        style={[
          styles.overallSummaryContainer,
          {marginTop: Mixins.scaleSize(10)},
        ]}>
        <TouchableOpacity
          testID="alertsDropdownButton"
          activeOpacity={0.9}
          onPress={onExpandList}>
          <View
            activeOpacity={0.8}
            onPress={onExpandList}
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text
                style={[
                  styles.accordionHeaderTextSummary,
                  {marginEnd: Mixins.scaleSize(16)},
                ]}>
                {translate('alerts')}
              </Text>
              <Text style={styles.alertsCount}>
                {summaryData?.alertData?.length}
              </Text>
            </View>
            {summaryData?.alertData?.length > 0 &&
              (expanded === 1 ? (
                <DropDownUpIcon
                  width={Mixins.scaleSize(14)}
                  height={Mixins.scaleSize(14)}
                />
              ) : (
                <DropDownIcon
                  width={Mixins.scaleSize(14)}
                  height={Mixins.scaleSize(14)}
                />
              ))}
          </View>
        </TouchableOpacity>
        {expanded === 1 && (
          <React.Fragment>
            <View style={styles.lineView} />
            <FlatList
              testID="alertsList"
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.alertListContainer}
              data={summaryData?.alertData}
              renderItem={renderAlertItem}
            />
          </React.Fragment>
        )}
      </View>
    );
  };

  return (
    <BottomSheetModal
      height={WINDOW_HEIGHT * 0.9}
      isVisible={showSummary}
      bounces={false}
      containerStyle={styles.summaryModalStyle}
      disable={true}
      maxHeight={utils.isAndroid ? WINDOW_HEIGHT * 0.85 : WINDOW_HEIGHT * 0.9}
      onHideCompletion={() => {}}
      value={1}
      {...props}>
      <View testID="lockdownSummary" style={styles.summaryInnerContainer}>
        {renderHeader()}
        {renderOverAllSummary()}
        {renderAlertsList()}
      </View>
      <CustomLoader />
    </BottomSheetModal>
  );
};

export default LockdownSummary;
