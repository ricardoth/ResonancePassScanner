import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { DetailsScreen } from '../../details/DetailsScreen';
import { ScannerScreen } from '../../scanner/ScannerScreen';
import { HomeStack } from './HomeStack';
import { RootDrawerParamList } from '../../../types/RootTypes';
import { Colors } from '../../../theme/theme';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerNavigation() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                drawerStyle: {
                    backgroundColor: Colors.bgSurface,
                    width: 260,
                    borderRightWidth: 1,
                    borderRightColor: Colors.bgBorder,
                },
                drawerActiveTintColor: Colors.brandPrimary,
                drawerInactiveTintColor: Colors.textSecondary,
                drawerActiveBackgroundColor: 'rgba(245, 197, 24, 0.1)',
                drawerLabelStyle: {
                    fontSize: 15,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: Colors.bgSurface,
                },
                headerTintColor: Colors.textPrimary,
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    color: Colors.textPrimary,
                },
                headerShadowVisible: false,
            }}
        >
            <Drawer.Screen
                name="Home"
                component={HomeStack}
                options={{ title: 'Inicio' }}
            />
            <Drawer.Group screenOptions={{ drawerItemStyle: { height: 0 } }}>
                <Drawer.Screen name="Scanner" component={ScannerScreen} />
            </Drawer.Group>
            <Drawer.Screen
                name="Details"
                component={DetailsScreen}
                options={{ title: 'Tickets' }}
            />
        </Drawer.Navigator>
    );
}

export default DrawerNavigation;
