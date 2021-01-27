// import 'react-native-gesture-handler';
import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import MaterialAppbar from './components/MaterialAppbar';
import Login from './screens/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entity from './screens/Entity';
import Dashboard from './screens/Dashboard';
import Loading from './screens/Loading';
import colors from './colors';

const initialValue: Object = {
  auth: false,
  changeAuthState: () => {},
};

export const AuthContext = React.createContext(initialValue);

const Stack = createStackNavigator();

const {Navigator, Screen} = Stack;

export default function App() {
  const [auth, setAuth] = useState(false);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    (async () => {
      const credentials = await AsyncStorage.getItem('authToken');
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

  const changeAuthState = (authState) => {
    setAuth(authState);
  };

  return (
    <NavigationContainer>
      <AuthContext.Provider
        value={{auth: auth, changeAuthState: changeAuthState}}>
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
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
