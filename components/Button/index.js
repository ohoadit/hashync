import React from 'react';
import {Button as MaterialButton} from 'react-native-paper';
import {StyleSheet} from 'react-native';

// const getButtonStyles = function (type, theme, width, disabled, styling) {
//   if (type === 'text') {
//     return {
//       backgroundColor: 'transparent',
//       width: width || 100,
//       opacity: disabled ? 0.5 : 1,
//       marginVertical: 5,
//       elevation: 0,
//       ...styling,
//     };
//   } else {
//     return {
//       backgroundColor: theme || '#880cef',
//       width: width || 100,
//       opacity: disabled ? 0.5 : 1,
//       ...styling,
//     };
//   }
// };

const Button = ({
  title,
  type,
  theme,
  color,
  onPress,
  disabled,
  customStyle,
}) => (
  <MaterialButton
    onPress={onPress}
    color={color}
    style={
      customStyle ? {...styles.buttonBody, ...customStyle} : styles.buttonBody
    }
    labelStyle={{fontSize: type === 'text' ? 12 : 14}}
    uppercase={false}
    disabled={disabled}
    mode={type || 'contained'}>
    {title}
  </MaterialButton>
);

const styles = StyleSheet.create({
  buttonBody: {
    marginVertical: 35,
    fontSize: 24,
    borderRadius: 5,
  },
});
export default Button;
