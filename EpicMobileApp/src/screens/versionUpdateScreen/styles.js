import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
const {tablet} = utils;
const {WINDOW_HEIGHT} = Mixins;

export default StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.COLOR_F2F5F9,
    height: WINDOW_HEIGHT,
  },
  logoutContainer:{
    marginTop: tablet ? Mixins.scaleSize(30) : Mixins.scaleSize(47),
    alignSelf: 'flex-end',
    marginRight: Mixins.scaleSize(20)
  },
  appVersionContainer: {},
  appIconStyle: {
    marginTop: tablet ? Mixins.scaleSize(70) : Mixins.scaleSize(95),
    marginLeft: tablet ? Mixins.scaleSize(100) : Mixins.scaleSize(92),
    marginBottom: tablet ? Mixins.scaleSize(43) : Mixins.scaleSize(83),
  },
  epicVersionContainer: {},
  versionTitle: {
    fontSize: tablet ? Mixins.scaleSize(20) : Mixins.scaleFont(24),
    color: Colors.COLOR_C63461,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginLeft: Mixins.scaleSize(29),
    marginBottom: Mixins.scaleSize(12),
    lineHeight: Mixins.scaleSize(30),
    fontWeight: '400',
  },
  versionSubText: {
    marginLeft: Mixins.scaleSize(29),
    fontSize: tablet ? Mixins.scaleSize(12) : Mixins.scaleFont(16),
    color: Colors.COLOR_000,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginBottom: Mixins.scaleSize(12),
    lineHeight: Mixins.scaleSize(20),
    fontWeight: '400',
    marginRight: Mixins.scaleSize(19),
  },
  buttonStyle: {
    marginTop: Mixins.scaleSize(24),
    alignSelf: 'center',
    width: Mixins.scaleSizeWidth(327),
  },
  epicIconStyle: {
    marginTop: tablet ? Mixins.scaleSize(75) : Mixins.scaleSize(105),
    marginLeft: tablet ? Mixins.scaleSize(61) : Mixins.scaleSize(45),
    marginBottom: tablet ? Mixins.scaleSize(43) : Mixins.scaleSize(83),
  },
});
