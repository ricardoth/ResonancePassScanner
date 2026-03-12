import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDateHour } from '../../utils/formatDate';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../theme/theme';

interface CardItemProps {
    item: any;
    checkSalidaTicket: (item: any) => void;
}

const STATUS_CONFIG = {
    valid: {
        accentColor: Colors.statusValid,
        bgColor:     Colors.statusValidBg,
        borderColor: Colors.statusValidBorder,
    },
    invalid: {
        accentColor: Colors.statusError,
        bgColor:     Colors.statusErrorBg,
        borderColor: Colors.statusErrorBorder,
    },
    duplicated: {
        accentColor: Colors.statusWarn,
        bgColor:     Colors.statusWarnBg,
        borderColor: Colors.statusWarnBorder,
    },
};

export const CardItem: React.FC<CardItemProps> = ({ item, checkSalidaTicket }) => {
    const isValid   = item.idEstadoTicket === 1;
    const isInvalid = item.idEstadoTicket === 2;
    const config    = isValid ? STATUS_CONFIG.valid : isInvalid ? STATUS_CONFIG.invalid : STATUS_CONFIG.duplicated;
    const canCheckOut = isValid && item.fechaHoraSalida === null;

    return (
        <View style={[styles.card, { borderColor: config.borderColor }]}>
            {/* Left accent bar */}
            <View style={[styles.accentBar, { backgroundColor: config.accentColor }]} />

            <View style={styles.content}>
                {/* Header: ticket ID + status badge */}
                <View style={styles.headerRow}>
                    <Text style={styles.ticketId}>Ticket #{item.idTicket}</Text>
                    <View style={[styles.badge, { borderColor: config.borderColor, backgroundColor: config.bgColor }]}>
                        <View style={[styles.badgeDot, { backgroundColor: config.accentColor }]} />
                        <Text style={[styles.badgeText, { color: config.accentColor }]}>
                            {item.estadoTicket}
                        </Text>
                    </View>
                </View>

                {/* Client name */}
                <Text style={styles.clientName}>
                    {item.nombres} {item.apellidoP} {item.apellidoM}
                </Text>

                {/* Event + Sector */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Evento</Text>
                        <Text style={styles.infoValue}>{item.nombreEvento}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Sector</Text>
                        <Text style={styles.infoValue}>{item.nombreSector}</Text>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Entry / exit times */}
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Entrada</Text>
                        <Text style={styles.timeValue}>{formatDateHour(item.fechaHoraEntrada)}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Salida</Text>
                        <Text style={styles.timeValue}>
                            {item.fechaHoraSalida ? formatDateHour(item.fechaHoraSalida) : '—'}
                        </Text>
                    </View>
                </View>

                {/* Checkout button — only for valid tickets without exit */}
                {canCheckOut && (
                    <TouchableOpacity
                        style={styles.checkoutButton}
                        onPress={() => checkSalidaTicket(item)}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.checkoutText}>Marcar Salida</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.bgSurface,
        borderRadius: Radius.lg,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        overflow: 'hidden',
        ...Shadow.sm,
    },
    accentBar: {
        width: 4,
    },
    content: {
        flex: 1,
        padding: Spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    ticketId: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.textMuted,
        letterSpacing: 0.5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 3,
        borderRadius: Radius.full,
        borderWidth: 1,
        gap: 4,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    infoRow: {
        flexDirection: 'row',
        gap: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    infoItem: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 10,
        color: Colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 13,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.bgBorder,
        marginVertical: Spacing.sm,
    },
    timeValue: {
        fontSize: 13,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    checkoutButton: {
        backgroundColor: Colors.bgElevated,
        borderRadius: Radius.sm,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        marginTop: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.bgBorderStrong,
    },
    checkoutText: {
        color: Colors.textPrimary,
        fontWeight: '600',
        fontSize: 13,
    },
});
