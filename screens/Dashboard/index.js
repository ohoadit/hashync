import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';
import Card from '../../components/Card';
import colors from '../../colors';
import {ActivityIndicator, Colors} from 'react-native-paper';
import Button from '../../components/Button';

const formatDate = (value) => {
  const date = new Date(value);
  return `${date.toDateString()} --- ${date.toLocaleTimeString()}`;
};
const Dashboard = ({navigation, route}) => {
  const [data, setData] = useState([]);
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

  const renderCards = (cardData) => {
    // console.log(cardData);
    return (
      <Card
        styling={styles.card}
        onPress={openEntity(cardData.item._id)}
        wrapper>
        <View style={styles.cardData}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {cardData.item.title}
          </Text>
          <Text style={styles.timestamp}>
            {formatDate(cardData.item.createdOn)}
          </Text>
        </View>
        <View style={styles.cardActions}>
          <Button title="Delete" />
        </View>
      </Card>
    );
  };

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
      {loader ? (
        <ActivityIndicator style={{marginTop: '10%'}} />
      ) : (
        <FlatList
          data={data}
          style={styles.listContainer}
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
  );
};

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    display: 'flex',
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#f5f6f7',
    alignItems: 'flex-start',
    elevation: 4,
  },
  cardData: {
    flex: 1,
    width: '60%',
  },
  cardActions: {
    flex: 1,
    width: '40%',
    flexDirection: 'row',
  },
  timestamp: {
    marginTop: 10,
    fontSize: 12,
    color: colors.text,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    color: Colors.deepPurpleA700,
  },
});

export default Dashboard;
