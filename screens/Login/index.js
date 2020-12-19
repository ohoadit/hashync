import React, { useState, useCallback } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Keyboard,
    Alert,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native'
import Input from '../../components/Input'
import Button from '../../components/Button'
import api from '../../utils/api'
import { setGenericPassword } from 'react-native-keychain'

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
})

const Login = ({ navigation }) => {
    const [fieldValues, setFieldValues] = useState({
        username: undefined,
        password: undefined,
    })

    const [errors, setErrors] = useState({
        username: undefined,
        password: undefined,
    })

    const [loader, setLoader] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const onFieldChange = useCallback(
        (name, value) => {
            if (errors[`${name}`]) {
                setErrors({ ...errors, [name]: undefined })
            }
            setFieldValues({
                ...fieldValues,
                [name]: value,
            })
        },
        [fieldValues, setFieldValues, errors, setErrors]
    )

    const onLogInPressed = useCallback(async () => {
        Keyboard.dismiss()
        const errorKeys = {}
        Object.keys(fieldValues).forEach(field => {
            const val = fieldValues[`${field}`]
            // console.log(val);
            if (!val) {
                return (errorKeys[`${field}`] = 'This field is required')
            }
            if (field === 'password' && val.length < 8) {
                errorKeys[`${field}`] = 'Minimum 8 characters are required'
            }
        })

        if (Object.keys(errorKeys).length !== 0) {
            setErrors(errorKeys)
            return
        }
        setLoader(true)
        setDisabled(true)
        setErrors(errorKeys)
        // console.log(errors);
        const config = {
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
        }
        try {
            const res = await api.post('/auth/login', fieldValues, config)
            console.log(res.data)
            if (res.data === 'success') {
                await setGenericPassword('authToken', `${res.headers['auth']}`)
                setLoader(false)
                setDisabled(false)
                navigation.navigate('Dashboard')
            }
        } catch (err) {
            Alert.alert('Error', err.response.data.msg)
            setLoader(false)
            setDisabled(false)
        }
    }, [fieldValues, errors, setErrors])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.formWrapper}>
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
                        theme="#3f51b5"
                        width="80%"
                        disabled={disabled}
                        onPress={onLogInPressed}
                    />
                    <View style={{ marginTop: 25 }}>
                        <ActivityIndicator animating={loader} color="#3f51b5" size="large" />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default Login
