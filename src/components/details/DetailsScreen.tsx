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
import { CustomDrowpdown } from '../ui/dropdown/CustomDrowpdown';

const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_TICKETS = `${environment.URL_API_DECIMATIO}TicketScanner`;
const URL_EVENTOS = environment.URL_API_DECIMATIO + "Evento";

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
    const [eventos, setEventos] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false); 
    const [selectedEvento, setSelectedEvento] = useState<string | null>("");

    const fetchEventos = async () => {
        try {
            let response = await axios.get(`${URL_EVENTOS}`, {
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
        } catch (error: any) {
            console.log(error)
            setEventos([]);
        }
    }

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
            // setLoading(true);
            fetchEventos();
            // setLoading(false);
            return () => {};
        }, [])
    );

    useEffect(() => {
        fetchEventos();
    }, []);
    
    const handleLoadMore = async () => {
        if (!loading && hasMore) {
            setTickets([]);
            await fetchTickets(page, false, selectedEvento);
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
                fetchTickets(1, true, selectedEvento); 
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
        if (selectedEvento === null) {
            setTickets([]);
            Toast.show({
                type: 'error',
                text1: 'Atención!',
                text2: 'Debe seleccionar un evento'
            });
        } else {
            setRefreshing(true);
            setLoading(true);
            await fetchTickets(1, true, selectedEvento);
            setLoading(false);
        }
        
    }

    const handleChangeDropdown = (value: string | null) => {
        setSelectedEvento(value);
        if (value !== null) {
            fetchTickets(page, true, value);
        }
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
            <View>
                <CustomDrowpdown 
                    items={eventos}
                    defaultValue={null}
                    onValueChange={handleChangeDropdown}
                    placeholder='Seleccione el evento'
                />
            </View>
            
            {/* {
                loading ? 
                <SpinnerLoader /> :  */}

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
                    onEndReached={() => handleLoadMore()}
                    onEndReachedThreshold={0.5}
                />
            {/* }  */}
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
  