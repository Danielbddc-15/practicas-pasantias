import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ejercicios React Native</Text>
      </View>

      <View style={styles.buttonsContainer}>
        {/* Botón para Ejercicios de Botones */}
        <TouchableOpacity 
          style={[styles.exerciseButton, { backgroundColor: '#4CAF50' }]}
          onPress={() => router.push('/buttons')}
        >
          <Ionicons name="radio-button-on" size={24} color="white" />
          <Text style={styles.buttonText}>Botones</Text>
        </TouchableOpacity>

        {/* Botón para Cámara */}
        <TouchableOpacity 
          style={[styles.exerciseButton, { backgroundColor: '#FF9800' }]}
          onPress={() => router.push('/camera')}
        >
          <Ionicons name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Cámara</Text>
        </TouchableOpacity>

        {/* Botón para Navegación */}
        <TouchableOpacity 
          style={[styles.exerciseButton, { backgroundColor: '#2196F3' }]}
          onPress={() => router.push('/navigation')}
        >
          <Ionicons name="navigate" size={24} color="white" />
          <Text style={styles.buttonText}>Navegación</Text>
        </TouchableOpacity>

        {/* Botón para Menú */}
        <TouchableOpacity 
          style={[styles.exerciseButton, { backgroundColor: '#9C27B0' }]}
          onPress={() => router.push('/menu')}
        >
          <Ionicons name="menu" size={24} color="white" />
          <Text style={styles.buttonText}>Menú</Text>
        </TouchableOpacity>
      </View>

      {/* Footer simple */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Selecciona un ejercicio para comenzar</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  exerciseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 10,
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 16,
  },
});
