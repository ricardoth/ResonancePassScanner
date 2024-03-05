import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { HomeScreenProps } from '../../types/RootTypes';

const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#212529' }}>
        <Text style={styles.header}>Bienvenido a </Text>

        <Image style={styles.backImage} source={require('../../../assets/images/resonancePassBGWhite.png')}/>

        <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Scanner')}
        >
            <Text style={styles.text}>Empiece el Escaneo</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    header: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    backImage: {
        width: 300,
        height: 200,
        marginTop: 10
    },
    button: {
        backgroundColor: '#FFCA2C',
        padding: 10,
        marginTop: 20,
        color: 'black',
        borderRadius: 20
    },
    text: {
        fontWeight: 'bold'
    }
});

export default HomeScreen;