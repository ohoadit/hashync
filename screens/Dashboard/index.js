import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {getGenericPassword} from 'react-native-keychain';
import api from '../../utils/api';
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

const Dashboard = ({navigation, route}) => {
  const [data, setData] = useState(dataSource);
  const [loader, setLoader] = useState(false);

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

  const fetchEntities = async () => {
    setLoader(true);
    const authToken = await getGenericPassword();
    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        auth: authToken.password,
      },
    };
    try {
      const res = await api.get('/entities/all', config);
      setData(res.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        {loader ? (
          <Text>Loading items ...</Text>
        ) : (
          <FlatList
            numColumns={2}
            // onRefresh={fetchEntities}
            data={data}
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
