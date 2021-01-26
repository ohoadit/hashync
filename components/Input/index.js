import React, {useState, useCallback, memo, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import colors from '../../colors';

const styles = StyleSheet.create({
  inputContainer: {
    display: 'flex',
    width: '80%',
    marginVertical: 7,
  },
  input: {
    fontSize: 16,
    color: '#404b69',
    backgroundColor: '#fff',
  },
});

const Input = ({
  onFieldChange,
  name,
  value,
  error,
  label,
  password,
  disabled,
  index,
}) => {
  const [fieldValue, setFieldValue] = useState(value);
  const [errorText, setErrorText] = useState(error);

  const onChange = useCallback(
    (val) => {
      setFieldValue(val);
      setErrorText(null);
      onFieldChange(name, val, index);
    },
    [name, onFieldChange, index, setFieldValue, setErrorText],
  );

  useEffect(() => setErrorText(error), [error]);

  useEffect(() => {
    setFieldValue(value);
  }, [value]);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={onChange}
          value={fieldValue}
          style={styles.input}
          editable={!disabled}
          autoCapitalize="none"
          secureTextEntry={password}
          spellCheck={false}
          error={!!errorText}
          label={label}
        />
        {errorText && (
          <HelperText type="error" visible>
            {errorText}
          </HelperText>
        )}
      </View>
    </>
  );
};

export default memo(Input);
