import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const prepareCardColor = () => {
    const color = `rgb(${Math.random() * 205}, ${Math.random() * 205}, ${Math.random() * 205})`;
    return (
        color
    )
}

const styles = StyleSheet.create({
    card: {
        display: 'flex',
        flexBasis: '40%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginTop: 30,
        marginBottom: 10,
        marginHorizontal: 20,
        height: 100,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    }
})

const Card = ({ title, id }) => {

    return (
        <Pressable style={{ ...styles.card, backgroundColor: prepareCardColor()}} android_ripple={{ color: '#d1d1d1' }}>
            <Text style={styles.cardTitle}>
                {title}
            </Text>
        </Pressable>
    )
};

export default Card;