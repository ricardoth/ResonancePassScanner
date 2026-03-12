import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Colors, Spacing, Radius, Typography, Shadow } from '../../../theme/theme';

interface CustomAlertProps {
    isVisible: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    messageText: string;
}

const ALERT_CONFIG = {
    success: {
        icon: '✅',
        accentColor: Colors.statusValid,
        borderColor: Colors.statusValidBorder,
        bgColor: Colors.statusValidBg,
    },
    error: {
        icon: '❌',
        accentColor: Colors.statusError,
        borderColor: Colors.statusErrorBorder,
        bgColor: Colors.statusErrorBg,
    },
};

export const CustomAlert: React.FC<CustomAlertProps> = ({
    isVisible,
    onClose,
    type,
    messageText,
}) => {
    const config = ALERT_CONFIG[type] ?? ALERT_CONFIG.error;

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            backdropColor={Colors.overlay}
            backdropOpacity={1}
            animationIn="zoomIn"
            animationOut="zoomOut"
            animationInTiming={200}
            animationOutTiming={200}
        >
            <View style={styles.modalContent}>
                <View
                    style={[
                        styles.iconContainer,
                        { borderColor: config.borderColor, backgroundColor: config.bgColor },
                    ]}
                >
                    <Text style={styles.icon}>{config.icon}</Text>
                </View>

                <Text style={styles.message}>{messageText}</Text>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: config.accentColor }]}
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Entendido</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        backgroundColor: Colors.bgSurface,
        padding: Spacing.xl,
        borderRadius: Radius.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.bgBorder,
        ...Shadow.md,
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        marginBottom: Spacing.lg,
    },
    icon: {
        fontSize: 36,
    },
    message: {
        ...Typography.bodyLg,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        color: Colors.textSecondary,
        lineHeight: 24,
    },
    button: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xxl,
        borderRadius: Radius.md,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: Colors.bgPrimary,
        fontWeight: '700',
        fontSize: 15,
    },
});
