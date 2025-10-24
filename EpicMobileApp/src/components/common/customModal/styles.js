import { StyleSheet } from "react-native";
import { Mixins, Colors, Typography } from '../../../config/styles';
import utils from "../../../utils";
const { isIOS, isAndroid } = utils;
export default StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(100, 100, 100, 0.5)'
    },
    modalView: {
        backgroundColor: Colors.COLOR_FFFFFF,
        borderRadius: Mixins.scaleSizeWidth(8),
        width: Mixins.scaleSize(311),
    },
    titleView: {
        marginHorizontal: Mixins.scaleSize(23),
        marginTop: Mixins.scaleSize(25),
    },
    textStyle: {
        color: Colors.COLOR_333333,
        textAlign: 'center',
        fontSize: Mixins.scaleFont(15),
        lineHeight: Mixins.scaleSize(20),
        fontFamily: Typography.FONT_FAMILY_REGULAR
    },
    startButtonContainer: (hideCancelButton) => ({
        marginHorizontal: Mixins.scaleSize(27.5),
        marginTop: Mixins.scaleSize(16),
        backgroundColor: hideCancelButton ? Colors.COLOR_003D7D80 :  Colors.COLOR_003D7D,
        marginBottom: Mixins.scaleSize(25)
    }),
    startText: {
        color: Colors.COLOR_FFFFFF,
        fontSize: Mixins.scaleFont(18),
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: '700',
        marginVertical: Mixins.scaleSize(12),
        textAlign: 'center'
    },
    sendIconText:{
        color: Colors.COLOR_FFFFFF,
        fontSize: Mixins.scaleFont(18),
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: '700',
        marginVertical: Mixins.scaleSize(12),
        textAlign: 'center'
    },
    sendIconView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendIconStyle: {
        marginRight: Mixins.scaleFont(10)
    },
    cancelText: {
        color: Colors.COLOR_003D7D,
        fontSize: isIOS ? Mixins.scaleFont(14): Mixins.scaleFont(16),
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        fontWeight: '700',
        marginBottom: Mixins.scaleSize(24),
        textAlign: 'center'
    },
    notificationItem: {
        color: Colors.COLOR_000,
        fontSize: Mixins.scaleFont(16),
        fontFamily: Typography.FONT_FAMILY_BOLD,
    },
    launch: {
        color: Colors.COLOR_333333,
        fontSize: Mixins.scaleFont(16),
        fontFamily: Typography.FONT_FAMILY_REGULAR,
        alignSelf: 'center',
        maxWidth: Mixins.scaleSize(199),
        textAlign: 'center'
    }
});
