import { Card } from '@gluestack-ui/themed';
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { formatDateHour } from '../../utils/formatDate';

interface CardItemProps {
    item: any;
    checkSalidaTicket: any;
}

export const CardItem : React.FC<CardItemProps> = ({item, checkSalidaTicket}) => {
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
}

const styles = StyleSheet.create({
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
    },
});
  