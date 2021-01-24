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

const Button = ({title, type, theme, onPress, disabled, customStyle}) => (
  <MaterialButton
    onPress={onPress}
    style={
      customStyle ? {...styles.buttonBody, ...customStyle} : styles.buttonBody
    }
    disabled={disabled}
    mode={type || 'contained'}>
    {title}
  </MaterialButton>
);

const styles = StyleSheet.create({
  buttonBody: {
    marginVertical: 35,
    borderRadius: 5,
  },
});
export default Button;
