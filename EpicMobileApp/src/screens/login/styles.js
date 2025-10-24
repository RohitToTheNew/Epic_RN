import {StyleSheet} from 'react-native';
import {Colors, Mixins, Typography} from '../../config/styles';
import utils from '../../utils';
const {isIOS, tablet} = utils;
export default StyleSheet.create({
  container: {
    backgroundColor: Colors.COLOR_FFFFFF,
    flex: 1,
  },
  loginText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: Mixins.scaleFont(24),
    color: Colors.COLOR_C63461,
  },
  textContainer: isFoldableDevice =>  ({
    flexDirection: 'row',
    position: 'absolute',
    bottom: tablet ? Mixins.scaleSize(17) : isFoldableDevice ? Mixins.scaleSize(9) : utils.isIphone8 ? Mixins.scaleSize(19) : Mixins.scaleSize(49),
  }),
  byLoginText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: isIOS ? Mixins.scaleFont(10) : Mixins.scaleFont(12),
    color: Colors.COLOR_484949,
    lineHeight: Mixins.LINE_HEIGHT_13,
  },
  privacyText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontSize: isIOS ? Mixins.scaleFont(10) : Mixins.scaleFont(12),
    color: Colors.COLOR_FB8C00,
    lineHeight: Mixins.LINE_HEIGHT_13,
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Mixins.scaleSize(6),
  },
  buttonStyle: (isFoldableDevice, ssoEnabled) => ({
    position: 'absolute',
    bottom: tablet ? ssoEnabled ? Mixins.scaleSize(150) : Mixins.scaleSize(49) : isFoldableDevice ? Mixins.scaleSize(39) : utils.isIphone8 ? Mixins.scaleSize(150) : Mixins.scaleSize(220),
  }),
  invalidServerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(100, 100, 100, 0.5)',
  },
  invalidServerTextContainer: {
    backgroundColor: Colors.COLOR_FFFFFF,
    borderRadius: Mixins.scaleSizeWidth(8),
    width: Mixins.scaleSize(311),
  },
  serverTextStyle: {
    textAlign: 'center',
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginTop: Mixins.scaleSize(25),
    fontSize: Mixins.scaleFont(13),
    lineHeight: Mixins.scaleSize(20),
    color: Colors.COLOR_333333,
    marginHorizontal: Mixins.scaleSize(23),
  },
  continueButtonContainer: {
    marginHorizontal: Mixins.scaleSize(27.5),
    marginTop: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(25),
    backgroundColor: Colors.COLOR_003D7D,
  },
  continueButttonStyle: {
    color: Colors.COLOR_FFFFFF,
    fontSize: Mixins.scaleFont(18),
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    marginVertical: Mixins.scaleSize(12),
    textAlign: 'center',
  },
  separator: (isFoldableDevice, ssoEnabled) =>({
     position: 'absolute',
    bottom: tablet ? ssoEnabled ? Mixins.scaleSize(110) : Mixins.scaleSize(49) : isFoldableDevice ? Mixins.scaleSize(39) : utils.isIphone8 ? Mixins.scaleSize(120) :Mixins.scaleSize(175),
  }),
  classlinkButton: isFoldableDevice =>({
    position: 'absolute',
    left: (Mixins.WINDOW_WIDTH-Mixins.scaleSize(257))/2,
    bottom: tablet ? Mixins.scaleSize(49) : isFoldableDevice ? Mixins.scaleSize(39) : utils.isIphone8 ? Mixins.scaleSize(60) : Mixins.scaleSize(100),
  }),

  mapViewContainer: {
    flex: 1,
    backgroundColor: Colors.COLOR_FFFFFF,
  },
  mapViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: tablet ? Mixins.scaleSize(31) : Mixins.scaleSize(61),
    marginBottom: tablet ? Mixins.scaleSize(33) : Mixins.scaleSize(20),
  },
  iconStyle: {
    marginHorizontal: Mixins.scaleSize(24),
  },
  mapViewText: {
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    fontWeight: '700',
    fontSize: Mixins.scaleSize(18),
    lineHeight: Mixins.scaleSize(22),
    color: Colors.COLOR_000000,
  },
  mapViewSubConatiner: {
    borderWidth: 1,
    borderColor: Colors.COLOR_B0B6BB,
    height:'80%',
    width:'100%',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  contentStyle:{
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.COLOR_FFFFFF,
    marginTop:1
  },
  containerStyle:{
    // flex:1
    width:'100%',
    height:'100%'
  },
  cleverIconStyle:{
    width:Mixins.scaleSize(257), 
    height: Mixins.scaleSize(46)
  }
});
