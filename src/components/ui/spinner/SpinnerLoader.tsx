import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Colors, Spacing, Typography } from '../../../theme/theme';

export const SpinnerLoader = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.brandPrimary} />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    text: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
});
