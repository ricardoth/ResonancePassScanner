import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    Scanner: {itemId: string | null};
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

type DetailsScreenNavigationProps = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export interface DetailsScreenProps {
    navigation: DetailsScreenNavigationProps;
}

type ScannerScreenNavigationProps = NativeStackNavigationProp<RootStackParamList, 'Scanner'>;

export interface ScannerScreenProps {
    route: RouteProp<RootStackParamList, 'Scanner'>;
    navigation: ScannerScreenNavigationProps;
}
