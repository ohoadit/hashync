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
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Headline} from 'react-native-paper';

const styles = StyleSheet.create({
  formWrapper: {
    width: '80%',
    backgroundColor: '#fff',
    // display: 'flex',
    // flexDirection: 'column',
    // alignItems: 'center',
  },
  container: {
    width: '100%',
    paddingTop: '25%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

const initialValues = {
  username: undefined,
  password: undefined,
};

const Login = ({navigation}) => {
  const [fieldValues, setFieldValues] = useState({...initialValues});

  const [errors, setErrors] = useState({...initialValues});

  const [loader, setLoader] = useState(false);

  const onFieldChange = useCallback(
    (name, value) => {
      if (errors[name]) {
        errors[name] = undefined;
      }
      fieldValues[name] = value;
      // console.log(fieldValues);
    },
    [fieldValues, errors],
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
        await AsyncStorage.setItem('authToken', `${res.headers.auth}`);
        setLoader(false);
        navigation.navigate('Dashboard');
      }
    } catch (err) {
      Alert.alert('Error', err.response.data.msg);
      setLoader(false);
    }
  }, [navigation, fieldValues, setErrors]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Headline>Let's get started</Headline>
        <Card styling={styles.formWrapper} wrapper>
          <Input
            value={fieldValues.username}
            error={errors.username}
            label="Username"
            name="username"
            customStyle={{width: '90%'}}
            onFieldChange={onFieldChange}
          />
          <Input
            password
            value={fieldValues.password}
            label="Password"
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
