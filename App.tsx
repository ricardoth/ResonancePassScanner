import React from 'react';
import HomeScreen from './src/components/home/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DetailsScreen } from './src/components/details/DetailsScreen';
import { ScannerScreen } from './src/components/scanner/ScannerScreen';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            title: 'Inicio',
            headerStyle: {
              backgroundColor: '#FFCA2C',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{
            title: 'Detalles',
            headerStyle: {
              backgroundColor: '#FFCA2C',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen 
          name="Scanner" 
          component={ScannerScreen}
          options={{
            title: 'Scanner',
            headerStyle: {
              backgroundColor: '#FFCA2C',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
