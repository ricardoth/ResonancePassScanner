import { createDrawerNavigator } from '@react-navigation/drawer'
import React from 'react'
import  HomeStack  from './HomeStack';

const Drawer = createDrawerNavigator();

function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeStack} options={{ drawerLabel: 'Home' }} />
        </Drawer.Navigator>
    )
}


export default DrawerNavigation;