import React, {useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  NativeModules,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import Input from '../../components/Input';
import Button from '../../components/Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

const crypto = NativeModules.Aes;

const genHash = async () => {
  console.log(await crypto.pbkdf2('asdasdasd', 'adsasdfadsasd', 10000, 128));
};

// const bf = new Blowfish('xda-developers', Blowfish.MODE.ECB);
// const encoded = bf.encode(`bcbcbc`);
// console.log(encoded);

const AddNew = ({navigation}) => {
  // console.log(navigation)
  const [fields, setFields] = useState({
    title: undefined,
    secrets: [undefined],
  });

  const [errors, setErrors] = useState({
    title: undefined,
    secrets: [undefined],
  });

  const [loader, setLoader] = useState(false);

  const onFieldChange = useCallback(
    (name, value, index) => {
      console.log({name, value, index});
      if (errors[`${name}`]) {
        if (typeof errors[`${name}`] === 'object') {
          const currentError = [...errors[`${name}`]];
          currentError[index] = undefined;
          setErrors({
            ...errors,
            [name]: currentError,
          });
        } else {
          setErrors({...errors, [name]: undefined});
        }
      }
      if (typeof fields[`${name}`] === 'object') {
        const currentField = [...fields[name]];
        currentField[index] = value;
        setFields({
          ...fields,
          [name]: currentField,
        });
      } else {
        setFields({
          ...fields,
          [name]: value,
        });
      }
    },
    [fields, setFields, errors, setErrors],
  );

  const addField = () => {};

  const onSave = useCallback(async () => {
    const token = await getGenericPassword();
    const errorKeys = {};
    console.log(fields);
    // Object.entries(fields).forEach(([key, value]) => {
    //   console.log({key, value});
    //   if (!value) {
    //     errorKeys[`${key}`] = 'This field is required';
    //   } else {
    //     if (typeof value === 'object') {
    //     }
    //   }
    // });
    // setErrors(errorKeys);
  }, [fields, errors, setErrors, setLoader]);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} touchSoundDisabled>
        <ScrollView>
          <View style={styles.formWrapper}>
            <Input
              value={fields.title}
              error={errors.title}
              placeholder="Title"
              name="title"
              onFieldChange={onFieldChange}
            />
            <Input
              password
              value={fields.secrets[0]}
              placeholder="Secret Text"
              error={errors.secrets[0]}
              index={0}
              name="secrets"
              onFieldChange={onFieldChange}
            />
            <View style={styles.buttonContainer}>
              <Button
                title="Add More"
                theme="#e91e63"
                width="40%"
                // disabled={disabled}
                onPress={addField}
              />
              <Button
                title="Save"
                theme="#2196f3"
                width="40%"
                disabled={loader}
                onPress={onSave}
              />
            </View>
            <ActivityIndicator
              animating={loader}
              color="#3f51b5"
              size="large"
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddNew;
