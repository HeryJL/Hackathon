import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import api from '../services/api';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    nomComplet: '', // Ajout du nom comme sur le Web
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation simple
    if (!formData.nomComplet || !formData.email || !formData.password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        nomComplet: formData.nomComplet,
        email: formData.email,
        password: formData.password,
      });
      
      alert("Compte créé avec succès !");
      navigation.navigate('Profil'); // Redirige vers le login
    } catch (error) {
      alert("Erreur : l'email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>S'inscrire</Text>
            <Text style={styles.subtitle}>Créez votre compte pour accéder au réseau</Text>
          </View>

          <View style={styles.form}>
            {/* Champ Nom Complet */}
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              placeholder="Jean Dupont"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={(val) => setFormData({...formData, nomComplet: val})}
            />

            {/* Champ Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="votre@email.com"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={(val) => setFormData({...formData, email: val})}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Champs Mot de passe en ligne (Grid comme sur le web) */}
            <View style={styles.row}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                  placeholder="••••••"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry
                  onChangeText={(val) => setFormData({...formData, password: val})}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.label}>Confirmation</Text>
                <TextInput
                  placeholder="••••••"
                  placeholderTextColor="#999"
                  style={styles.input}
                  secureTextEntry
                  onChangeText={(val) => setFormData({...formData, confirmPassword: val})}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.button, loading && {opacity: 0.7}]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "CHARGEMENT..." : "CRÉER MON COMPTE"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkContainer}>
              <Text style={styles.footerText}>
                Déjà un compte ? <Text style={styles.linkText}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1B5E20' // Fond vert comme sur ton web
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20 
  },
  card: {
    backgroundColor: '#1B5E20', // On garde le même ton ou un peu plus sombre
    borderRadius: 30,
    padding: 20,
  },
  header: { 
    marginBottom: 30, 
    alignItems: 'flex-start' 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#A5D6A7', 
    marginTop: 5 
  },
  label: {
    color: '#E8F5E9',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 15
  },
  form: { 
    width: '100%' 
  },
  input: {
    backgroundColor: '#144718', // Fond input sombre comme sur le web
    borderRadius: 25, // Coins très arrondis
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: '#0A2F0D', // Bouton vert très foncé (style green-950)
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16,
    letterSpacing: 1
  },
  linkContainer: {
    marginTop: 25,
  },
  footerText: {
    textAlign: 'center',
    color: '#A5D6A7',
    fontSize: 14,
  },
  linkText: { 
    color: '#fff', 
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
});

export default RegisterScreen;