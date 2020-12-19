import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ActivityIndicator, Keyboard, NativeModules, TouchableWithoutFeedback } from 'react-native';
import Input from '../../components/Input';
import Button from '../../components/Button';

const styles = StyleSheet.create({
    formWrapper: {
        width: '100%',
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '20%',
    },
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

const crypto = NativeModules.Aes;

const genHash = async () => {
    console.log(await crypto.pbkdf2('asdasdasd', 'adsasdfadsasd', 10000, 128));
}

// const bf = new Blowfish('xda-developers', Blowfish.MODE.ECB);
// const encoded = bf.encode(`bcbcbc`);
// console.log(encoded);


const AddNew = ({ navigation }) => {
    // console.log(navigation)
    const [fields, setFields] = useState({
        title: undefined,
        secret: undefined,
    })

    const [errors, setErrors] = useState({
        title: undefined,
        secret: undefined,
    })

    const [loader, setLoader] = useState(false);

    const onFieldChange = useCallback((name, value) => {
        if (errors[`${name}`]) {
            setErrors({...errors, [name]: undefined});
        }
        setFields({
            ...fields,
            [name]: value,
        })
    }, [fields, setFields, errors, setErrors]);

    const onSave = useCallback(() => {
        
    }, [errors, setErrors, setLoader]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
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
                    value={fields.secret}
                    placeholder="Secret Text"
                    error={errors.secret}
                    name="secret"
                    onFieldChange={onFieldChange}
                />
                <Button
                    title="Save Data"
                    theme="#3f51b5"
                    width='80%'
                    // disabled={disabled}
                    onPress={onSave}
                />
                <View style={{ marginTop: 25 }}>
                    <ActivityIndicator animating={loader} color="#3f51b5" size="large" />
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
}

export default AddNew;
