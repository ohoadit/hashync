import React from 'react';
import {StyleSheet, Pressable, Text} from 'react-native';

const getButtonStyles = function (type, theme, width, disabled, styling) {
  if (type === 'text') {
    return {
      backgroundColor: 'transparent',
      width: width || 100,
      opacity: disabled ? 0.5 : 1,
      marginVertical: 5,
      elevation: 0,
      ...styling,
    };
  } else {
    return {
      backgroundColor: theme || '#880cef',
      width: width || 100,
      opacity: disabled ? 0.5 : 1,
      ...styling,
    };
  }
};

const Button = ({
  title,
  type,
  textColor,
  theme,
  width,
  onPress,
  disabled,
  styling,
}) => (
  <Pressable
    onPress={onPress}
    style={{
      ...styles.buttonBody,
      ...getButtonStyles(type, theme, width, disabled, styling),
    }}
    disabled={disabled}
    android_ripple={{color: '#d1d1d1'}}>
    <Text
      disabled={disabled}
      style={{
        ...styles.buttonText,
        color: textColor || '#fff',
        fontSize: type === 'text' ? 14 : 16,
      }}>
      {title}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  buttonBody: {
    height: 45,
    marginVertical: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontWeight: '500',
  },
});
export default Button;
