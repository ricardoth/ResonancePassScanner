import React, { useCallback, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/BasicAuth';
import { DetailsScreenProps } from '../../types/RootTypes';
import { ListItem } from '../../types/Types';
import { SpinnerLoader } from '../ui/spinner/SpinnerLoader';
import { CardItem } from './CardItem';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../theme/theme';

const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;
const URL_TICKETS = `${environment.URL_API_DECIMATIO}TicketScanner`;

export const DetailsScreen: React.FC<DetailsScreenProps> = () => {
    const [tickets, setTickets] = useState<ListItem[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [userInput, setUserInput] = useState('');

    const authHeader = () => ({
        Authorization: `Basic ${Buffer.from(
            `${userBasicAuth}:${passBasicAuth}`
        ).toString('base64')}`,
    });

    const fetchTickets = async (
        pageNum: number,
        isRefreshing = false,
        eventoParam: string | null = null
    ) => {
        if (loading || (!hasMore && !isRefreshing)) return;

        try {
            let url = `${URL_TICKETS}?PageSize=10&PageNumber=${pageNum}`;
            if (eventoParam) url += `&IdEvento=${eventoParam}`;

            if (isRefreshing) {
                setTickets([]);
                setPage(1);
                setHasMore(true);
            }

            const response = await axios.get(url, { headers: authHeader() });
            const { data } = response.data;

            if (data.length > 0) {
                setTickets(prev => (isRefreshing ? data : [...prev, ...data]));
                setPage(prev => (isRefreshing ? 2 : prev + 1));
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
            setHasMore(false);
        } finally {
            if (isRefreshing) setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchTickets(page, true).finally(() => setLoading(false));
            return () => {};
        }, [])
    );

    const handleLoadMore = () => {
        if (!loading && hasMore) fetchTickets(page, false);
    };

    const checkSalidaTicket = async (paramItem: ListItem) => {
        try {
            const response = await axios.put(
                `${URL_TICKETS}/SalidaAccesoEvento?idAccesoEvento=${paramItem.idAccesoEvento}`,
                null,
                { headers: authHeader() }
            );

            if (response.status === 200) {
                Toast.show({ type: 'success', text1: 'Atención!', text2: 'Se ha marcado la salida del evento' });
                fetchTickets(1, true);
            } else {
                Toast.show({ type: 'error', text1: 'Atención!', text2: 'Ha ocurrido un error al marcar la salida' });
            }
        } catch (error) {
            console.log(error);
            Toast.show({ type: 'error', text1: 'Atención!', text2: 'Ha ocurrido un error al marcar la salida' });
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        setUserInput('');
        await fetchTickets(1, true);
    };

    const filterData = ({ item }: { item: ListItem }) => {
        if (userInput === '') return <CardItem item={item} checkSalidaTicket={checkSalidaTicket} />;

        const q = userInput.toLowerCase();
        const matches =
            item.nombreEvento.toLowerCase().includes(q) ||
            item.apellidoP.toLowerCase().includes(q) ||
            item.apellidoM.toLowerCase().includes(q) ||
            item.nombres.toLowerCase().includes(q);

        return matches ? <CardItem item={item} checkSalidaTicket={checkSalidaTicket} /> : null;
    };

    const EmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎫</Text>
            <Text style={styles.emptyTitle}>Sin resultados</Text>
            <Text style={styles.emptyDescription}>
                {userInput
                    ? 'No se encontraron tickets para esta búsqueda'
                    : 'No hay tickets registrados aún'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <SpinnerLoader />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Search bar */}
            <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    placeholder="Buscar por nombre o evento..."
                    style={styles.searchInput}
                    placeholderTextColor={Colors.textMuted}
                    onChangeText={setUserInput}
                    value={userInput}
                />
                {userInput !== '' && (
                    <TouchableOpacity onPress={() => setUserInput('')}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FlatList<ListItem>
                data={tickets}
                extraData={tickets}
                keyExtractor={(_, index) => index.toString()}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                renderItem={filterData}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={<EmptyState />}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.bgPrimary,
        paddingTop: Spacing.md,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.bgPrimary,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.bgSurface,
        borderRadius: Radius.md,
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.bgBorder,
        ...Shadow.sm,
    },
    searchIcon: {
        fontSize: 15,
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: Colors.textPrimary,
        paddingVertical: 4,
    },
    clearIcon: {
        fontSize: 13,
        color: Colors.textMuted,
        paddingHorizontal: Spacing.xs,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: Spacing.xxl,
        paddingHorizontal: Spacing.xl,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: Spacing.md,
    },
    emptyTitle: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
    },
    emptyDescription: {
        ...Typography.body,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
});
