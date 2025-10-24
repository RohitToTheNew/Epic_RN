import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../config/styles';
import utils from '../utils';
const {isIOS, tablet} = utils;
export default StyleSheet.create({
  tabcontainer: isFoldableDevice => ({
    height:
      tablet || isFoldableDevice
        ? Mixins.scaleSizeHeight(100)
        : isIOS
        ? Mixins.scaleSizeHeight(80)
        : Mixins.scaleSizeHeight(60),
    borderColor: Colors.COLOR_BCBABA,
    elevation: 8,
    zIndex: 999,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowColor: Colors.COLOR_000,
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    paddingLeft: Mixins.scaleSize(8),
  }),
  labelStyle: (focused, activeAlerts) => ({
    fontSize: isIOS ? Mixins.scaleFont(11) : Mixins.scaleFont(13),
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: focused
      ? Typography.FONT_FAMILY_BOLD
      : Typography.FONT_FAMILY_REGULAR,
    marginBottom: tablet
      ? Mixins.scaleSize(12)
      : isIOS
      ? Mixins.scaleSize(8)
      : Mixins.scaleSize(14),
    color:
      activeAlerts?.length > 0
        ? Colors.COLOR_FF0000
        : focused
        ? Colors.COLOR_003D7D
        : Colors.COLOR_808284,
  }),
  redAlertIcon: isFoldableDevice => ({
    width:
      tablet || isFoldableDevice ? Mixins.scaleSize(19) : Mixins.scaleSize(20),
    height:
      tablet || isFoldableDevice ? Mixins.scaleSize(19) : Mixins.scaleSize(20),
    tintColor: Colors.COLOR_FF0000,
  }),
});
