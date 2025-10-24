import {StyleSheet} from 'react-native';
import {Mixins, Typography, Colors} from '../../../config/styles';
import utils from '../../../utils';

const {isIpad} = utils;

export default StyleSheet.create({
  container: isFoldableDevice => ( {
    flexDirection: 'row',
    width: '100%',
    marginTop: (isIpad || isFoldableDevice) ? Mixins.scaleSize(10) : Mixins.scaleSize(24),
  }),
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd: Mixins.scaleSize(59),
  },
  outerCircle: {
    width: isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(24),
    height: isIpad ? Mixins.scaleSize(20) : Mixins.scaleSize(24),
    borderRadius: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(12),
    borderColor: Colors.COLOR_003D7D,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: Mixins.scaleSize(8)
  },
  innerCircle: selected => ({
    width: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(14),
    height: isIpad ? Mixins.scaleSize(10) : Mixins.scaleSize(14),
    borderRadius: isIpad ? Mixins.scaleSize(5) : Mixins.scaleSize(7),
    backgroundColor: selected ? Colors.COLOR_003D7D : Colors.COLOR_FFFFFF,
  }),
  textStyle:selected =>( {
    fontSize: isIpad ? Mixins.scaleFont(13) : Mixins.scaleFont(14),
    color: selected ? Colors.COLOR_484949 : Colors.COLOR_808284,
    fontFamily: Typography.FONT_FAMILY_BOLD,
  }),
});
