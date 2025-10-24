import {StyleSheet} from 'react-native';
import {Mixins, Colors, Typography} from '../../../config/styles';
export default StyleSheet.create({
  containerDefaultStyle: {
    flex: 1,
    height: Mixins.scaleSizeHeight(614),
    width: Mixins.scaleSizeWidth(331),
  },
  activityIndicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Mixins.scaleSize(120),
  },
  contentViewStyle: {
    flex: 1,
    borderRadius: Mixins.scaleSize(15),
    alignItems: 'center',
    marginTop: Mixins.scaleSize(20),
    backgroundColor: Colors.COLOR_FFFFFF,
  },
});
