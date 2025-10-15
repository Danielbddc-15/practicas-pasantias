import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ButtonsScreen() {
  const [counter, setCounter] = useState(0);
  
  const showAlert = (message: string) => {
    Alert.alert('Botón', message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicios de Botones</Text>
      
      <View style={styles.buttonsContainer}>
        {/* Botón básico */}
        <TouchableOpacity 
          style={styles.basicButton}
          onPress={() => showAlert('Botón básico presionado')}
        >
          <Text style={styles.buttonText}>Botón Básico</Text>
        </TouchableOpacity>

        {/* Botón con ícono */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => showAlert('Botón con ícono')}
        >
          <Ionicons name="heart" size={20} color="white" />
          <Text style={styles.buttonText}>Con Ícono</Text>
        </TouchableOpacity>

        {/* Contador */}
        <TouchableOpacity 
          style={styles.counterButton}
          onPress={() => setCounter(counter + 1)}
        >
          <Text style={styles.buttonText}>Contador: {counter}</Text>
        </TouchableOpacity>

        {/* Botón de reset */}
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={() => setCounter(0)}
        >
          <Text style={styles.resetText}>Reset</Text>
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
  basicButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  iconButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  counterButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: '#FF9500',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetText: {
    color: 'white',
    fontSize: 14,
  },
});