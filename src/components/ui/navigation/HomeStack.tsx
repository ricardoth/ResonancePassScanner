import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react'
import HomeScreen from '../../home/HomeScreen';
import { ScannerScreen } from '../../scanner/ScannerScreen';
import { RootDrawerParamList, RootStackParamList } from '../../../types/RootTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="Scanner" component={ScannerScreen} options={{
                title: 'Scanner',
                headerStyle: {
                backgroundColor: '#FFCA2C',
                },
                headerTintColor: 'black',
                headerTitleStyle: {
                fontWeight: 'bold',
                },
            }}/>
        </Stack.Navigator>
    )
}
