// import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {appbarStyle} from './styles/appbar';
import Login from './screens/Login';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import Entity from './screens/Entity';
import Dashboard from './screens/Dashboard';
import Loading from './screens/Loading';

const Stack = createStackNavigator();

const {Navigator, Screen} = Stack;

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
          name="Loading"
          component={Loading}
          options={{title: null, headerStyle: {elevation: 0}}}
        />
      );
    } else if (auth) {
      return (
        <>
          <Screen name="Dashboard" component={Dashboard} />
          <Screen
            name="Entity"
            component={Entity}
            options={({route}) => ({
              title: route.params ? 'View Entity' : 'Add Entity',
            })}
          />
          <Screen name="Login" component={Login} />
        </>
      );
    } else {
      return (
        <>
          <Screen name="Login" component={Login} />
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
        </>
      );
    }
  }, [auth, loader]);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Navigator screenOptions={appbarStyle}>{setScreens()}</Navigator>
    </NavigationContainer>
  );
}
