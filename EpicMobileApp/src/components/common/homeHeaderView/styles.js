import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../../../config/styles';
import utils from '../../../utils';
const {isIOS, isIpad, deviceHasNotch} = utils;
export default StyleSheet.create({
  container: top => ({
    width: '100%',
    backgroundColor: Colors.COLOR_FFFFFF,
    justifyContent: 'center',
    paddingTop: top ? top - Mixins.scaleSize(15) : null,
  }),
  titleStyle: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(18),
    color: Colors.COLOR_FB8C00,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Mixins.scaleSize(16),
    marginTop: Mixins.scaleSize(30),
    marginBottom: Mixins.scaleSize(11),
  },
  centeredView: {
    flex: 1,
  },
  modalView: top => ({
    justifyContent: 'flex-start',
    alignSelf: 'flex-end',
    marginTop: top ? Mixins.scaleSize(40) + top : Mixins.scaleSize(50),
    marginHorizontal: Mixins.scaleSize(16),
    backgroundColor: 'white',
    borderRadius: Mixins.scaleSize(8),
    padding: Mixins.scaleSize(12),
    width: Mixins.scaleSizeWidth(111),
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  }),
  logoutText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(14),
    color: Colors.COLOR_00335C,
    marginLeft: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(2),
    marginTop: Mixins.scaleSize(1),
  },
  titleContainer: {
    flex: 1,
    marginRight: Mixins.scaleSize(6),
  },
  schoolNameContainer: top => ({
    width: Mixins.scaleSizeWidth(295),
    marginTop: top ? Mixins.scaleSize(40) + top : Mixins.scaleSize(65),
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: Mixins.scaleSize(8),
    padding: Mixins.scaleSize(12),
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  }),
  schoolText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(14),
    color: Colors.COLOR_00335C,
  },
  userIcon: isFoldableDevice => ({
    width: isIpad
      ? Mixins.scaleSize(18)
      : isIOS
      ? Mixins.scaleSize(30)
      : isFoldableDevice
      ? Mixins.scaleSize(28)
      : Mixins.scaleSize(32),
    height: isIpad
      ? Mixins.scaleSize(18)
      : isIOS
      ? Mixins.scaleSize(30)
      : isFoldableDevice
      ? Mixins.scaleSize(28)
      : Mixins.scaleSize(32),
    borderRadius: isIpad
      ? Mixins.scaleSize(9)
      : isIOS
      ? Mixins.scaleSize(15)
      : isFoldableDevice
      ? Mixins.scaleSize(14)
      : Mixins.scaleSize(16),
    overflow: 'hidden',
  }),
  userIconMini: isFoldableDevice => ({
    width: isIOS
      ? Mixins.scaleSize(20)
      : isFoldableDevice
      ? Mixins.scaleSize(18)
      : Mixins.scaleSize(20),
    height: isIOS
      ? Mixins.scaleSize(20)
      : isFoldableDevice
      ? Mixins.scaleSize(18)
      : Mixins.scaleSize(20),
    borderRadius: isIOS
      ? Mixins.scaleSize(10)
      : isFoldableDevice
      ? Mixins.scaleSize(9)
      : Mixins.scaleSize(10),
    overflow: 'hidden',
  }),
  logoutIconStyle: {
    marginTop: Mixins.scaleSize(3),
  },
  buttonStyle:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Mixins.scaleSize(12),
  }
});
