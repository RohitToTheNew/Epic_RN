import { StyleSheet } from 'react-native';
import { Colors, Mixins, Typography } from '../../config/styles';
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
  passwordPolicyHeader: {
    fontFamily: Typography.FONT_FAMILY_BOLD,
    fontSize: Mixins.scaleFont(12),
    color: Colors.COLOR_1A1C1C,
    lineHeight: Mixins.scaleFont(16),
    marginHorizontal: Mixins.scaleSize(16),
    marginBottom: Mixins.scaleSize(5.6)
  },
  passwordPolicyDesc: {
    fontFamily: Typography.FONT_FAMILY_Regular,
    fontSize: Mixins.scaleFont(12),
    fontWeight: '400',
    marginStart: Mixins.scaleSize(5.33),
    lineHeight: Mixins.scaleFont(16),
  },
  flexHorizontalStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Mixins.scaleSize(4),
    marginHorizontal: Mixins.scaleSize(16)
  },
  buttonStyle: {
    marginTop: Mixins.scaleSize(56),
    alignSelf: 'center'
  },
  inputStyle: isFoldableDevice => ({
    width: Mixins.scaleSize(359),
    marginVertical: isFoldableDevice ? Mixins.scaleSize(15) : Mixins.scaleSize(20),
    alignSelf: 'center'
  }),
  iconStyle: {
    alignSelf: 'flex-start',
    marginTop: Mixins.scaleSize(2)
  },
  subContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
