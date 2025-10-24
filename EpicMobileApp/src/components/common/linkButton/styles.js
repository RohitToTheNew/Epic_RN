import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../../../config/styles';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultTextStyle: {
    color: Colors.COLOR_008e5c,
    fontSize: Mixins.scaleFont(14),
  },
  hitSlop: {
    top: 10,
    bottom: 10,
    left: 5,
    right: 5,
  },
});
