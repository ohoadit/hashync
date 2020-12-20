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
  Modal,
  Text,
  Alert,
} from 'react-native';
import Blowfish from 'egoroof-blowfish';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../utils/api';

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
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  modalWrapper: {
    display: 'flex',
    // marginTop: 50,
    // zIndex: 1,
    // backgroundColor: '#101010',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    width: '90%',
    height: '50%',
  },
});

const crypto = NativeModules.Aes;

const genHash = async () => {
  console.log(await crypto.pbkdf2('asdasdasd', 'adsasdfadsasd', 10000, 128));
};

const bf = new Blowfish('xda-developers', Blowfish.MODE.ECB);
const encoded = bf.encode('bcbcbc');
console.log(encoded);

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

  const [modal, setModal] = useState(true);

  const onFieldChange = useCallback(
    (name, value, index) => {
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

  const addField = () => {
    const secrets = [...fields.secrets];
    secrets.push(undefined);
    const err = [...errors.secrets];
    err.push(undefined);
    setFields({
      ...fields,
      secrets,
    });
    setErrors({
      ...errors,
      secrets: err,
    });
  };

  const deleteField = useCallback(
    (ind) => () => {
      const data = fields.secrets.filter((_f, i) => i !== ind);
      const err = errors.secrets.filter((_e, i) => i !== ind);
      setFields({
        ...fields,
        secrets: data,
      });
      setErrors({
        ...errors,
        secrets: err,
      });
    },
    [fields, errors, setFields, setErrors],
  );

  const renderMoreFields = useCallback(
    () =>
      fields.secrets.map((_s, ind) => {
        if (ind === fields.secrets.length - 1) {
          return;
        }
        return (
          <View style={styles.inputContainer} key={ind}>
            <Input
              password
              value={fields.secrets[ind + 1]}
              placeholder={`Secret Text - ${ind + 2}`}
              error={errors.secrets[ind + 1]}
              index={ind + 1}
              name="secrets"
              onFieldChange={onFieldChange}
            />
            <Button
              type="text"
              title="Remove"
              textColor="#f44336"
              styling={{
                position: 'absolute',
                top: -1,
                right: 45,
                width: 'auto',
                height: 35,
                paddingHorizontal: 10,
              }}
              onPress={deleteField(ind + 1)}
            />
          </View>
        );
      }),
    [fields, errors, onFieldChange, deleteField],
  );

  const onSave = useCallback(async () => {
    const errorKeys = {};
    let shouldModalOpen = true;
    Object.entries(fields).forEach(([key, value]) => {
      if (typeof value === 'object') {
        const err = [...errors[key]];
        value.forEach((_value, i) => {
          if (!_value) {
            err[i] = 'Should not be empty';
            shouldModalOpen = false;
          } else {
            err[i] = undefined;
          }
        });
        errorKeys[`${key}`] = err;
      } else {
        if (!value) {
          errorKeys[`${key}`] = 'Should not be empty';
          shouldModalOpen = false;
        } else {
          errorKeys[`${key}`] = undefined;
        }
      }
    });
    if (!shouldModalOpen) {
      setErrors(errorKeys);
    } else {
      const token = await getGenericPassword();
      const config = {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          auth: token.password,
        },
      };
      const body = {
        title: fields.title,
        secrets: fields.secrets,
        blob: encoded,
      };
      api
        .post('/entity', body, config)
        .then((res) => console.log(res))
        .catch((err) => Alert.alert('Error', err.response.data.msg));
    }
  }, [fields, errors, setErrors]);

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
              placeholder={
                fields.secrets.length > 1 ? 'Secret Text - 1' : 'Secret Text'
              }
              error={errors.secrets[0]}
              index={0}
              name="secrets"
              onFieldChange={onFieldChange}
            />
            {fields.secrets.length > 1 &&
              renderMoreFields(fields.secrets.length)}
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
          {/* <Modal transparent visible={modal}>
            <View style={styles.modalWrapper}>
            <Card styling={styles.modalContainer}>
              <Text>This is modal</Text>
            </Card>
            </View>
          </Modal> */}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddNew;
