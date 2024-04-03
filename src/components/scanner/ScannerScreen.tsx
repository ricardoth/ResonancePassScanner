import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { decrypAES } from '../../utils/decryptText';
import { environment } from '../../environment/environment.dev';
import axios from 'axios';
import { basicAuth } from '../../types/BasicAuth';
import { Buffer } from 'buffer';
import { CustomAlert } from '../ui/alerts/CustomAlert';
import { ScannerScreenProps } from '../../types/RootTypes';
import { Toogle } from '../ui/toogle/Toogle';

const key: string = "claveAESparaDerivar";
const iv: string = "claveAESparaDerivar";
const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_VALIDAR_ACCESO_TICKET: string = `${environment.URL_API_DECIMATIO}TicketScanner/ValidarAccesoTicket`;

export const ScannerScreen : React.FC<ScannerScreenProps> = ({route, navigation}) => {
    const [ contentQR, setContentQR ] = useState('');
    const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
    const [alertType, setAlertType] = useState<'success' | 'error'>('success');
    const [messageText, setMessageText] = useState('');
    const [ isActiveCamera, setIsActiveCamera ] = useState(false);
    const [ isExtranjero, setIsExtranjero ] = useState(false);
    const { itemId } = route.params;

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
            let body;
            let obj = JSON.parse(paramText);
            if (isExtranjero) {
                body = {
                    idTicket: obj.IdTicket,
                    idEvento: obj.IdEvento,
                    correo: obj.Correo,
                    esExtranjero: isExtranjero,
                    dv: ""
                };
            } else {
                let rutDv = obj.RutUsuario;
                let splitter = rutDv.split('-');
                body = {
                    idTicket: obj.IdTicket,
                    idEvento: obj.IdEvento,
                    esExtranjero: isExtranjero,
                    correo: obj.Correo,
                    rut: splitter[0],
                    dv: splitter[1]
                };
            }

            if (body.idEvento !== itemId) {
                setMessageText('El Ticket no corresponde al evento, por favor ingrese un ticket válido');
                showErrorAlert();
                setIsActiveCamera(false);
                setContentQR(''); 
                return;
            }

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
            setContentQR('');
        } catch (error: any) {
            console.log(error)
        }
    }

    useEffect(() => {
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
            <Text style={styles.header}>Scan QR Code Ticket</Text>

            <Text style={styles.text}>¿Es Extranjero?</Text>
            <Toogle 
                isOn={isExtranjero}
                onToogle={setIsExtranjero}
                id={"toogleExtranjero"}
            />

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
    text: {
        fontSize: 15,
        color: 'white',
        marginTop: 30
    },
    button: {
        backgroundColor: '#FFCA2C',
        padding: 10,
        marginTop: 20,
        color: 'black',
        borderRadius: 20
    },
});