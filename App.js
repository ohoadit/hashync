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
import colors from './colors';

const Stack = createStackNavigator();

const {Navigator, Screen} = Stack;

export default function App() {
  const [auth, setAuth] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    (async () => {
      const credentials = await getGenericPassword();

      if (credentials) {
        setAuth(true);
      }
      setLoader(false);
    })();
  }, []);

  const setScreens = useCallback(() => {
    if (loader) {
      return (
        <Screen
          name="loading"
          component={Loading}
          options={{title: 'Hashync', headerStyle: {elevation: 0}}}
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
              title: route.params?.title || 'View Entity',
            })}
          />
          <Screen name="Login" component={Login} options={{title: 'Hashync'}} />
        </>
      );
    } else {
      return (
        <>
          <Screen name="Login" component={Login} options={{title: 'Hashync'}} />
          <Screen
            name="Dashboard"
            component={Dashboard}
            options={{headerLeft: 'hide'}}
          />
          <Screen
            name="Entity"
            component={Entity}
            options={({route}) => ({
              title: route.params?.title || 'View Entity',
            })}
          />
        </>
      );
    }
  }, [auth, loader]);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor={colors.tintColor} />
      <Navigator
        detachInactiveScreens
        screenOptions={{
          header: (props) => {
            return <MaterialAppbar {...props} />;
          },
        }}>
        {setScreens()}
      </Navigator>
    </NavigationContainer>
  );
}
