import { HStack, Spinner } from '@gluestack-ui/themed'
import React from 'react'
import { StyleSheet, Text } from 'react-native'

export const SpinnerLoader = () => {
    return (
        <HStack >
            <Spinner size={'large'}/>
            <Text style={styles.heading}>Cargando...</Text>
        </HStack> 
    )
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 18, 
        fontFamily: 'Helvetica', 
        marginBottom: 12, 
        color: '#fff'
    },
     
});