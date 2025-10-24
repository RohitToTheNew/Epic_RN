import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
const {tablet, isAndroid} = utils;
const {WINDOW_HEIGHT, WINDOW_WIDTH} = Mixins;
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_FFFFFF,
    flex: 1,
  },
  subView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_F2F5F9,
  },
  noSafeAlertContainer: showLockdownDashboard => ({
    marginTop: showLockdownDashboard
      ? tablet
        ? Mixins.scaleSize(60)
        : Mixins.scaleSize(170)
      : tablet
      ? Mixins.scaleSize(80)
      : Mixins.scaleSize(200),
    alignItems: 'center',
  }),
  noSafeAlertText: showLockdownDashboard => ({
    marginTop: showLockdownDashboard
      ? tablet
        ? Mixins.scaleSize(10)
        : Mixins.scaleSize(27)
      : tablet
      ? Mixins.scaleSize(10)
      : Mixins.scaleSize(27),
    fontSize: showLockdownDashboard
      ? tablet
        ? Mixins.scaleFont(14)
        : Mixins.scaleFont(22)
      : tablet
      ? Mixins.scaleFont(16)
      : Mixins.scaleFont(22),
    color: Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '400',
    lineHeight: tablet ? Mixins.scaleSize(18) : Mixins.scaleSize(24),
    textAlign: 'center',
  }),
  subText: showLockdownDashboard => ({
    marginTop: showLockdownDashboard
      ? tablet
        ? Mixins.scaleSize(6)
        : Mixins.scaleSize(16)
      : tablet
      ? Mixins.scaleSize(12)
      : Mixins.scaleSize(16),
    textAlign: 'center',
    fontSize: tablet ? Mixins.scaleFont(12) : Mixins.scaleFont(16),
    lineHeight: tablet ? Mixins.scaleSize(16) : Mixins.scaleSize(20),
    color: Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '400',
  }),
  eventSubView: {
    alignItems: 'center',
  },
  webViewStream: {
    height: tablet ? Mixins.scaleSizeHeight(250) : Mixins.scaleSizeHeight(213),
  },
  webViewMap: border => ({
    height: tablet
      ? Mixins.scaleSizeHeight(460)
      : isAndroid
      ? Mixins.scaleSizeHeight(330)
      : Mixins.scaleSizeHeight(320),
    width: Mixins.scaleSizeWidth(330),
    borderWidth: border ? 1 : null,
    marginTop: Mixins.scaleSize(16),
  }),
  disconnectView: {
    height: tablet ? Mixins.scaleSizeHeight(240) : Mixins.scaleSizeHeight(198),
    width: Mixins.scaleSizeWidth(319),
    backgroundColor: Colors.COLOR_E7E9EA,
    alignItems: 'center',
    marginTop: Mixins.scaleSize(16),
  },
  cameraStyle: {
    marginTop: Mixins.scaleSize(60),
  },
  cameraText: {
    marginTop: Mixins.scaleSize(19),
    fontSize: tablet ? Mixins.scaleFont(12) : Mixins.scaleFont(16),
    fontWeight: '400',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    lineHeight: tablet ? Mixins.scaleSize(16) : Mixins.scaleSize(20),
    color: Colors.COLOR_1A1C1C,
  },
  alertContainer: {
    paddingVertical: Mixins.scaleSize(12),
    paddingHorizontal: Mixins.scaleSize(16),
    backgroundColor: Colors.COLOR_FFFFFF,
    marginHorizontal: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(12),
    borderRadius: Mixins.scaleSize(8),
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  subContainer: {
    width: Mixins.scaleSize(24),
    height: Mixins.scaleSize(24),
    borderRadius: Mixins.scaleSize(12),
    borderWidth: 2,
    borderColor: Colors.COLOR_003D7D,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineView: {
    height: Mixins.scaleSize(1),
    width: Mixins.scaleSize(343),
    backgroundColor: Colors.COLOR_00000033,
    marginTop: Mixins.scaleSize(12),
    alignSelf: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: Mixins.scaleSize(10),
    marginHorizontal: Mixins.scaleSize(16),
  },
  safeAlertText: {
    fontSize: tablet ? Mixins.scaleFont(18) : Mixins.scaleFont(18),
    color: Colors.COLOR_003D7D,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginLeft: Mixins.scaleSize(11.22),
    marginRight: Mixins.scaleSize(6),
    flex: 1,
  },
  captionText: {
    fontSize: tablet ? Mixins.scaleFont(12) : Mixins.scaleFont(12),
    color: Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginTop: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(4),
  },
  captionSubText: {
    fontSize: tablet ? Mixins.scaleFont(14) : Mixins.scaleFont(14),
    color: Colors.COLOR_484949,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  subTextView: {
    marginHorizontal: Mixins.scaleSize(16),
  },
  buttonStyle: {
    marginTop: Mixins.scaleSize(24),
    height: Mixins.scaleSizeHeight(36),
    width: Mixins.scaleSizeWidth(277),
    marginBottom: Mixins.scaleSize(10),
  },
  textStyle: {
    fontSize: tablet ? Mixins.scaleFont(14) : Mixins.scaleFont(14),
    color: Colors.COLOR_FFFFFF,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRowView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  escalateButtonStyle: length => ({
    height: Mixins.scaleSizeHeight(36),
    width: length >1 ? Mixins.scaleSize(133) : Mixins.scaleSizeWidth(277),
    marginTop: Mixins.scaleSize(8),
  }),
  spaceView: {
    width: Mixins.scaleSize(11),
  },
  mapButtonContainer: {
    flexDirection: 'row',
    height: Mixins.scaleSizeHeight(36),
    width: Mixins.scaleSizeWidth(136),
    borderWidth: 1,
    borderColor: Colors.COLOR_003D7D,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Mixins.scaleSize(24),
    marginBottom: Mixins.scaleSize(24),
  },
  viewMapText: {
    fontSize: tablet ? Mixins.scaleFont(14) : Mixins.scaleFont(14),
    color: Colors.COLOR_003D7D,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginLeft: Mixins.scaleSize(12),
  },
  mapViewContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  mapViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tablet ? Mixins.scaleSize(31) : isAndroid ? Mixins.scaleSize(16) : Mixins.scaleSize(61),
    marginBottom: tablet ? Mixins.scaleSize(19) : Mixins.scaleSize(29),
    marginHorizontal: Mixins.scaleSize(16),
  },
  iconStyle: {
    marginEnd: Mixins.scaleSize(24),
  },
  mapViewText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    fontSize: Mixins.scaleSize(18),
    lineHeight: Mixins.scaleSize(22),
    color: Colors.COLOR_000000,
    flex: 1,
  },
  mapViewSubConatiner: {
    borderWidth: 1,
    borderColor: Colors.COLOR_B0B6BB,
    height: tablet ? Mixins.scaleSize(380) : Mixins.scaleSize(493),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  mapDisplayView: {
    height: tablet ? Mixins.scaleSize(325) : Mixins.scaleSize(400),
    width: WINDOW_WIDTH,
  },
  certificateError: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    fontSize: Mixins.scaleSize(14),
    lineHeight: Mixins.scaleSize(22),
    color: Colors.COLOR_FF0000,
    alignSelf: 'center',
    marginTop: Mixins.scaleSize(80),
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Mixins.scaleSize(20),
  },
  countText: {
    fontSize: Mixins.scaleFont(20),
    color: Colors.COLOR_000,
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  countHeadingText: {
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_000,
    fontWeight: '400',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  countContainerStyle: {
    width: Mixins.scaleSize(95),
    height: Mixins.scaleSize(65),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  belowSeparatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Mixins.scaleSize(10),
  },
  peopleSecuredContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Mixins.scaleSize(14),
    backgroundColor: Colors.COLOR_B0B6BB,
    borderRadius: 4,
    marginVertical: Mixins.scaleSize(10),
  },
  peopleSecuredText: {
    fontSize: Mixins.scaleFont(14),
    color: Colors.COLOR_000,
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Mixins.scaleSize(150),
    height: Mixins.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonViewMap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Mixins.scaleSize(150),
    height: Mixins.scaleSize(36),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_FFFFFF,
    borderWidth: 1,
    borderColor: Colors.COLOR_003D7D,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionButtonText: {
    marginStart: Mixins.scaleSize(16),
    fontSize: Mixins.scaleFont(14),
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  mapDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Mixins.scaleSize(16),
    borderWidth: 1,
    borderColor: Colors.COLOR_B0B6BB33,
    width: Mixins.scaleSize(343),
    height: Mixins.scaleSize(46),
    paddingVertical: Mixins.scaleSize(13),
    paddingHorizontal: Mixins.scaleSize(16),
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: Colors.COLOR_FFFFFF,
    marginBottom: Mixins.scaleSize(38),
  },
  mapHeading: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleSize(14),
    fontWeight: '700',
    color: Colors.COLOR_000,
    marginStart: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(12),
  },
  baseModalStyle: {
    backgroundColor: Colors.COLOR_FFFFFF,
    maxHeight: '60%',
    paddingBottom: Mixins.scaleSize(50),
  },

  listingButtonView: {
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: Mixins.scaleSize(8),
    backgroundColor: Colors.COLOR_FFFFFF,
    marginBottom: Mixins.scaleSize(12),
    justifyContent: 'center',
    marginHorizontal: Mixins.scaleSize(2),
    height: Mixins.scaleSizeHeight(46),
  },
  listingButtonViewPress: {
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderRadius: Mixins.scaleSize(8),
    backgroundColor: Colors.COLOR_5D9D521A,
    marginBottom: Mixins.scaleSize(12),
    justifyContent: 'center',
    marginHorizontal: Mixins.scaleSize(2),
    height: Mixins.scaleSizeHeight(46),
  },
  listingText: isFoldableDevice => ({
    fontSize:
      tablet || isFoldableDevice
        ? Mixins.scaleSizeHeight(19)
        : Mixins.scaleFont(16),
    fontFamily: Typography.FONT_FAMILY_BOLD,
    color: Colors.COLOR_484949,
    padding:
      tablet || isFoldableDevice ? Mixins.scaleSize(8) : Mixins.scaleSize(10),
  }),
  modalHeaderContainer: {
    marginTop: Mixins.scaleFont(15),
    marginBottom: Mixins.scaleFont(12),
  },
  selectMapText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleSize(18),
    fontWeight: '700',
    color: Colors.COLOR_000,
  },
  searchButtonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.COLOR_B0B6BB33,
    borderRadius: Mixins.scaleSize(10),
    marginVertical: Mixins.scaleSize(12),
  },
  inputPass: {
    flex: 0.9,
    padding: Mixins.scaleSize(12),
    fontSize: Mixins.scaleFont(16),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_1A1C1C,
  },
  closeIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionHeaderText: {
    fontSize: tablet ? Mixins.scaleFont(18) : Mixins.scaleFont(18),
    color: Colors.COLOR_003D7D,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    flex: 1,
  },
  summaryModalStyle: {
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  summaryHeaderText: {
    fontSize: tablet ? Mixins.scaleFont(12) : Mixins.scaleFont(18),
    color: Colors.COLOR_1A1C1C,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontWeight: '700',
  },
  overallSummaryContainer: {
    paddingVertical: Mixins.scaleSize(12),
    paddingHorizontal: Mixins.scaleSize(16),
    backgroundColor: Colors.COLOR_FFFFFF,
    marginBottom: Mixins.scaleSize(12),
    borderRadius: Mixins.scaleSize(8),
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  summaryCountHeadingText: {
    fontSize: Mixins.scaleFont(12),
    color: Colors.COLOR_000,
    fontWeight: '400',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  summaryCountText: {
    fontSize: Mixins.scaleFont(15),
    color: Colors.COLOR_000,
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginTop: Mixins.scaleSize(3),
  },
  summaryCountContainer: {
    width: Mixins.scaleSize(81),
    height: Mixins.scaleSize(59),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginEnd: Mixins.scaleSize(12),
  },
  alertDetailHeading: {
    fontSize: Mixins.scaleFont(12),
    color: Colors.COLOR_484949,
    fontWeight: '400',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  alertHeadingText: {
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_1A1C1C,
    fontWeight: '700',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  alertDetail: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleSize(14),
    fontWeight: '700',
    color: Colors.COLOR_000,
  },
  alertsCount: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleSize(14),
    fontWeight: '700',
    color: Colors.COLOR_E53935,
    backgroundColor: Colors.COLOR_FADEDE,
    paddingHorizontal: Mixins.scaleSize(8),
    paddingVertical: Mixins.scaleSize(4),
    borderRadius: Mixins.scaleSize(13),
    overflow: 'hidden',
  },
  accordionHeaderTextSummary: {
    fontSize: tablet ? Mixins.scaleFont(18) : Mixins.scaleFont(18),
    color: Colors.COLOR_003D7D,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  summaryInnerContainer: {
    flex: 1,
  },
  summaryHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Mixins.scaleSize(24),
  },
  overallTappable: {flexDirection: 'row', alignItems: 'center'},
  summaryCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Mixins.scaleSize(12),
  },
  alertItemContainer: {
    backgroundColor: Colors.COLOR_D7E6FA,
    borderRadius: 4,
    paddingVertical: Mixins.scaleSize(8),
    paddingHorizontal: Mixins.scaleSize(20),
    alignItems: 'center',
    flex: 1,
    marginEnd: Mixins.scaleSize(12),
  },
  totalTimeContainer: {
    backgroundColor: Colors.COLOR_D7E6FA,
    borderRadius: 4,
    paddingVertical: Mixins.scaleSize(8),
    paddingHorizontal: Mixins.scaleSize(20),
    alignItems: 'center',
  },
  lockdownEndContainer: {
    backgroundColor: Colors.COLOR_D7E6FA,
    borderRadius: 4,
    paddingVertical: Mixins.scaleSize(8),
    alignItems: 'center',
  },
  alertItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Mixins.scaleSize(12),
    marginTop: Mixins.scaleSize(16),
  },
  alertListContainer: {
    marginTop: Mixins.scaleSize(16),
    paddingBottom: Mixins.scaleSize(150),
  },
  alertItem: alertStatus => ({
    marginBottom: Mixins.scaleSize(16),
    borderWidth: 1,
    borderColor:
      alertStatus === 'Resolved' ? Colors.COLOR_9ABD83 : Colors.COLOR_FADEDE,
    borderRadius: 4,
  }),
  alertItemInnerContainer: alertStatus => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor:
      alertStatus === 'Resolved' ? Colors.COLOR_9ABD834D : Colors.COLOR_FADEDE,
    paddingHorizontal: Mixins.scaleSize(16),
    paddingVertical: Mixins.scaleSize(5),
  }),
  configuredButtonStyle:{
    flexDirection: 'row',
    width: Mixins.scaleSize(277),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loaderStyle:{
    marginTop: 10,
    marginStart:Mixins.scaleSize(115)
  },
  mapNameStyle:{
    fontSize: tablet ? Mixins.scaleFont(14) : Mixins.scaleFont(16),
    color: Colors.COLOR_484949,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight:'700'
  } 
});
