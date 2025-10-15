import React, { createContext, useContext, useState, ReactNode } from 'react';

// Tipos para los idiomas soportados
export type Language = 'es' | 'en' | 'fr';

// Interfaz para el contexto del idioma
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

// Traducciones
const translations = {
  es: {
    // Login
    login: 'Iniciar Sesión',
    logout: 'Cerrar Sesión',
    username: 'Usuario',
    password: 'Contraseña',
    loginButton: 'Entrar',
    loginError: 'Usuario o contraseña incorrectos',
    welcomeBack: 'Bienvenido de nuevo',
    
    // General
    welcome: 'Bienvenido',
    selectLanguage: 'Seleccionar idioma',
    loading: 'Cargando...',
    
    // Navigation
    productManagement: 'Gestión de Productos',
    productList: 'Lista de Productos',
    
    // Products
    products: 'Productos',
    name: 'Nombre',
    price: 'Precio',
    description: 'Descripción',
    photo: 'Foto',
    addProduct: 'Agregar Producto',
    editProduct: 'Editar Producto',
    deleteProduct: 'Eliminar Producto',
    product: 'Producto',
    noProducts: 'No hay productos',
    
    // Photo
    takePhoto: 'Tomar Foto',
    retakePhoto: 'Tomar Nueva Foto',
    photoRequired: 'La foto es obligatoria',
    selectPhoto: 'Seleccionar Foto',
    
    // Languages
    spanish: 'Español',
    english: 'Inglés',
    french: 'Francés',
    
    // Actions
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    add: 'Agregar',
    
    // Messages
    productAdded: 'Producto agregado exitosamente',
    productUpdated: 'Producto actualizado exitosamente',
    productDeleted: 'Producto eliminado exitosamente',
    fillAllFields: 'Por favor completa todos los campos'
  },
  en: {
    // Login
    login: 'Login',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    loginError: 'Invalid username or password',
    welcomeBack: 'Welcome back',
    
    // General
    welcome: 'Welcome',
    selectLanguage: 'Select language',
    loading: 'Loading...',
    
    // Navigation
    productManagement: 'Product Management',
    productList: 'Product List',
    
    // Products
    products: 'Products',
    name: 'Name',
    price: 'Price',
    description: 'Description',
    photo: 'Photo',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    deleteProduct: 'Delete Product',
    product: 'Product',
    noProducts: 'No products',
    
    // Photo
    takePhoto: 'Take Photo',
    retakePhoto: 'Take New Photo',
    photoRequired: 'Photo is required',
    selectPhoto: 'Select Photo',
    
    // Languages
    spanish: 'Spanish',
    english: 'English',
    french: 'French',
    
    // Actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    
    // Messages
    productAdded: 'Product added successfully',
    productUpdated: 'Product updated successfully',
    productDeleted: 'Product deleted successfully',
    fillAllFields: 'Please fill all fields'
  },
  fr: {
    // Login
    login: 'Connexion',
    logout: 'Déconnexion',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    loginButton: 'Se connecter',
    loginError: 'Nom d\'utilisateur ou mot de passe incorrect',
    welcomeBack: 'Bon retour',
    
    // General
    welcome: 'Bienvenue',
    selectLanguage: 'Sélectionner la langue',
    loading: 'Chargement...',
    
    // Navigation
    productManagement: 'Gestion des Produits',
    productList: 'Liste des Produits',
    
    // Products
    products: 'Produits',
    name: 'Nom',
    price: 'Prix',
    description: 'Description',
    photo: 'Photo',
    addProduct: 'Ajouter un Produit',
    editProduct: 'Modifier le Produit',
    deleteProduct: 'Supprimer le Produit',
    product: 'Produit',
    noProducts: 'Aucun produit',
    
    // Photo
    takePhoto: 'Prendre une Photo',
    retakePhoto: 'Prendre une Nouvelle Photo',
    photoRequired: 'La photo est obligatoire',
    selectPhoto: 'Sélectionner une Photo',
    
    // Languages
    spanish: 'Espagnol',
    english: 'Anglais',
    french: 'Français',
    
    // Actions
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    
    // Messages
    productAdded: 'Produit ajouté avec succès',
    productUpdated: 'Produit mis à jour avec succès',
    productDeleted: 'Produit supprimé avec succès',
    fillAllFields: 'Veuillez remplir tous les champs'
  }
};

// Crear el contexto
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
  }
  return context;
};

// Proveedor del contexto
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('es');

  // Función para traducir
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};