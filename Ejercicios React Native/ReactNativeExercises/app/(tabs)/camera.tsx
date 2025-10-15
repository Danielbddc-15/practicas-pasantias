import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = React.useRef<CameraView>(null);

  if (!permission) {
    // Cargando permisos
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    // Sin permisos
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Ejercicio de Cámara</Text>
        <Text style={styles.message}>
          Necesitamos permisos para usar la cámara
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar Permisos</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const result = await cameraRef.current.takePictureAsync();
        if (result) {
          setPhoto(result.uri);
          Alert.alert('¡Foto tomada!', 'La foto se ha capturado correctamente');
        }
      } catch (error) {
        Alert.alert('Error', 'No se pudo tomar la foto');
      }
    }
  };

  if (photo) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Foto Capturada</Text>
        <Image source={{ uri: photo }} style={styles.photo} />
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={() => setPhoto(null)}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.buttonText}>Tomar Otra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Ejercicio de Cámara</Text>
      
      <CameraView 
        style={styles.camera} 
        facing="back"
        ref={cameraRef}
      >
        <View style={styles.cameraButtons}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Ionicons name="camera" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    margin: 20,
  },
  camera: {
    flex: 1,
    margin: 20,
    borderRadius: 15,
  },
  cameraButtons: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  captureButton: {
    backgroundColor: '#FF3B30',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    flex: 1,
    margin: 20,
    borderRadius: 15,
  },
  buttonsContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});