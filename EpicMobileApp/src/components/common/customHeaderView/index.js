import React from 'react';
import {View, Text} from 'react-native';
import {AeIcon} from '../../../config/imageConstants';
import {Mixins} from '../../../config/styles';
import styles from './styles';
import utils from '../../../utils';

const {isIpad} = utils;

const CustomHeaderView = ({title, subTitle, hideImage, isFoldableDevice}) => {

  return (
    <View style={styles.container}>
      <View>
        {!hideImage && (
          <AeIcon
            style={styles.iconStyle(isFoldableDevice)}
            height={(isIpad) ? Mixins.scaleSize(71) :  isFoldableDevice  ? 71 : Mixins.scaleSize(71)}
            width={(isIpad) ? Mixins.scaleSize(287) : isFoldableDevice  ? 287 :  Mixins.scaleSize(287)}
          />
        )}
        <Text style={styles.titleStyle(hideImage)}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>
    </View>
  );
};
export default CustomHeaderView;
