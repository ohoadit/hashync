import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Pressable, FlatList, Modal} from 'react-native';
import Card from '../../components/Card';

const dataSource = [
  {
    id: '1232asdasdasd',
    name: 'Facebook',
  },
  {
    id: 'asdasd@!saasdasd',
    name: 'Instagram',
  },
  {
    id: 'asdjnk21j3llk23',
    name: 'Gmail',
  },
];

const Dashboard = ({navigation}) => {
  const renderCards = (data) => (
    <Card styling={styles.card}>
      <Text style={styles.cardTitle}>{data.item.name}</Text>
    </Card>
  );

  const openAddNewActivity = () => navigation.navigate('Add');

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <FlatList numColumns={2} data={dataSource} renderItem={renderCards} />
      </View>
      <Pressable
        style={styles.fab}
        onPress={openAddNewActivity}
        android_ripple={{color: '#d1d1d1', radius: 30}}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 55,
    right: 30,
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e91e63',
    elevation: 5,
  },
  fabText: {
    fontSize: 35,
    color: '#ffffff',
  },
  card: {
    width: '40%',
    paddingVertical: 45,
  },
  cardTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
