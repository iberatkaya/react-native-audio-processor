import {
  StyleProp,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import React from 'react';
import styles from './styles';

const Button = ({
  title,
  containerStyle,
  ...rest
}: {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
} & TouchableOpacityProps) => {
  return (
    <TouchableOpacity {...rest} style={[styles.container, containerStyle]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
