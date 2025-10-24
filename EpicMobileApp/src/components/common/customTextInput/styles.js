import { StyleSheet } from 'react-native';
import { Mixins, Typography, Colors } from '../../../config/styles';
import { validatePathConfig } from '@react-navigation/native';
import utils from '../../../utils';

const {isIpad} = utils;
const {tablet} = utils;

export default StyleSheet.create({
  textInputContainer: (isInvalid, isFocused) => ({
    flexDirection: 'row',
    borderColor: isInvalid
      ? Colors.COLOR_FF0000
      : isFocused
        ? Colors.COLOR_808284
        : Colors.COLOR_808284,
    borderBottomWidth: 1,
    borderRadius: Mixins.scaleSize(3),
    borderStyle: 'solid',
    height: Mixins.scaleSize(40),
    alignItems: 'flex-end',
    paddingBottom: Mixins.scaleSize(6),
    justifyContent: 'space-between',
    width: Mixins.scaleSize(359),
  }),
  textinputStyle: (showPasswordButton, isFoldableDevice) => ({
    fontSize: (tablet ||isFoldableDevice) ? Mixins.scaleFont(12) : Mixins.scaleFont(16),
    flex:1,
    color: Colors.COLOR_1A1C1C,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    padding:0,
    paddingStart:1,
    marginTop: (tablet ||isFoldableDevice) ? Mixins.scaleSizeHeight(10) : Mixins.scaleSizeHeight(15),
    textDecorationLine:'none',
  }),
  errorMessage: isFoldableDevice =>({
    color: Colors.COLOR_FF0000,
    fontSize: (tablet ||isFoldableDevice) ? Mixins.scaleFont(8) : Mixins.scaleFont(12),
    marginTop: (tablet ||isFoldableDevice) ? Mixins.scaleSize(5) : Mixins.scaleSize(8),
    textAlign:'right',
    fontFamily: Typography.FONT_FAMILY_BOLD
  }),
  showPasswordButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginStart:Mixins.scaleSize(10)

  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: Colors.COLOR_FFFFFF,
    justifyContent: 'center',
    alignItems: 'center',
    height:validatePathConfig(68),
  },
  label: isFoldableDevice =>( {
    fontSize: (tablet ||isFoldableDevice) ? Mixins.scaleFont(16) : Mixins.scaleFont(20),
    textAlign: 'left',
  }),
  auxiliaryBtnStyle: isFoldableDevice =>({
    fontWeight:'700',
    fontSize: (tablet ||isFoldableDevice) ? Mixins.scaleSize(10) : null
  })
});