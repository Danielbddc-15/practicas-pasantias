import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function NavigationScreen() {
  const goToStack = () => {
    router.push('/stack-example');
  };

  const goToModal = () => {
    router.push('/modal');
  };

  const showInfo = () => {
    Alert.alert(
      'Navegación', 
      'Este ejercicio muestra cómo navegar entre pantallas'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicios de Navegación</Text>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.stackButton} onPress={goToStack}>
          <Ionicons name="layers" size={24} color="white" />
          <Text style={styles.buttonText}>Stack Navigation</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modalButton} onPress={goToModal}>
          <Ionicons name="apps" size={24} color="white" />
          <Text style={styles.buttonText}>Modal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoButton} onPress={showInfo}>
          <Ionicons name="information-circle" size={24} color="white" />
          <Text style={styles.buttonText}>Información</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  stackButton: {
    backgroundColor: '#2196F3',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  modalButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  infoButton: {
    backgroundColor: '#FF9800',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});