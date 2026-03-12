import React, { useEffect, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/BasicAuth';
import { ScannerScreenProps } from '../../types/RootTypes';
import { decrypAES } from '../../utils/decryptText';
import { CustomAlert } from '../ui/alerts/CustomAlert';
import { Toogle } from '../ui/toogle/Toogle';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../theme/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AES_KEY = 'claveAESparaDerivar';
const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_VALIDAR = `${environment.URL_API_DECIMATIO}TicketScanner/ValidarAccesoTicket`;

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ route }) => {
    const [contentQR, setContentQR] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [messageText, setMessageText] = useState('');
    const [isActiveCamera, setIsActiveCamera] = useState(false);
    const [isExtranjero, setIsExtranjero] = useState(false);
    const { itemId } = route.params;

    const toggleCamera = (value: boolean) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsActiveCamera(value);
    };

    const showAlert = (type: 'success' | 'error', message: string) => {
        setAlertType(type);
        setMessageText(message);
        setIsAlertVisible(true);
    };

    const validarAccesoTicket = async (paramText: string) => {
        try {
            const obj = JSON.parse(paramText);
            let body: any;

            if (isExtranjero) {
                body = {
                    idTicket: obj.IdTicket,
                    idEvento: obj.IdEvento,
                    correo: obj.Correo,
                    esExtranjero: true,
                    dv: '',
                };
            } else {
                const [rut, dv] = obj.RutUsuario.split('-');
                body = {
                    idTicket: obj.IdTicket,
                    idEvento: obj.IdEvento,
                    correo: obj.Correo,
                    esExtranjero: false,
                    rut,
                    dv,
                };
            }

            if (body.idEvento !== itemId) {
                showAlert('error', 'El Ticket no corresponde al evento, por favor ingrese un ticket válido');
                return;
            }

            const response = await axios.post(URL_VALIDAR, body, {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${userBasicAuth}:${passBasicAuth}`
                    ).toString('base64')}`,
                },
            });

            const { data } = response.data;
            showAlert(data.statusCode === 1 ? 'success' : 'error', data.outputMessage);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (contentQR !== '') {
            // Cerrar la cámara inmediatamente al detectar el QR — feedback instantáneo
            setIsActiveCamera(false);

            const decryptado = decrypAES(contentQR, AES_KEY);
            if (decryptado === null) {
                showAlert('error', 'Ha ocurrido un error al leer el QR, debe ser un Ticket de Acceso válido');
                setContentQR('');
            } else {
                validarAccesoTicket(decryptado).finally(() => setContentQR(''));
            }
        }
    }, [contentQR]);

    return (
        <View style={styles.container}>
            {/* Page header */}
            <View style={styles.header}>
                <Text style={styles.title}>Escanear Ticket</Text>
                <Text style={styles.subtitle}>Apunta la cámara al código QR del ticket</Text>
            </View>

            {/* Foreign visitor toggle */}
            <View style={styles.toggleCard}>
                <View style={styles.toggleRow}>
                    <View>
                        <Text style={styles.toggleLabel}>Visitante Extranjero</Text>
                        <Text style={styles.toggleDescription}>Activa para pasaporte en lugar de RUT</Text>
                    </View>
                    <Toogle
                        isOn={isExtranjero}
                        onToogle={setIsExtranjero}
                        id="toogleExtranjero"
                    />
                </View>
            </View>

            {/* Camera control */}
            {!isActiveCamera ? (
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => toggleCamera(true)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.primaryButtonText}>Iniciar Escaneo</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => toggleCamera(false)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.secondaryButtonText}>Detener</Text>
                </TouchableOpacity>
            )}

            {/* QR Scanner */}
            {isActiveCamera && (
                <QRCodeScanner
                    onRead={(e) => setContentQR(e.data)}
                    reactivate={true}
                    reactivateTimeout={500}
                    showMarker={true}
                />
            )}

            <CustomAlert
                isVisible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
                type={alertType}
                messageText={messageText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.bgPrimary,
        paddingTop: Spacing.xl,
    },
    header: {
        width: '100%',
        marginBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    title: {
        ...Typography.h2,
        marginBottom: Spacing.xs,
    },
    subtitle: {
        ...Typography.body,
        color: Colors.textSecondary,
    },
    toggleCard: {
        width: '100%',
        backgroundColor: Colors.bgSurface,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        marginHorizontal: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.bgBorder,
        ...Shadow.sm,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    toggleLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textPrimary,
    },
    toggleDescription: {
        ...Typography.caption,
        marginTop: 2,
    },
    primaryButton: {
        backgroundColor: Colors.brandPrimary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.md,
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        marginHorizontal: Spacing.lg,
        ...Shadow.brand,
    },
    primaryButtonText: {
        color: Colors.brandText,
        fontWeight: '700',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: Colors.bgElevated,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.md,
        width: '100%',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        marginHorizontal: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.bgBorderStrong,
    },
    secondaryButtonText: {
        color: Colors.textPrimary,
        fontWeight: '600',
        fontSize: 16,
    },
});
