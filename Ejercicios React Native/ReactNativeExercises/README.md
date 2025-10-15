# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

# React Native Exercises

Una aplicación completa de ejercicios prácticos de React Native que demuestra diversas funcionalidades y patrones de desarrollo móvil.

## 🚀 Características Principales

### Navegación
- **Tab Navigation**: Navegación por pestañas con íconos personalizados
- **Stack Navigation**: Navegación entre pantallas con paso de parámetros
- **Expo Router**: Sistema de enrutamiento basado en archivos
- **Modales**: Pantallas modales para contenido adicional

### Componentes Interactivos
- **Botones Avanzados**: 8 tipos diferentes de botones con animaciones
- **Menús**: Dropdown, Context Menu, Hamburger Menu, Action Sheet
- **Footers**: Componentes de pie de página reutilizables y personalizables
- **Cámara**: Integración completa con Expo Camera

### Funcionalidades Implementadas
✅ Botones con diferentes estados y animaciones  
✅ Cámara con previsualización y guardado en galería  
✅ Navegación Stack con parámetros  
✅ Menús desplegables y contextuales  
✅ Componentes Footer personalizables  
✅ Action Sheets para acciones múltiples  
✅ Modales personalizados  
✅ Animaciones y transiciones  

## 📱 Pantallas Incluidas

### 1. Home (Inicio)
- Vista general de todos los ejercicios
- Navegación rápida a cada sección
- Información sobre funcionalidades incluidas

### 2. Botones
- **Botón básico** con TouchableOpacity
- **Botones con íconos** (Like, Share)
- **Botón Toggle** con estado
- **Contador** con botones +/-
- **Botón animado** con Animated API
- **Diferentes tamaños** (pequeño, mediano, grande)

### 3. Cámara
- Cámara trasera y frontal
- Control de flash
- Tomar fotos con previsualización
- Guardar en galería del dispositivo
- Marco de enfoque visual
- Permisos de cámara y almacenamiento

### 4. Navegación
- Ejemplos de Stack Navigation
- Navegación con parámetros
- Métodos de Expo Router
- Navegación a modales
- Documentación de APIs

### 5. Menús y Componentes
- **Dropdown Menu**: Menú desplegable con opciones
- **Context Menu**: Menú contextual (long press)
- **Hamburger Menu**: Menú lateral deslizante
- **Action Sheet**: Hoja de acciones desde abajo
- **Modales**: Ventanas emergentes personalizadas
- **Footers**: 4 tipos diferentes de pie de página

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework principal
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Sistema de navegación
- **Expo Camera** - Funcionalidad de cámara
- **Expo Media Library** - Guardado en galería
- **React Native Animated** - Animaciones
- **Ionicons** - Íconos vectoriales
- **TypeScript** - Tipado estático

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil o emulador

### Pasos de instalación
1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación**
   ```bash
   # Iniciar el servidor de desarrollo
   npx expo start
   
   # Para Android
   npm run android
   
   # Para iOS (requiere macOS)
   npm run ios
   
   # Para web
   npm run web
   ```

## 📁 Estructura del Proyecto

```
ReactNativeExercises/
├── app/                          # Expo Router - Pantallas principales
│   ├── (tabs)/                   # Navegación por pestañas
│   │   ├── index.tsx            # Pantalla de inicio
│   │   ├── buttons.tsx          # Ejercicios de botones
│   │   ├── camera.tsx           # Funcionalidad de cámara
│   │   ├── navigation.tsx       # Ejemplos de navegación
│   │   ├── menu.tsx             # Menús y componentes
│   │   └── _layout.tsx          # Layout de pestañas
│   ├── stack-example.tsx        # Ejemplo de Stack Navigation
│   ├── modal.tsx               # Pantalla modal
│   └── _layout.tsx             # Layout principal
├── src/
│   ├── components/              # Componentes reutilizables
│   │   ├── Footer.js           # Componentes de footer
│   │   └── Menu.js             # Componentes de menú
├── assets/                     # Recursos (imágenes, fuentes)
├── package.json               # Dependencias del proyecto
└── README.md                  # Documentación
```

## 🎯 Casos de Uso Educativos

### Para Principiantes
- Aprende diferentes tipos de botones y sus implementaciones
- Entiende la navegación básica entre pantallas
- Familiarízate con los componentes básicos de React Native

### Para Desarrolladores Intermedios
- Implementa navegación compleja con parámetros
- Crea componentes reutilizables y personalizables
- Maneja permisos del dispositivo (cámara, almacenamiento)

### Para Desarrolladores Avanzados
- Optimiza rendimiento con animaciones nativas
- Implementa patrones de diseño complejos
- Crea sistemas de componentes escalables

## 📚 Recursos Adicionales

- [Documentación de Expo](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/)
- [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**¡Happy Coding! 🚀**

Desarrollado con ❤️ para la comunidad de React Native

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
