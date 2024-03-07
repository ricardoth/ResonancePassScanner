import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import { DetailsScreen } from '../../details/DetailsScreen';
import { ScannerScreen } from '../../scanner/ScannerScreen';
import { HomeStack } from './HomeStack';
import { RootDrawerParamList } from '../../../types/RootTypes';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function DrawerNavigation() {
    return (
        <Drawer.Navigator initialRouteName="Home" screenOptions={{
            drawerStyle: {
              backgroundColor: '#FFCA2C',
            },
          }}>
            <Drawer.Screen name="Home" component={HomeStack} options={{
                title: 'Inicio',
                headerStyle: {
                backgroundColor: '#FFCA2C',
                },
                headerTintColor: 'black',
                headerTitleStyle: {
                fontWeight: 'bold',
                },
            }} />
            <Drawer.Group screenOptions={{drawerItemStyle: {height: 0}}}>
                <Drawer.Screen name="Scanner" component={ScannerScreen} />
            </Drawer.Group>
         
            <Drawer.Screen name="Details" component={DetailsScreen} options={{
                title: 'Detalles',
                headerStyle: {
                backgroundColor: '#FFCA2C',
                },
                headerTintColor: 'black',
                headerTitleStyle: {
                fontWeight: 'bold',
                },
            }}/> 
      </Drawer.Navigator>
    )
}


export default DrawerNavigation;