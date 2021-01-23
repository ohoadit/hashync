import React, {useState, useCallback, useRef, useEffect} from 'react';
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
  Alert,
} from 'react-native';
import {Modal, HelperText, TextInput} from 'react-native-paper';
import Blowfish from 'egoroof-blowfish';
import {getGenericPassword, resetGenericPassword} from 'react-native-keychain';
import Card from '../../components/Card';
import Input from '../../components/Input';
import {Button as CustomButton} from 'react-native-paper';
import Button from '../../components/Button';
import api from '../../utils/api';
import {Checkbox} from 'react-native-paper';

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
    marginTop: 25,
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
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalCard: {
    display: 'flex',
    width: '100%',
    // padding: '10%',
    backgroundColor: '#fff',
  },
  modalInput: {
    width: '90%',
    fontSize: 14,
    backgroundColor: 'transparent',
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

const getConfigHeaders = async () => {
  const authToken = await getGenericPassword();
  return {
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      auth: authToken.password,
    },
  };
};

const verifyAppKey = async (key) => {
  console.log(key);
  const res = await api.post('/appkey/verify', {key}, await getConfigHeaders());
  return res;
};

const Entity = ({route, navigation}) => {
  // console.log(navigation)
  const [fields, setFields] = useState({
    title: undefined,
    secrets: [undefined],
  });

  const [errors, setErrors] = useState({
    title: undefined,
    secrets: [undefined],
  });

  const [mode, setMode] = useState('ADD');

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [topLevelError, setTopLevelError] = useState(undefined);
  const [topLevelKey, setTopLevelKey] = useState(undefined);

  const scrollRef = useRef();

  const activeFieldIndex = useRef();
  const timeOutRef = useRef();

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

  const toggleFieldValue = useCallback(
    (fieldIndex) => () => {
      activeFieldIndex.current = fieldIndex;
      setModal(true);
    },
    [activeFieldIndex],
  );

  const viewFieldData = async () => {
    if (topLevelError) {
      setTopLevelKey(undefined);
      setTopLevelError(undefined);
    }
    try {
      const result = await verifyAppKey(topLevelKey);
      if (result.data.msg === 'success') {
        const tempSecrets = [...fields.secrets];
        const required = JSON.parse(tempSecrets[activeFieldIndex.current]);
        const hash = await crypto.pbkdf2(
          topLevelKey,
          required.blob,
          Number(result.data.payload),
          256,
        );
        const blowfish = new Blowfish(hash, Blowfish.MODE.ECB);
        tempSecrets[activeFieldIndex.current] = blowfish.decode(
          new Uint8Array(required.secret.data),
        );
        setFields({...fields, secrets: tempSecrets});
        setModal(false);
        setTopLevelKey(undefined);
        if (timeOutRef.current) {
          clearTimeout(timeOutRef.current);
        }
        timeOutRef.current = setTimeout(() => {
          navigation.goBack();
        }, 7000);
        // setFields();
      }
    } catch (err) {
      console.error(err);
      setTopLevelError(err.response?.data?.msg || err.message);
    }
  };

  const closeModal = () => {
    activeFieldIndex.current = null;
    setTopLevelError(undefined);
    setTopLevelKey(undefined);
    setModal(false);
  };

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
              password={
                mode === 'VIEW' ? activeFieldIndex.current !== ind + 1 : true
              }
              value={fields.secrets[ind + 1]}
              placeholder={`Secret Text - ${ind + 2}`}
              error={errors.secrets[ind + 1]}
              index={ind + 1}
              name="secrets"
              disabled={mode === 'VIEW'}
              onFieldChange={onFieldChange}
            />
            {mode === 'VIEW' && (
              <Checkbox.Item
                status={
                  activeFieldIndex.current === ind + 1 ? 'checked' : 'unchecked'
                }
                label="View Secret Text"
                theme="#880cef"
                color="#3f51b5"
                onPress={toggleFieldValue(ind + 1)}
              />
            )}
            {mode !== 'VIEW' && (
              <Button
                type="text"
                title="Remove"
                textColor="#f44336"
                customStyle={{
                  position: 'absolute',
                  top: -1,
                  right: 45,
                  width: 'auto',
                  height: 35,
                  paddingHorizontal: 10,
                }}
                onPress={deleteField(ind + 1)}
              />
            )}
          </View>
        );
      }),
    [fields, errors, mode, onFieldChange, deleteField, toggleFieldValue],
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
    verifyAppKey(topLevelKey)
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
          const blowF = new Blowfish(hash, Blowfish.MODE.ECB);
          const body = {
            title: fields.title,
            secrets: fields.secrets.map((value) => ({
              secret: blowF.encode(value),
              blob,
            })),
          };
          console.log(body);
          api
            .post('/entity/new', body, await getConfigHeaders())
            .then((res) => {
              console.log(res.data);
              setLoader(false);
            })
            .catch((err) => {
              Alert.alert('Error', err.response?.data?.msg || err.message);
              setLoader(false);
            });
        }
      })
      .catch((err) => {
        console.error(err);
        setTopLevelError(err.response?.data?.msg || err.message);
      });
  };

  useEffect(() => {
    if (route.params) {
      setMode('VIEW');
      setLoader(true);
      const {entityId} = route.params;
      (async () => {
        try {
          const res = await api.get(
            `/entity/${entityId}`,
            await getConfigHeaders(),
          );
          const {title, secrets} = res.data.data;
          setFields({
            title: title || '',
            secrets: secrets.map((sec, i) => {
              if (i > 0) {
                errors.secrets.push(undefined);
              }
              return JSON.stringify(sec);
            }),
          });
          console.log(fields);
        } catch (err) {
          Alert.alert('Error', err.response?.data?.msg || err.message, [
            {
              text: 'Okay',
              onPress: () => navigation.navigate('Dashboard'),
            },
          ]);
        }
        setLoader(false);
      })();
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior={'height'}>
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
                disabled={mode === 'VIEW'}
                onFieldChange={onFieldChange}
              />
              <Input
                password={
                  mode === 'VIEW' ? activeFieldIndex.current !== 0 : true
                }
                value={fields.secrets[0]}
                placeholder={
                  fields.secrets.length > 1 ? 'Secret Text - 1' : 'Secret Text'
                }
                error={errors.secrets[0]}
                index={0}
                name="secrets"
                disabled={mode === 'VIEW'}
                onFieldChange={onFieldChange}
              />
              {mode === 'VIEW' && (
                <Checkbox.Item
                  status={
                    activeFieldIndex.current === 0 ? 'checked' : 'unchecked'
                  }
                  label="View Secret Text"
                  color="#880cef"
                  onPress={toggleFieldValue(0)}
                />
              )}
              {fields.secrets.length > 1 &&
                renderMoreFields(fields.secrets.length)}
              {mode !== 'VIEW' && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Add More"
                    theme="#e91e63"
                    customStyle={{width: '40%'}}
                    disabled={loader}
                    onPress={addField}
                  />
                  <Button
                    title="Save"
                    theme="#3f51b5"
                    customStyle={{width: '40%'}}
                    disabled={loader}
                    onPress={onSubmit}
                  />
                </View>
              )}
              <ActivityIndicator
                animating={loader}
                color="#880cef"
                size="large"
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal visible={modal} contentContainerStyle={styles.modalWrapper}>
        <Card styling={styles.modalCard} wrapper>
          <TextInput
            value={topLevelKey}
            type="flat"
            style={styles.modalInput}
            error={topLevelError}
            label="Please enter your key"
            secureTextEntry
            onChangeText={(val) => onFieldChange(undefined, val)}
          />
          {topLevelError && (
            <HelperText type="error" visible>
              {topLevelError}
            </HelperText>
          )}
          <View style={styles.buttonContainer}>
            <CustomButton mode="outlined" onPress={closeModal}>
              Close
            </CustomButton>
            <CustomButton
              mode="contained"
              onPress={mode === 'VIEW' ? viewFieldData : onSave}>
              {mode === 'VIEW' ? 'Show' : 'Confirm'}
            </CustomButton>
          </View>
        </Card>
      </Modal>
    </>
  );
};

export default Entity;
