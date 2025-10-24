import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
const {tablet} = utils;
const {WINDOW_HEIGHT} = Mixins;
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_F2F5F9,
    height: WINDOW_HEIGHT,
  },
  noInternetIcon: isFoldableDevice => ({
    alignSelf: 'center',
    marginTop: isFoldableDevice ? Mixins.scaleSize(40) : Mixins.scaleSize(120),
  }),
  textContainer: {
    marginTop: Mixins.scaleSize(50),
    marginHorizontal: Mixins.scaleSize(30),
  },
  offlineTextStyle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(24),
    color: Colors.COLOR_C63461,
  },
  checkConfigStyle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_000000,
    marginTop: Mixins.scaleSize(10),
  },
  pullDownText: isFoldableDevice => ({
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_B0B6BB,
    textAlign: 'center',
    marginTop: tablet ? Mixins.scaleSize(100) : isFoldableDevice ? Mixins.scaleSize(60) : Mixins.scaleSize(120),
    marginBottom: tablet ? null : Mixins.scaleSize(20),
  }),
  subContainer: {
    flex: 0.7,
  },
  footer: {
    flex: 0.3,
  },
  preHeaderCompStyle: {
    backgroundColor: Colors.COLOR_F2F5F9,
    height: 1000,
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  postComponentStyle: {
    backgroundColor: Colors.COLOR_F2F5F9,
    height: 1000,
    position: 'absolute',
    bottom: -1000,
    left: 0,
    right: 0,
  },
  logoutContainer: top => ({
    position: 'absolute',
    alignSelf: 'flex-end',
    top: top ? Mixins.scaleSize(50) : Mixins.scaleSize(20),
    right: Mixins.scaleSize(10),
  }),
  logoutIconStyle: {
    marginHorizontal: Mixins.scaleSize(6),
  },
});
