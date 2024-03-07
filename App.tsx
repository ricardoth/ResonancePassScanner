import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { DetailsScreen } from './src/components/details/DetailsScreen';
import { RootDrawerParamList } from './src/types/RootTypes';
import HomeScreen from './src/components/home/HomeScreen';
import { ScannerScreen } from './src/components/scanner/ScannerScreen';
import DrawerNavigation from './src/components/ui/navigation/DrawerNavigation';

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigation />
    </NavigationContainer>
  );
}