import {StyleSheet} from 'react-native';
import {Mixins, Typography, Colors} from '../../../config/styles';
import {validatePathConfig} from '@react-navigation/native';
import utils from '../../../utils';
const {tablet} = utils;
export default StyleSheet.create({
  textInputContainer: isFocused => ({
    flexDirection: 'row',
    borderColor: isFocused ? Colors.COLOR_808284 : Colors.COLOR_808284,
    borderBottomWidth: 1,
    borderRadius: Mixins.scaleSize(3),
    borderStyle: 'solid',
    alignItems: 'flex-end',
    paddingBottom: isFocused ? Mixins.scaleSize(10) : Mixins.scaleSize(2),
    justifyContent: 'space-between',
    maxHeight: Mixins.scaleSizeHeight(150),
    width: Mixins.scaleSizeWidth(260),
  }),
  textinputStyle: {
    fontSize: tablet ? Mixins.scaleFont(12) : Mixins.scaleFont(16),
    flex: 1,
    color: Colors.COLOR_1A1C1C,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    padding: 0,
    paddingStart: 1,
    marginTop: tablet ? Mixins.scaleSizeHeight(14) : Mixins.scaleSizeHeight(15),
    textDecorationLine: 'none',
  },
  labelContainer: {
    position: 'absolute',
    backgroundColor: Colors.COLOR_FFFFFF,
    justifyContent: 'center',
    alignItems: 'center',
    height: validatePathConfig(68),
  },
  label: {
    fontSize: tablet ? Mixins.scaleFont(16) : Mixins.scaleFont(24),
    textAlign: 'left',
  },
});
