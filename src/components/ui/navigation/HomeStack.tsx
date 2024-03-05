import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import HomeScreen from '../../home/HomeScreen';
import { DetailsScreen } from '../../details/DetailsScreen';

const Stack = createNativeStackNavigator();

function HomeStack () {
    return (
        <Stack.Navigator>
             <Stack.Screen name="Home" component={HomeScreen} />
             <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
    )
}

export default HomeStack;