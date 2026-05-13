import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as SecureStore from 'expo-secure-store';
import { Home, Package, ShoppingCart, User } from 'lucide-react-native';

// Import des écrans
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomePage from './screens/HomePage';
import ProductsPage from './screens/ProductsPage';
import CartPage from './screens/CartPage';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// C'est ici qu'on définit la "Sidebar" (version mobile en bas)
function MainTabs() {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#FFFFFF',
        tabBarStyle: { 
          backgroundColor: '#1B5E20', 
          height: 65, 
          borderTopLeftRadius: 20, 
          borderTopRightRadius: 20,
          position: 'absolute',
          borderTopWidth: 0
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomePage} 
        options={{ tabBarIcon: ({color}) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Produits" 
        component={ProductsPage} 
        options={{ tabBarIcon: ({color}) => <Package color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Panier" 
        component={CartPage} 
        options={{ tabBarIcon: ({color}) => <ShoppingCart color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Profil" 
        component={LoginScreen} // On met le login ici pour le profil
        options={{ tabBarIcon: ({color}) => <User color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* On affiche les Tabs en premier maintenant */}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}