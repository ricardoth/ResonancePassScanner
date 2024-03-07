import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// export type RootDrawerParamList = {
//     Home: undefined;
//     Details: undefined;
//     Scanner: {itemId: string | null};
// };

export type RootStackParamList = {
    HomeScreen: undefined;
    Scanner: {itemId: string | null};

  };
  
  export type RootDrawerParamList = {
    Home: undefined;
    Details: undefined;
    Scanner: {itemId: string | null};
  };
  
  
export type HomeScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Home'>;
};
  
export type DetailsScreenProps = {
    navigation: DrawerNavigationProp<RootDrawerParamList, 'Details'>;
};
  
export type ScannerScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Scanner'>;
    route: RouteProp<RootStackParamList, 'Scanner'>;
}

