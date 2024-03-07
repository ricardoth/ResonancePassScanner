import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { HomeScreenProps } from '../../types/RootTypes';
import axios from 'axios';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/BasicAuth';
import { Buffer } from 'buffer';
import { CustomDrowpdown } from '../ui/dropdown/CustomDrowpdown';

const URL_EVENTOS = environment.URL_API_DECIMATIO + "Evento";
const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;



const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
    const [eventos, setEventos] = useState([]);
    const [ selectedEvento, setSelectedEvento ] = useState<string | null>('');

    const fetchEventos = async () => {
        try {
            let response = await axios.get(URL_EVENTOS, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });

            const {data} = response.data;
            let activos = data.filter((e: any) => e.activo === true);

            const newOptions = activos.map((item: any) => ({
                value: item.idEvento,
                label: item.nombreEvento + ' - ' + item.lugar?.nombreLugar,
            }));

            setEventos(newOptions);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchEventos();
    }, []);
    
    const handleValueChange = (value: string | null) => {
        setSelectedEvento(value);
    }

    const handleNavigate = () => {
        navigation.navigate('Scanner', {
            itemId: selectedEvento
        });
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
        <Image style={styles.backImage} source={require('../../../assets/images/resonancePassBGWhite.png')}/>
        <Text style={styles.textEvento}>Seleccione un Evento</Text>

        <View style={{  alignItems: 'center', justifyContent: 'center' }}>
            <CustomDrowpdown 
                items={eventos}
                defaultValue={null}
                onValueChange={handleValueChange}
                placeholder='Seleccione'
            />
        </View>

        <TouchableOpacity 
            style={styles.button}
            onPress={handleNavigate}
        >
            <Text style={styles.text}>Comencemos</Text>
        </TouchableOpacity>
      </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold',
    },
    backImage: {
        width: 250,
        height: 180,
        marginTop: 10
    },
    button: {
        backgroundColor: '#FFCA2C',
        padding: 10,
        marginTop: 20,
        color: 'black',
        borderRadius: 20
    },
    text: {
        fontWeight: 'bold'
    },
    textEvento: {
        color: 'white',
        fontSize: 15,
        marginTop: 15
    }
});

export default HomeScreen;