import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import Slider from '@react-native-community/slider';

const AudioEffect = ({
  value,
  onValueChange,
  maximumValue,
  minimumValue,
  step,
  minLabel,
  maxLabel,
  title,
}: { minLabel: string; maxLabel: string; title: string } & Pick<
  Slider['props'],
  'value' | 'onValueChange' | 'minimumValue' | 'maximumValue' | 'step'
>) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sliderRow}>
        <Text numberOfLines={2} style={styles.minimumText}>
          {minLabel}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          minimumTrackTintColor="#55f"
          maximumTrackTintColor="#999"
          value={value}
          step={step}
          onValueChange={onValueChange}
        />
        <Text numberOfLines={2} style={styles.maximumText}>
          {maxLabel}
        </Text>
      </View>
    </View>
  );
};

export default AudioEffect;
