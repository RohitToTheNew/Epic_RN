import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../../../config/styles';
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_003D7D,
    height: Mixins.scaleSizeHeight(44),
    width: Mixins.scaleSizeWidth(295),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  defaultTextStyle: {
    color: Colors.COLOR_FFFFFF,
    fontSize: Mixins.scaleFont(18),
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: Typography.FONT_FAMILY_BOLD,
  },
});
