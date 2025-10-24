import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_FFFFFF,
    flex: 1,
  },
  subView: {
    flex: 1,
    justifyContent: 'center',
    alignItems:'center',
    backgroundColor: Colors.COLOR_F2F5F9,
  },
  NoPermissionSubTextStyle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_484949,
    marginHorizontal:Mixins.scaleSize(30),
  },
  NoPermissionStyle: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(16),
    color: Colors.COLOR_484949,
    marginHorizontal:Mixins.scaleSize(20),
    marginTop:Mixins.scaleSize(15),
  },
  centeredView:{
    alignItems:'center',
    justifyContent: 'center',
  },
  accessDeniedStyle:{
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(22),
    color: Colors.COLOR_C63461,
    marginTop:Mixins.scaleSize(16),
    marginBottom:Mixins.scaleSize(20),
  }
});
