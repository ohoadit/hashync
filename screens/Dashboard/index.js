import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../utils/api';
import Card from '../../components/Card';
import colors from '../../colors';

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

const Dashboard = ({navigation, route}) => {
  const [data, setData] = useState(dataSource);
  const [loader, setLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const openEntity = useCallback(
    (entityId) => () => {
      navigation.navigate('Entity', {
        entityId,
        title: 'Add Entity',
      });
    },
    [navigation],
  );

  const renderCards = (cardData) => (
    <Card styling={styles.card} onPress={openEntity(cardData.item._id)}>
      <Text style={styles.cardTitle}>{cardData.item.title}</Text>
    </Card>
  );

  const openAddNewActivity = () => navigation.navigate('Entity');

  const fetchEntities = (state = false) => async () => {
    if (state) {
      setRefresh(true);
    } else {
      setLoader(true);
    }
    const authToken = await AsyncStorage.getItem('authToken');
    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        auth: authToken,
      },
    };
    try {
      const res = await api.get('/entities/all', config);
      setData(res.data);
    } catch (err) {
      Alert.alert('Error', err.message);
    }
    if (state) {
      setRefresh(false);
    } else {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEntities(false)();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {loader ? (
          <Text>Loading items ...</Text>
        ) : (
          <FlatList
            numColumns={2}
            data={data}
            refreshControl={
              <RefreshControl
                colors={[colors.primary]}
                onRefresh={fetchEntities(true)}
                refreshing={refresh}
              />
            }
            renderItem={renderCards}
            keyExtractor={(item) => item._id}
          />
        )}
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
  card: {
    width: '40%',
    paddingVertical: 45,
    elevation: 0,
    borderColor: '#dfdfdf',
    borderStyle: 'solid',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: 16,
    color: '#000',
  },
});

export default Dashboard;
