import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../../config/styles';
import utils from '../../../utils';
const {isIOS,tablet} = utils;
export default StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.COLOR_1A1C1CCC,
  },
  modalView: {
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: Mixins.scaleSizeWidth(8),
    width: Mixins.scaleSize(311),
  },
  titleView: {
    marginHorizontal: Mixins.scaleSize(23),
    marginTop: Mixins.scaleSize(25),
  },
  textStyle: {
    textAlign: 'center',
    fontSize: Mixins.scaleFont(16),
    lineHeight: Mixins.scaleSize(20),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_1A1C1C,
  },
  subText: {
    color: Colors.COLOR_003D7D,
    fontSize: isIOS ? Mixins.scaleFont(14) : Mixins.scaleFont(16),
    fontFamily: Typography.FONT_FAMILY_BOLD,
    marginBottom: Mixins.scaleSize(24),
    textAlign: 'center',
  },
  subTextStyle: {
    fontSize: Mixins.scaleFont(12),
    lineHeight: Mixins.scaleSize(20),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_808284,
    marginTop: Mixins.scaleSize(16),
  },
  buttonStyle: {
    marginTop: Mixins.scaleSize(20),
    marginBottom: Mixins.scaleSize(25),
    marginLeft: Mixins.scaleSize(10),
    height: Mixins.scaleSizeHeight(46),
    width: Mixins.scaleSizeWidth(242),
    marginBottom: Mixins.scaleSize(18),
  },
  textStyleButton: {
    fontSize: tablet ? Mixins.scaleFont(18) : Mixins.scaleFont(18),
    color: Colors.COLOR_FFFFFF,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
});
