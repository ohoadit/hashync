import React from 'react';
import { Alert, StyleSheet, Pressable, Text } from 'react-native';
import styled from 'styled-components/native';

const getButtonColor = (disabled, color) => disabled ? '#fdfdfd' : color;

// 

const Contained = styled.Pressable`
    width: ${({ width }) => width || '60%' };
    height: 45px;
    align-items: center;
    background-color: ${({ theme }) => (typeof theme === 'string') ? theme : '#efefef'};
    margin: 35px 0px;
    justify-content: center;
    opacity: ${({ disabled }) => disabled ? 0.5 : 1};
    elevation: ${({ disabled }) => disabled ? 2 : 5};
    border-radius: 5px;
`
const ButtonText = styled.Text`
    color: ${({ textColor }) => textColor || '#fff'};
    font-size: 16px;
    font-weight: 500;
`;


const Button = ({ title, textColor, theme, width, onPress, disabled }) => (
    <Contained
        theme={theme}
        width={width}
        onPress={onPress}
        disabled={disabled}
        android_ripple={{ color: '#d1d1d1' }}
    >
        <ButtonText disabled={disabled} textColor={textColor}>
            {title}
        </ButtonText>
    </Contained>
);
export default Button;
