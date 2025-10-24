import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../../config/styles';
import utils from '../../../utils';
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
  iconStyle: {
    marginBottom: Mixins.scaleSize(19),
    alignSelf: 'center',
  },
  titleView: {
    marginHorizontal: Mixins.scaleSize(23),
    marginTop: Mixins.scaleSize(25),
  },
  textStyle: {
    textAlign: 'center',
    fontSize: Mixins.scaleFont(15),
    lineHeight: Mixins.scaleSize(20),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_333333,
  },
  buttonContainer: {
    backgroundColor: Colors.COLOR_003D7D,
    height: Mixins.scaleSizeHeight(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Mixins.scaleSize(20),
    marginBottom: Mixins.scaleSize(32),
    marginHorizontal: Mixins.scaleSize(20),
  },
  cancelButton: {
    marginBottom: Mixins.scaleSize(24),
    alignSelf: 'center',
  },
  cancelText: {
    fontSize: utils.isIOS ? Mixins.scaleFont(14) : Mixins.scaleFont(16),
    lineHeight: Mixins.scaleSize(16),
    fontFamily: Typography.FONT_FAMILY_BOLD,
    color: Colors.COLOR_003D7D,
  },
  buttonContainer1: {
    backgroundColor: Colors.COLOR_003D7D,
    height: Mixins.scaleSizeHeight(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Mixins.scaleSize(20),
    marginBottom: Mixins.scaleSize(25),
    marginHorizontal: Mixins.scaleSize(20),
  },
  defaultButtonTextStyle: {
    color: Colors.COLOR_FFFFFF,
    fontSize: Mixins.scaleFont(18),
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
  lottieStyle: {
    width: Mixins.scaleSize(150),
    height: Mixins.scaleSize(150),
    alignSelf: 'center',
  },
  textStyle1: {
    textAlign: 'center',
    fontSize: Mixins.scaleFont(15),
    lineHeight: Mixins.scaleSize(20),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    color: Colors.COLOR_333333,
    marginHorizontal: Mixins.scaleSize(23),
    marginTop: Mixins.scaleSize(25),
    marginBottom: Mixins.scaleSize(32),
  },
});
