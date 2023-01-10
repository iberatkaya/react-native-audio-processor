import {
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import styles from './styles';

const IconButton = ({
  name,
  containerStyle,
  iconSize,
  ...rest
}: {
  name: string;
  iconSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
} & TouchableOpacityProps) => {
  const containerSize = (iconSize ?? 16) + 24;
  return (
    <TouchableOpacity
      {...rest}
      style={[
        styles.container,
        {
          height: containerSize,
          width: containerSize,
          borderRadius: containerSize / 2,
        },
        containerStyle,
      ]}
    >
      <MaterialIcon size={iconSize ?? 16} style={styles.icon} name={name} />
    </TouchableOpacity>
  );
};

export default IconButton;
