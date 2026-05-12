import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import api from '../services/api'; // Import de votre fichier api

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
      });
      
      alert("Inscription réussie !");
      navigation.navigate('Login');
    } catch (error) {
      alert("Erreur lors de l'inscription. Vérifiez vos informations.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>Rejoignez la communauté de la ferme</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={(val) => setFormData({...formData, email: val})}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Mot de passe"
          style={styles.input}
          secureTextEntry
          onChangeText={(val) => setFormData({...formData, password: val})}
        />
        <TextInput
          placeholder="Confirmer le mot de passe"
          style={styles.input}
          secureTextEntry
          onChangeText={(val) => setFormData({...formData, confirmPassword: val})}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>S'INSCRIRE</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 20, justifyContent: 'center' },
  header: { marginBottom: 40, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1B5E20' }, // Vert foncé
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  form: { width: '100%' },
  input: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#388E3C', // Vert clair
    marginBottom: 25,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50', // Vert principal
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    elevation: 3,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkText: { textAlign: 'center', marginTop: 20, color: '#2E7D32', fontWeight: 'bold' },
});

export default RegisterScreen;