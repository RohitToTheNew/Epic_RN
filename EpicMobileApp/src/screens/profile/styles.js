import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
import {hasNotch} from 'react-native-device-info'
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_003E7E0D,
    flex: 1,
  },
  headerContainer: top => ({
    paddingStart: Mixins.scaleSize(16),
    paddingTop: top ? top + Mixins.scaleSize(20) : utils.deviceHasNotch
      ? Mixins.scaleSize(53)
      : utils.isAndroid
      ? Mixins.scaleSize(18)
      : utils.isIpad
      ? Mixins.scaleSize(28)
      : Mixins.scaleSize(33),
    paddingBottom: Mixins.scaleSize(13),
    backgroundColor: Colors.COLOR_FFFFFF,
  }),
  headerTitleStyle: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(18),
    color: Colors.COLOR_FB8C00,
    paddingStart: Mixins.scaleSize(8),
  },
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer:{
    padding:2,
    borderRadius: Mixins.scaleSize(135),
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: Mixins.scaleSize(32),
    borderWidth: 1,
    justifyContent:'center',
    alignItems:'center',
    borderColor: Colors.COLOR_003E7E,
  },
  profileImageStyle: {
    width: Mixins.scaleSize(137),
    height: Mixins.scaleSize(137),
    borderRadius: Mixins.scaleSize(135),
    maxWidth: Mixins.scaleSize(139),
    maxHeight: Mixins.scaleSize(139),
  },
  personalInfoHeader: {
    marginStart: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(35),
    marginBottom: Mixins.scaleSize(8),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_FB8C00,
  },
  profileDetailsItemContainer: {
    paddingHorizontal: Mixins.scaleSize(24),
    paddingTop: Mixins.scaleSize(9),
    paddingBottom: Mixins.scaleSize(13),
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  profileDetailsHeader: {
    marginBottom: Mixins.scaleSize(6),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(12),
    color: Colors.COLOR_808284,
  },
  profileDetailsValue: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(14),
    color: Colors.COLOR_000000,
  },
});
