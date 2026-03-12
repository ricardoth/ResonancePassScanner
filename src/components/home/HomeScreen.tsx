import React, { useEffect, useState } from 'react';
import {
    Image,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import axios from 'axios';
import { Buffer } from 'buffer';
import { environment } from '../../environment/environment.dev';
import { basicAuth } from '../../types/BasicAuth';
import { HomeScreenProps } from '../../types/RootTypes';
import { CustomDrowpdown } from '../ui/dropdown/CustomDrowpdown';
import { SpinnerLoader } from '../ui/spinner/SpinnerLoader';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../theme/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const URL_EVENTOS = environment.URL_API_DECIMATIO + 'Evento';
const userBasicAuth: string = basicAuth.username;
const passBasicAuth: string = basicAuth.password;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [eventos, setEventos] = useState([]);
    const [selectedEvento, setSelectedEvento] = useState<string | null>('');
    const [loading, setLoading] = useState(false);

    const fetchEventos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(URL_EVENTOS, {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${userBasicAuth}:${passBasicAuth}`
                    ).toString('base64')}`,
                },
            });

            const { data } = response.data;
            const activos = data.filter((e: any) => e.activo === true);
            const newOptions = activos.map((item: any) => ({
                value: item.idEvento,
                label: item.nombreEvento + ' — ' + item.lugar?.nombreLugar,
            }));

            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setEventos(newOptions);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventos();
    }, []);

    const handleNavigate = () => {
        navigation.navigate('Scanner', { itemId: selectedEvento });
    };

    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Image
                    style={styles.logo}
                    source={require('../../../assets/images/resonancePassBGWhite.png')}
                    resizeMode="contain"
                />
            </View>

            {/* Event selector card */}
            <View style={styles.card}>
                <Text style={styles.cardLabel}>Seleccione un Evento</Text>
                {loading ? (
                    <SpinnerLoader />
                ) : (
                    <CustomDrowpdown
                        items={eventos}
                        defaultValue={null}
                        onValueChange={setSelectedEvento}
                        placeholder="Seleccione un evento"
                    />
                )}
            </View>

            {/* CTA */}
            <TouchableOpacity
                style={styles.button}
                onPress={handleNavigate}
                activeOpacity={0.8}
            >
                <Text style={styles.buttonText}>Comencemos</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.bgPrimary,
        paddingHorizontal: Spacing.lg,
    },
    logoContainer: {
        marginBottom: Spacing.xl,
        alignItems: 'center',
    },
    logo: {
        width: 220,
        height: 160,
    },
    card: {
        width: '100%',
        backgroundColor: Colors.bgSurface,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.bgBorder,
        ...Shadow.sm,
    },
    cardLabel: {
        ...Typography.label,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: Spacing.md,
    },
    button: {
        backgroundColor: Colors.brandPrimary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.md,
        width: '100%',
        alignItems: 'center',
        ...Shadow.brand,
    },
    buttonText: {
        color: Colors.brandText,
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 0.5,
    },
});

export default HomeScreen;
