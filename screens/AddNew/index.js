import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
  StatusBar,
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
    width: '100%',
    height: '100%',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCard: {
    display: 'flex',
    width: '100%',
    // padding: '10%',
    backgroundColor: '#fff',
  },
});

const crypto = NativeModules.Aes;

const genRandomchars = () => {
  const chrs = Math.random().toString(16).substr(2);
  if (chrs === '') {
    return genRandomchars();
  } else {
    return chrs;
  }
};

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
  const [modal, setModal] = useState(false);
  const [topLevelError, setTopLevelError] = useState(undefined);
  const [topLevelKey, setTopLevelKey] = useState(undefined);

  const scrollRef = useRef();

  const onFieldChange = useCallback(
    (name, value, index) => {
      if (!name) {
        if (topLevelError) {
          setTopLevelError(undefined);
        }
        setTopLevelKey(value);
        return;
      }
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

  const onSubmit = useCallback(async () => {
    const errorKeys = {};
    Keyboard.dismiss();
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
      setModal(shouldModalOpen);
    }
  }, [fields, errors, setErrors]);

  const onSave = async () => {
    if (topLevelError) {
      setTopLevelError(undefined);
    }
    const authToken = await getGenericPassword();
    const config = {
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        auth: authToken.password,
      },
    };
    api
      .post('/appkey/verify', {key: topLevelKey}, config)
      .then(async (result) => {
        console.log(result.data);
        if (result.data.msg === 'success') {
          setModal(false);
          setLoader(true);
          const blob = `${genRandomchars()}${genRandomchars()}${genRandomchars()}${genRandomchars()}`;
          const hash = await crypto.pbkdf2(
            topLevelKey,
            blob,
            Number(result.data.payload),
            256,
          );
          const bf = new Blowfish(hash, Blowfish.MODE.ECB);
          const body = {
            title: fields.title,
            secrets: fields.secrets.map((value) => ({
              secret: bf.encode(value),
              blob,
            })),
          };
          console.log(body);
          api
            .post('/entity', body, config)
            .then((res) => {
              const d = new Uint8Array(res.data.a.data);
              console.log(typeof bf.decode(d));
              setLoader(false);
            })
            .catch((err) => {
              Alert.alert('Error', err.response.data.msg || err.message);
              setLoader(false);
            });
        }
      })
      .catch((err) => setTopLevelError(err.response.data.msg || err.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={'height'}>
      {modal && (
        <StatusBar
          barStyle="dark-content"
          backgroundColor="rgba(0, 0, 0, 0.7)"
        />
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} touchSoundDisabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current.scrollToEnd({animated: true})
          }>
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
                disabled={loader}
                onPress={addField}
              />
              <Button
                title="Save"
                theme="#3f51b5"
                width="40%"
                disabled={loader}
                onPress={onSubmit}
              />
            </View>
            <ActivityIndicator
              animating={loader}
              color="#3f51b5"
              size="large"
            />
          </View>
          <Modal transparent visible={modal}>
            {/* <KeyboardAvoidingView behavior={'height'}> */}
            <View style={styles.modalWrapper} onPress={() => setModal(false)}>
              <Card styling={styles.modalCard} wrapper>
                <Input
                  value={topLevelKey}
                  error={topLevelError}
                  placeholder="Please enter your key"
                  onFieldChange={onFieldChange}
                />
                <View style={styles.buttonContainer}>
                  <Button
                    title="Close"
                    theme="#e91e63"
                    width="40%"
                    onPress={() => setModal(false)}
                  />
                  <Button
                    title="Confirm"
                    theme="#3f51b5"
                    width="40%"
                    onPress={onSave}
                  />
                </View>
              </Card>
            </View>
            {/* </KeyboardAvoidingView> */}
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddNew;
