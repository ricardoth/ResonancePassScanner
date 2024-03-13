import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigation from './src/components/ui/navigation/DrawerNavigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <>
      <NavigationContainer>
        <DrawerNavigation />
      </NavigationContainer>
      <Toast />
    </>
  );
}