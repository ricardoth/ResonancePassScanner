import React from 'react'
import { Button, Text, View } from 'react-native'
import { DetailsScreenProps } from '../../types/RootTypes'

export const DetailsScreen: React.FC<DetailsScreenProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Details Screen</Text>
            <Button
                title="Go to Homer"
                onPress={() => navigation.navigate('Home')}
            />
        </View>
    )
}
