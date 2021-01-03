import React from 'react';
import {Pressable, Text, StyleSheet} from 'react-native';

const prepareCardColor = () => {
  const color = `rgb(${Math.random() * 205}, ${Math.random() * 205}, ${
    Math.random() * 205
  })`;
  return color;
};

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
    paddingVertical: 20,
    elevation: 5,
  },
});

const Card = ({id, styling, wrapper, children, onPress}) => {
  return (
    <Pressable
      android_ripple={{color: '#d1d1d1'}}
      style={{
        ...styles.card,
        ...styling,
      }}
      onPress={onPress}
      android_disableSound={wrapper}
      disabled={wrapper}>
      {children}
    </Pressable>
  );
};

export default Card;
