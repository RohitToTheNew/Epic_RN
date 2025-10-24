import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
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
  listStyle: {
    paddingHorizontal: Mixins.scaleSize(16),
    paddingVertical: Mixins.scaleSize(16),
  },
  startButton: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_FFFFFF,
    fontWeight: '700',
    marginStart: Mixins.scaleSize(2),
  },
  startButtonContainer: notificationPlaying => ({
    width: Mixins.scaleSize(119),
    height: Mixins.scaleSize(48),
    borderRadius: Mixins.scaleSize(4),
    alignItems: 'center',
    backgroundColor: notificationPlaying
      ? Colors.COLOR_E53935
      : Colors.COLOR_5D9D52,
    flexDirection: 'row',
    alignSelf: 'flex-end',
  }),
  notificationButtonText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(18),
    color: Colors.COLOR_484949,
    fontWeight: '700',
    marginStart: Mixins.scaleSize(11),
    maxWidth: Mixins.scaleSize(130),
  },
  notificationIcon: {
    width: Mixins.scaleSize(56),
    height: Mixins.scaleSize(56),
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationItemContainer: notificationPlaying => ({
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: notificationPlaying ? 0 : 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Mixins.scaleSize(12),
    paddingVertical: Mixins.scaleSize(16),
    borderRadius: Mixins.scaleSize(12),
    marginBottom: Mixins.scaleSize(12),
    backgroundColor: notificationPlaying
      ? Colors.COLOR_E5393526
      : Colors.COLOR_FFFFFF,
  }),
  iconStyle: {
    marginLeft: Mixins.scaleSize(20),
  },
  stopIconStyle: {
    marginLeft: Mixins.scaleSize(20),
    marginRight: Mixins.scaleSize(8),
  },
  placeholderView:{
    width: Mixins.scaleSize(56),
    height: Mixins.scaleSize(56),
  }
});
