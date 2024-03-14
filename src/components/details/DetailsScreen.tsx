import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
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

const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_TICKETS = `${environment.URL_API_DECIMATIO}TicketScanner`;

type ListItem = {
    idAccesoEvento: number;
    idTicket: number;
    idEvento: number;
    nombreEvento: string;
    idSector: number;
    nombreSector: string;
    nombres: string;
    apellidoP: string;
    apellidoM: string;
    fechaHoraEntrada: string;
    fechaHoraSalida: string;
    idEstadoTicket: number;
    estadoTicket: string;
}

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation }) => {
    const [tickets, setTickets] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [ loading, setLoading ] = useState(false);
    const [ refreshing, setRefreshing ] = useState(false); 

    const fetchTickets = async (pageNum: any, isRefreshing = false) => {
        if (loading || (!hasMore && !isRefreshing)) return;

        try {
            setLoading(true);
            if (isRefreshing) {
                setTickets([]); 
                setHasMore(true); 
            }
            let response = await axios.get(`${URL_TICKETS}?PageSize=10&PageNumber=${pageNum}`, {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${userBasicAuth}:${passBasicAuth}`).toString('base64')}`,
                }
            });

            const {data} = response.data;
            if (data.length > 0) {
                setTickets(prevTickets => isRefreshing ? data : prevTickets.concat(data));
                setPage(pageNum + 1);
            } else {
                setHasMore(false);
            }
            setLoading(false);
        } catch (error: any) {
            console.log(error)
            setHasMore(false);
        } finally {
            setLoading(false);
            if (isRefreshing) {
                setRefreshing(false);
            }
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchTickets(page, true);
        }, [])
    );

    useEffect(() => {
        fetchTickets(page, true);
    }, []);
    
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTickets(page);
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

    const handleRefresh = async() => {
        setRefreshing(true);
        await fetchTickets(1, true);
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
            {
                loading ? 
                <SpinnerLoader /> : 

                <FlatList<ListItem>
                    data={tickets}
                    extraData={tickets}
                    keyExtractor={(item, index) => index.toString()} 
                    style={styles.listView}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    renderItem={({ item }) => {
                        if (item.idEstadoTicket === 1) {
                            return (
                                <Card style={styles.cardValid} key={item.idAccesoEvento}>
                                    <Text style={styles.heading}>
                                        {item.idAccesoEvento} - N° Ticket: {item.idTicket}
                                   </Text>
                                    <Text style={styles.dateText}>
                                        Entrada: {formatDateHour(item.fechaHoraEntrada)}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        Salida: { item.fechaHoraSalida === null ? '-' : formatDateHour(item.fechaHoraSalida)}  
                                    </Text>
                                    <Text style={styles.stateText}>
                                        Estado: {item.estadoTicket} 
                                    </Text>
        
                                    <Card style={styles.box}>
                                        <Card>
                                            <Text style={styles.dateText}>
                                                Evento: {item.nombreEvento} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Sector: {item.nombreSector} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Cliente: {item.nombres} {item.apellidoP} {item.apellidoM}
                                            </Text>
                                        </Card>
                                    </Card>
                                    {
                                        item.idEstadoTicket === 1 ? 
                                            (item.fechaHoraSalida === null ? 
                                                <TouchableOpacity
                                                    style={styles.button}
                                                    onPress={() => checkSalidaTicket(item)}
                                                >
                                                    <Text style={styles.dateText}>Marcar Salida </Text>
                                                </TouchableOpacity> : '')
                                        : ''
                                    }
                                </Card>
                            )
                        } else if (item.idEstadoTicket === 2) {
                            return (
                                <Card style={styles.cardInvalid} key={item.idAccesoEvento}>
                                    <Text style={styles.heading}>
                                        {item.idAccesoEvento} - N° Ticket: {item.idTicket}
                                   </Text>
                                    <Text style={styles.dateText}>
                                        Entrada: {formatDateHour(item.fechaHoraEntrada)}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        Salida: { item.fechaHoraSalida === null ? '-' : formatDateHour(item.fechaHoraSalida)}  
                                    </Text>
                                    <Text style={styles.stateText}>
                                        Estado: {item.estadoTicket} 
                                    </Text>
        
                                    <Card style={styles.box}>
                                        <Card>
                                            <Text style={styles.dateText}>
                                                Evento: {item.nombreEvento} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Sector: {item.nombreSector} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Cliente: {item.nombres} {item.apellidoP} {item.apellidoM}
                                            </Text>
                                        </Card>
                                    </Card>
                                    
                                </Card>
                            )
                        } else {
                            return (
                                <Card style={styles.cardDuplicated} key={item.idAccesoEvento}>
                                    <Text style={styles.heading}>
                                        {item.idAccesoEvento} - N° Ticket: {item.idTicket}
                                   </Text>
                                    <Text style={styles.dateText}>
                                        Entrada: {formatDateHour(item.fechaHoraEntrada)}
                                    </Text>
                                    <Text style={styles.dateText}>
                                        Salida: { item.fechaHoraSalida === null ? '-' : formatDateHour(item.fechaHoraSalida)}  
                                    </Text>
                                    <Text style={styles.stateText}>
                                        Estado: {item.estadoTicket} 
                                    </Text>
        
                                    <Card style={styles.box}>
                                        <Card>
                                            <Text style={styles.dateText}>
                                                Evento: {item.nombreEvento} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Sector: {item.nombreSector} 
                                            </Text>
                                            <Text style={styles.dateText}>
                                                Cliente: {item.nombres} {item.apellidoP} {item.apellidoM}
                                            </Text>
                                        </Card>
                                    </Card>
                                    
                                </Card>
                            )
                        }
                        
                    }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                />
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
    cardValid: {
        padding: 15, 
        borderRadius: 16, 
        maxWidth: 360,
        marginVertical: 2,
        backgroundColor: '#198754',
    },
    cardInvalid: {
        padding: 15, 
        borderRadius: 16, 
        maxWidth: 360,
        marginVertical: 2,
        backgroundColor: '#dc3545',
    },
    cardDuplicated: {
        padding: 15, 
        borderRadius: 16, 
        maxWidth: 360,
        marginVertical: 2,
        backgroundColor: '#d39e00',
    },
    dateText: {
        fontSize: 14, 
        fontWeight: 'normal', 
        lineHeight: 20, 
        marginBottom: 2, 
        color: '#fff' 
    },
    stateText: {
        fontSize: 16, 
        color: '#fff'
    },
    vstack: {
        marginBottom: 8, 
    },
    heading: {
        fontSize: 18, 
        fontFamily: 'Helvetica', 
        marginBottom: 12, 
        color: '#fff'
    },
    box: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#212529',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    buttonDisabled: {
        backgroundColor: '#FF0000',
        padding: 10,
        borderRadius: 10,
        marginTop: 10
    },
    icon: {
        width: 30,
        height: 30
    }
});
  