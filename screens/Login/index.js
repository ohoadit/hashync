import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../utils/api';
import colors from '../../colors';
import {setGenericPassword} from 'react-native-keychain';

const styles = StyleSheet.create({
  formWrapper: {
    width: '80%',
    backgroundColor: '#fff',
    // height: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

const Login = ({navigation}) => {
  const [fieldValues, setFieldValues] = useState({
    username: undefined,
    password: undefined,
  });

  const [errors, setErrors] = useState({
    username: undefined,
    password: undefined,
  });

  const [loader, setLoader] = useState(false);

  const onFieldChange = useCallback(
    (name, value) => {
      if (errors[`${name}`]) {
        setErrors({...errors, [name]: undefined});
      }
      setFieldValues({
        ...fieldValues,
        [name]: value,
      });
    },
    [fieldValues, setFieldValues, errors, setErrors],
  );

  const onLogInPressed = useCallback(async () => {
    Keyboard.dismiss();
    const errorKeys = {};
    Object.keys(fieldValues).forEach((field) => {
      const val = fieldValues[`${field}`];
      // console.log(val);
      if (!val) {
        return (errorKeys[`${field}`] = 'This field is required');
      }
      if (field === 'password' && val.length < 8) {
        errorKeys[`${field}`] = 'Minimum 8 characters are required';
      }
    });

    if (Object.keys(errorKeys).length !== 0) {
      setErrors(errorKeys);
      return;
    }
    setLoader(true);
    setErrors(errorKeys);
    // console.log(errors);
    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    try {
      const res = await api.post('/auth/login', fieldValues, config);
      if (res.data === 'success') {
        await setGenericPassword('authToken', `${res.headers.auth}`);
        setLoader(false);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      Alert.alert('Error', err.response.data.msg);
      setLoader(false);
    }
  }, [navigation, fieldValues, errors, setErrors]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Card styling={styles.formWrapper} wrapper>
          <Input
            value={fieldValues.username}
            error={errors.username}
            placeholder="Username"
            name="username"
            onFieldChange={onFieldChange}
          />
          <Input
            password
            value={fieldValues.password}
            placeholder="Password"
            error={errors.password}
            name="password"
            onFieldChange={onFieldChange}
          />
          <Button
            title="LOG IN"
            theme={colors.primary}
            customStyle={{width: '80%'}}
            disabled={loader}
            onPress={onLogInPressed}
          />
          {/* <View style={{marginTop: 25}}> */}
          {loader && (
            <ActivityIndicator
              animating={loader}
              color={colors.primary}
              size="large"
            />
          )}
          {/* </View> */}
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
