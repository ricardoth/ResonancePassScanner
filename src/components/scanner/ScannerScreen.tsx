import React, { useEffect, useState } from 'react'
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { decrypAES } from '../../utils/decryptText';
import { environment } from '../../environment/environment.dev';
import axios from 'axios';
import { basicAuth } from '../../types/BasicAuth';
import { Buffer } from 'buffer';
import { CustomAlert } from '../ui/alerts/CustomAlert';

const key: string = "claveAESparaDerivar";
const iv: string = "claveAESparaDerivar";
const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;

const URL_VALIDAR_ACCESO_TICKET: string = `${environment.URL_API_DECIMATIO}TicketScanner/ValidarAccesoTicket`;

export const ScannerScreen = () => {
    const [ contentQR, setContentQR ] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [messageText, setMessageText] = useState('');
    const [ isActiveCamera, setIsActiveCamera ] = useState(false);

    const showSuccessAlert = () => {
        setAlertType('success');
        setIsAlertVisible(true);
      };
    
      const showErrorAlert = () => {
        setAlertType('error');
        setIsAlertVisible(true);
      };

    const validarAccesoTicket = async (paramText: string) => {
        try {
          
            let obj = JSON.parse(paramText);
            let rutDv = obj.RutUsuario;
            let splitter = rutDv.split('-');
            let body = {
                idTicket: obj.IdTicket,
                idEvento: obj.IdEvento,
                rut: splitter[0],
                dv: splitter[1]
            };

            let response = await axios.post(URL_VALIDAR_ACCESO_TICKET, body, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });
            const {data} = response.data;
            setMessageText(data.outputMessage);
            if (data.statusCode === 1) {
                showSuccessAlert();
            } else {
                showErrorAlert();
            }
            setIsActiveCamera(false);
            // console.log(contentQR)
            setContentQR('');

            // console.log(contentQR)
        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log(contentQR)
        if(contentQR != '') {
            const decryptado: string | null = decrypAES(contentQR, key);
            if (decryptado === null) {
                setMessageText("Ha ocurrido un error al leer el QR, debe ser un Ticket de Acceso válido");
                showErrorAlert();
            } else {
                validarAccesoTicket(decryptado);

            }
        }
    }, [ contentQR ])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
            <Text style={styles.header}>Scan QR Code</Text>
            {
                !isActiveCamera && 
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setIsActiveCamera(true)}
                >
                    <Text>Escanear</Text>
                </TouchableOpacity>
            }

            {
                isActiveCamera && 
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setIsActiveCamera(false)}
                >
                    <Text>Volver</Text>
                </TouchableOpacity>
            }

            {
                isActiveCamera && 
                <QRCodeScanner 
                    onRead={(e) => setContentQR(e.data)}
                    reactivate={true}
                    reactivateTimeout={500}
                    showMarker={true}
                />
            }

            <CustomAlert 
                isVisible={isAlertVisible}
                onClose={() => setIsAlertVisible(false)}
                type={alertType}
                messageText={messageText}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#FFCA2C',
        padding: 10,
        marginTop: 20,
        color: 'black',
        borderRadius: 20
    },
});