import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
const {isAndroid} = utils
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_FFFFFF,
    flex: 1,
  },
  subView: {
    flex: 1,
    backgroundColor: Colors.COLOR_F2F5F9,
  },
  weekendStyle: marked => ({
    color: marked ? Colors.COLOR_FFFFFF : Colors.COLOR_E53935,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(14),
  }),
  dayType: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  calenderContainer: {
    marginTop: Mixins.scaleSize(12),
    marginHorizontal: Mixins.scaleSize(14),
    marginBottom: Mixins.scaleSize(24),    
  },
  listingContainer: {
    flex:1,
    marginHorizontal: Mixins.scaleSize(12),
    marginBottom: Mixins.scaleSize(9),
  },
  listingSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Mixins.scaleSize(16),
  },
  calenderHeaderText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(18),
    color: Colors.COLOR_484949,
    marginTop: Mixins.scaleSize(5)
  },
  dayTypesText: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_000000,
  },
  separatorStyle: {
    height: Mixins.scaleSize(1),
    backgroundColor: Colors.COLOR_BABCBC,
    width: Mixins.scaleSizeWidth(244),
  },
  weekStyle: marked => ({
    color: marked ? Colors.COLOR_FFFFFF : Colors.COLOR_1A1C1C,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(14),
  }),
  dayContainer: {
    height: Mixins.scaleSizeHeight(46),
    width: Mixins.scaleSizeWidth(46),
    backgroundColor: Colors.COLOR_FFFFFF,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginBottom: Mixins.scaleSize(2),
  },
  dayText: {
    color: Colors.COLOR_484949,
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(16),
    textAlign: 'center',
    maxWidth: Mixins.scaleSizeWidth(300),
    fontWeight: isAndroid ? '100' : '400'

  },
  daysContainer: {
    shadowColor: Colors.COLOR_000,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: Mixins.scaleSize(8),
    backgroundColor: Colors.COLOR_FFFFFF,
    marginBottom: Mixins.scaleSize(4),
    justifyContent: 'flex-start',
    marginHorizontal: Mixins.scaleSize(2),
    height: Mixins.scaleSizeHeight(48),
    alignItems:'center',
    flexDirection:'row',
  },
  square: colorCode => ({
    height: Mixins.scaleSizeHeight(32),
    width: Mixins.scaleSizeWidth(32),
    backgroundColor: colorCode,
    borderWidth: 1,
    marginLeft: Mixins.scaleSize(8),
    marginRight: Mixins.scaleSize(12)
  }),
  scrollView:{
    marginTop: Mixins.scaleSize(12),
  },
});
