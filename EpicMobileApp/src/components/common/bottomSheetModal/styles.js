import {StyleSheet} from 'react-native';
import {Mixins, Colors} from '../../../config/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.COLOR_00000033,
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: Colors.COLOR_00000033,
  },
  viewContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  shutterContainer: (bottomInset, height, maxHeight) => ({
    backgroundColor: Colors.COLOR_F7F8FF,
    paddingBottom: bottomInset ? bottomInset + Mixins.scaleSize(40) : null,
    borderTopLeftRadius: Mixins.scaleSize(24),
    borderTopRightRadius: Mixins.scaleSize(24),
    justifyContent: 'center',
    paddingHorizontal: Mixins.scaleSize(16),
    height,
    maxHeight: maxHeight || '60%',
  }),
});
