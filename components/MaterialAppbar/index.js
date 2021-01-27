import React from 'react';
import {Appbar} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../../App';
import {Alert} from 'react-native';

function MaterialAppbar({navigation, previous, scene}) {
  const openAddNewScreen = React.useCallback(() => {
    navigation.navigate('Entity');
  }, [navigation]);

  const logout = React.useCallback(
    (changeAuthState) => async () => {
      await AsyncStorage.removeItem('authToken');
      changeAuthState(false);
      navigation.navigate('Login');
    },
    [navigation],
  );

  return (
    <AuthContext.Consumer>
      {({changeAuthState}) => (
        <Appbar.Header>
          {previous && scene.descriptor.options.headerLeft !== 'hide' ? (
            <Appbar.BackAction onPress={navigation.goBack} />
          ) : null}
          <Appbar.Content
            title={scene.descriptor.options.title || scene.route.name}
          />
          {scene.route.name === 'Dashboard' && (
            <>
              <Appbar.Action
                icon="plus"
                color="white"
                onPress={openAddNewScreen}
              />
              <Appbar.Action
                icon="logout-variant"
                color="white"
                onPress={() =>
                  Alert.alert(null, 'Are you sure you want to logout?', [
                    {
                      text: 'No',
                      style: 'cancel',
                    },
                    {text: 'Yes', onPress: logout(changeAuthState)},
                  ])
                }
              />
            </>
          )}
        </Appbar.Header>
      )}
    </AuthContext.Consumer>
  );
}

export default React.memo(MaterialAppbar);
