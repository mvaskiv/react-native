import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const HeaderButton = (props) => {
    return (
        <Text style={ props.side === 'right' ? styles.headerBtnRight : styles.headerBtnLeft }>
        {props.title}
        </Text>
    )
}

const styles = StyleSheet.create({
    headerBtnRight: {
        right: 10,
        padding: 12,
        fontSize: 16,
        color: '#2386c8',
    },
});