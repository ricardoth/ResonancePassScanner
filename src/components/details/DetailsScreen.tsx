import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { DetailsScreenProps } from '../../types/RootTypes';
import { environment } from '../../environment/environment.dev';
import axios from 'axios';
import { basicAuth } from '../../types/BasicAuth';
import { Buffer } from 'buffer';
import { Card} from '@gluestack-ui/themed';
import { formatDateHour } from '../../utils/formatDate';
import { SpinnerLoader } from '../ui/spinner/SpinnerLoader';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { CustomDrowpdown } from '../ui/dropdown/CustomDrowpdown';
import { ListItem } from '../../types/Types';
import { CardItem } from './CardItem';

const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_TICKETS = `${environment.URL_API_DECIMATIO}TicketScanner`;
const URL_EVENTOS = environment.URL_API_DECIMATIO + "Evento";


export const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation }) => {
    const [tickets, setTickets] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); 
    const [ userInput, setUserInput ] = useState(""); 

    const fetchTickets = async (pageNum: any, isRefreshing = false, eventoParam: any = null) => {
        if (loading || (!hasMore && !isRefreshing)) return;

        try {
            let URL = `${URL_TICKETS}?PageSize=10&PageNumber=${pageNum}`;
            if(eventoParam !== null) {
                URL = URL + `&IdEvento=${eventoParam}`;
            }

            if (isRefreshing) {
                setTickets([]); 
                setPage(1);
                setHasMore(true); 
            }
            let response = await axios.get(URL, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });

            const {data} = response.data;
            if (data.length > 0) {
                setTickets(prevTickets => isRefreshing ? data : [...prevTickets, ...data]);
                setPage(prevPage => isRefreshing ? 2 : prevPage + 1);
            } else {
                setHasMore(false);
            }
        } catch (error: any) {
            console.log(error)
            setHasMore(false);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchTickets(page, true)
            setLoading(false);
            return () => {};
        }, [])
    );

    const handleLoadMore = async () => {
        if (!loading && hasMore) {
            await fetchTickets(page, false);
        }
    }

    const showToastOk = () => {
        Toast.show({
            type: 'success',
            text1: 'Atención!',
            text2: 'Se ha marcado la salida del evento'
        });
    }

    const showToastError = () => {
        Toast.show({
            type: 'error',
            text1: 'Atención!',
            text2: 'Ha ocurrido un error al marcar la salida del evento'
        });
    }
    
    const checkSalidaTicket = async (paramItem: any) => {
        try {
            let response = await axios.put(`${URL_TICKETS}/SalidaAccesoEvento?idAccesoEvento=${paramItem.idAccesoEvento}`, null, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });

            if (response.status === 200) {
                showToastOk();
                setRefreshing(true); 
                fetchTickets(1, true); 
                setRefreshing(false); 
            } else {
                showToastError();
            }
        } catch (error) {
            console.log(error)
            showToastError();
        }
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        setUserInput("");
        setLoading(true);
        await fetchTickets(1, true);
        setLoading(false);
    }

    const filterData = ({ item }: { item: ListItem }) => {
        if (userInput === "") {
           return <CardItem item={item} checkSalidaTicket={checkSalidaTicket}/>
        } 

        if (item.nombreEvento.toLowerCase().includes(userInput.toLowerCase())) {
            return <CardItem item={item} checkSalidaTicket={checkSalidaTicket}/>
        } else if (item.apellidoP.toLowerCase().includes(userInput.toLowerCase())) {
           return  <CardItem item={item} checkSalidaTicket={checkSalidaTicket}/>
        } else if (item.apellidoM.toLowerCase().includes(userInput.toLowerCase())) {
            return <CardItem item={item} checkSalidaTicket={checkSalidaTicket} />
        } else if (item.nombres.toLowerCase().includes(userInput.toLowerCase())) {
            return <CardItem item={item} checkSalidaTicket={checkSalidaTicket} />
        }
        return null;
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
            {
                loading ? 
                <SpinnerLoader /> : <View>
                    <View style={{backgroundColor: '#212529' }}>
                        <TextInput 
                            placeholder='Ingrese su búsqueda'
                            style={styles.stateText}
                            placeholderTextColor="#FFF"
                            onChangeText={(text) => {
                                setUserInput(text);
                            }}
                        />
                    </View>

                    <FlatList<ListItem>
                        data={tickets}
                        extraData={tickets}
                        keyExtractor={(item, index) => index.toString()} 
                        style={styles.listView}
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        renderItem={filterData}
                        onEndReached={() => handleLoadMore()}
                        onEndReachedThreshold={0.5}
                    />
                </View>
            } 
        </View>
    )
}

const styles = StyleSheet.create({
    listView: {
        width: 350,
        maxWidth: 360,
    },
    title: {
        fontSize: 18,
        color: '#fff'
    },
    stateText: {
        fontSize: 16, 
        color: '#fff'
    },
    icon: {
        width: 30,
        height: 30
    },
    textInput: {
        fontSize: 16, 
        color: '#fff',
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#FFF"
    }
});
  