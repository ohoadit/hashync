import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});

const Loading = ({navigation}) => (
  <View style={styles.screen}>
    <View style={styles.container}>
      <ActivityIndicator animating color="#3f51b5" size="large" />
    </View>
  </View>
);

export default Loading;
