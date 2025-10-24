import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../../../config/styles';
import utils from '../../../utils';

const {isIpad} = utils;

export default StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.COLOR_F2F5F9,
    justifyContent: 'center',
  },
  titleStyle: hideImage => ({
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: isIpad ? Mixins.scaleFont(14) : Mixins.scaleFont(18),
    color: Colors.COLOR_FB8C00,
    marginHorizontal: isIpad ? Mixins.scaleSize(24) : Mixins.scaleSize(24),
    marginBottom: isIpad ? Mixins.scaleSize(6) : Mixins.scaleSize(8),
    marginTop: hideImage ? Mixins.scaleSize(38) : null
  }),
  subTitle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: isIpad ? Mixins.scaleFont(11) : Mixins.scaleFont(14),
    color: Colors.COLOR_484949,
    marginHorizontal: Mixins.scaleSize(24),
    marginBottom: isIpad ? Mixins.scaleSize(12) : Mixins.scaleSize(16),
  },
  iconStyle: isFoldable => ({
    marginBottom: isFoldable ? Mixins.scaleSize(5) : Mixins.scaleSize(15),
    marginLeft: Mixins.scaleSize(40),
    marginTop: isFoldable ? Mixins.scaleSize(14) : Mixins.scaleSize(34),
  }),
});
