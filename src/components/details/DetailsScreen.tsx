import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { DetailsScreenProps } from '../../types/RootTypes';
import { environment } from '../../environment/environment.dev';
import axios from 'axios';
import { basicAuth } from '../../types/BasicAuth';
import { Buffer } from 'buffer';
import { FlatList } from 'react-native-gesture-handler';

const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_TICKETS = `${environment.URL_API_DECIMATIO}Ticket`;

type ListItem = {
    idTicket: any;
    idEvento: any;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation }) => {
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            let response = await axios.get(URL_TICKETS, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });

            const {data} = response.data;
            setTickets(data);
        } catch (error: any) {
            
        }
    }

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>

            <FlatList<ListItem>
                data={tickets}
                keyExtractor={(item: any) => item.id}
                renderItem={({ item }) => (
                    <View key={item.idTicket} style={styles.item}>
                        <Text style={styles.title}>{item.idEvento}</Text>
                    </View>
                )}
            />

            <Button
                title="Volver al Inicio"
                onPress={() => navigation.navigate('Home')}
            />


        </View>
    )
}


const styles = StyleSheet.create({
    item: {
      backgroundColor: '#FFFF',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });
  