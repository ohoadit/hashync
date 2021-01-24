import React from 'react';
import {Appbar} from 'react-native-paper';
import {resetGenericPassword} from 'react-native-keychain';

function MaterialAppbar({navigation, previous, scene}) {
  const openAddNewScreen = React.useCallback(() => {
    navigation.navigate('Entity');
  }, [navigation]);

  const logout = React.useCallback(async () => {
    if (await resetGenericPassword()) {
      navigation.pop();
    }
  }, [navigation]);

  return (
    <Appbar.Header>
      {previous && scene.descriptor.options.headerLeft !== 'hide' ? (
        <Appbar.BackAction onPress={navigation.goBack} />
      ) : null}
      <Appbar.Content
        title={scene.descriptor.options.title || scene.route.name}
      />
      {scene.route.name === 'Dashboard' && (
        <>
          <Appbar.Action icon="plus" color="white" onPress={openAddNewScreen} />
          <Appbar.Action icon="logout-variant" color="white" onPress={logout} />
        </>
      )}
    </Appbar.Header>
  );
}

export default React.memo(MaterialAppbar);
