// import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialAppbar from './components/MaterialAppbar';
import Login from './screens/Login';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import Entity from './screens/Entity';
import Dashboard from './screens/Dashboard';
import Loading from './screens/Loading';

const Stack = createStackNavigator();

const {Navigator, Screen} = Stack;

const screens = {};

export default function App() {
  const [auth, setAuth] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    (async () => {
      const credentials = await getGenericPassword();

      if (credentials) {
        console.log(credentials);
        setAuth(true);
      }
      setLoader(false);
    })();
  }, []);

  const setScreens = useCallback(() => {
    if (loader) {
      return (
        <Screen
          name="Hashync"
          component={Loading}
          options={{title: null, headerStyle: {elevation: 0}}}
        />
      );
    } else if (auth) {
      return (
        <>
          <Screen
            name="Dashboard"
            component={Dashboard}
            options={{headerLeft: null}}
          />
          <Screen
            name="Entity"
            component={Entity}
            options={({route}) => ({
              title: route.params ? 'View Entity' : 'Add Entity',
            })}
          />
          <Screen name="Hashync" component={Login} />
        </>
      );
    }
  }, [auth, loader]);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#4400a6" />
      <Navigator
        screenOptions={{
          header: (props) => {
            console.log(JSON.stringify(props.scene));
            return <MaterialAppbar {...props} />;
          },
        }}>
        {setScreens()}
      </Navigator>
    </NavigationContainer>
  );
}
