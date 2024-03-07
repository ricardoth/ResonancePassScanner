import React, { useState } from 'react'
import { Button, StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import Modal from 'react-native-modal';

interface CustomAlertProps {
    isVisible: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    messageText: string;
}

export const CustomAlert : React.FC<CustomAlertProps> = ({isVisible, onClose, type, messageText}) => {
    const getMessageAndIcon = () => {
        switch (type) {
          case 'success':
            return { message: messageText, icon: "✅" };
          case 'error':
            return { message: messageText, icon: "❌" };
          default:
            return { message: messageText, icon: "?" };
        }
      };
    
      const { message, icon } = getMessageAndIcon();
    
    return (
        <Modal isVisible={isVisible} onBackdropPress={onClose}>
            <View style={styles.modalContent}>
              <Text style={styles.icon}>{icon}</Text>
              <Text style={styles.message}>{message}</Text>
              <TouchableOpacity 
                    style={styles.button}
                    onPress={onClose}
                >
                    <Text>OK</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: {
      backgroundColor: 'white',
      padding: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'rgba(0, 0, 0, 0.1)',
    },
    icon: {
      fontSize: 48,
      marginBottom: 16,
    },
    message: {
      fontSize: 16,
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#FFCA2C',
      padding: 10,
      marginTop: 20,
      color: 'black',
      borderRadius: 20
  },
  });
