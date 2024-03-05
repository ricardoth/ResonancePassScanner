import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { decrypAES } from '../../utils/decryptText';

const key = "claveAESparaDerivar";
const iv = "claveAESparaDerivar";

export const ScannerScreen = () => {
    const [ contentQR, setContentQR ] = useState('');

    useEffect(() => {
        const decryptado = decrypAES(contentQR, key);
        alert(decryptado)
    }, [contentQR,setContentQR])
    

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
            <Text style={styles.header}>Scan QR Code</Text>
            
            <QRCodeScanner 
                onRead={(data) => setContentQR(data.data)}
                reactivate={true}
                reactivateTimeout={500}
                showMarker={true}
                // topContent={
                //     <View>
                //         <Text>Scanner</Text>
                //     </View>
                // }
            />


            {/* <Text>{contentQR}</Text> */}
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
});