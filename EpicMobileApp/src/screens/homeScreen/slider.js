import React from 'react';
import Slider from 'react-native-slider';
import {Mixins} from '../../config/styles';

export default function CustomSlider(props) {
  return (
    <Slider
      value={props.playingRatio}
      style={{
        width: Mixins.scaleSizeWidth(280),
        borderRadius: Mixins.scaleSize(15),
      }}
      minimumValue={0}
      maximumValue={1}
      minimumTrackTintColor="#C63461"
      maximumTrackTintColor="#BABCBC"
      thumbTintColor="#C63461"
      trackHeight={Mixins.scaleSize(6)}
      thumbStyle={{
        width: Mixins.scaleSize(14),
        height: Mixins.scaleSize(14),
        borderRadius: Mixins.scaleSize(7),
      }}
      onSlidingComplete={props.onSlidingComplete}
    />
  );
}
