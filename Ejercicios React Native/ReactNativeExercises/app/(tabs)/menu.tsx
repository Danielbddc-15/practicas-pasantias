import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MenuScreen() {
  const [selectedOption, setSelectedOption] = useState('Inicio');

  const menuOptions = [
    { title: 'Inicio', icon: 'home' },
    { title: 'Perfil', icon: 'person' },
    { title: 'Configuración', icon: 'settings' },
    { title: 'Ayuda', icon: 'help-circle' },
  ];

  const handleMenuPress = (option: string) => {
    setSelectedOption(option);
    Alert.alert('Menú', `Seleccionaste: ${option}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicios de Menú</Text>
      
      <Text style={styles.selectedText}>
        Seleccionado: {selectedOption}
      </Text>
      
      <View style={styles.menuContainer}>
        {menuOptions.map((option, index) => (
          <TouchableOpacity 
            key={index}
            style={[
              styles.menuItem,
              selectedOption === option.title && styles.selectedItem
            ]}
            onPress={() => handleMenuPress(option.title)}
          >
            <Ionicons 
              name={option.icon as any} 
              size={24} 
              color={selectedOption === option.title ? '#fff' : '#333'} 
            />
            <Text style={[
              styles.menuText,
              selectedOption === option.title && styles.selectedMenuText
            ]}>
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Footer Simple</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    color: '#333',
  },
  selectedText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    gap: 15,
  },
  selectedItem: {
    backgroundColor: '#007AFF',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  selectedMenuText: {
    color: '#fff',
  },
  footer: {
    backgroundColor: '#333',
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
});