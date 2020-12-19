import React, { useState, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const styles = StyleSheet.create({
    inputContainer: {
        display: 'flex',
        width: '80%',
        marginVertical: 10,
        fontSize: 16,
    },
    input: {  
        height: 40,
        fontSize: 16,
        color: '#000',
        display: 'flex',
        alignItems: 'center',
        // paddingHorizontal: 10,
        borderBottomWidth: 2,
    },
    title: {
        fontSize: 18,
        marginBottom: 7,
        color: '#404b69',
    },
    errorContainer: {
        display: 'flex',
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    errorText: {
        color: '#ef5350',
        fontSize: 14,
    },
})

const setColor = (active, error, color) => {
    if (error) {
        return '#ef5350';
    }
    if (active) {
        return '#3f51b5';
    }
    if (!active) {
        return color;
    }
}

const Input = ({ onFieldChange, name, value, error, placeholder, password }) => {

    const onChange = useCallback(val => onFieldChange(name, val), [onFieldChange]);
    
    const [active, setActive] = useState(false);

    const onFocus = useCallback(() => setActive(true), [setActive]);
    const onBlur = useCallback(() => setActive(false), [setActive]);
    
    return (
        <>
        <View style={styles.inputContainer}>
            <Text style={{ ...styles.title, color: setColor(active, error, '#404b69') }}>{placeholder}</Text>
            <TextInput
                onChangeText={onChange}
                value={value}
                style={{ ...styles.input, borderColor: setColor(active, error, '#dedede')}}
                secureTextEntry={password}
                selectionColor={error ? '#ef5350' : '#3f51b5'}
                onBlur={onBlur}
                onFocus={onFocus}
            />
        </View>
        {error && 
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                    {error}
                </Text>
            </View>}
        </>
    )
};

export default memo(Input);
