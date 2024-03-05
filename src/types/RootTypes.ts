import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    Details: undefined;
    Scanner: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export interface DetailsScreenProps {
    navigation: DetailsScreenNavigationProp;
}