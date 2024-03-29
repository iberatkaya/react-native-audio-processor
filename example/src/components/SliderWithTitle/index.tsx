import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import Slider from '@react-native-community/slider';

const SliderWithTitle = ({
  value,
  onValueChange,
  onSlidingComplete,
  maximumValue,
  minimumValue,
  step,
  minLabel,
  maxLabel,
  title,
  disabled,
}: { minLabel: string; maxLabel: string; title?: string } & Pick<
  Slider['props'],
  | 'value'
  | 'onValueChange'
  | 'minimumValue'
  | 'maximumValue'
  | 'step'
  | 'disabled'
  | 'onSlidingComplete'
>) => {
  return (
    <View style={styles.container}>
      {!!title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.sliderRow}>
        <Text numberOfLines={2} style={styles.minimumText}>
          {minLabel}
        </Text>
        <Slider
          disabled={disabled}
          style={styles.slider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          minimumTrackTintColor="#55f"
          maximumTrackTintColor="#999"
          value={value}
          step={step}
          onSlidingComplete={onSlidingComplete}
          onValueChange={onValueChange}
        />
        <Text numberOfLines={2} style={styles.maximumText}>
          {maxLabel}
        </Text>
      </View>
    </View>
  );
};

export default SliderWithTitle;
