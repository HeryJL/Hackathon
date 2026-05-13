import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Image de fond qui couvre tout l'écran */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Overlay sombre pour rendre le texte lisible */}
        <View style={styles.overlay}>
          
          <View style={styles.content}>
            <Text style={styles.title}>
              Agriculture <Text style={{ color: '#81C784' }}>Durable</Text>{"\n"}
              & Élevage <Text style={{ color: '#81C784' }}>Responsable</Text>
            </Text>
            
            <Text style={styles.description}>
              La plateforme qui connecte directement les producteurs locaux avec les acheteurs passionnés.
            </Text>

            <View style={styles.btnRow}>
              <TouchableOpacity 
                style={styles.btnPrimary} 
                onPress={() => navigation.navigate('Produits')}
              >
                <Text style={styles.btnTextWhite}>Explorer</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.btnSecondary} 
                onPress={() => navigation.navigate('Profil')}
              >
                <Text style={styles.btnTextGreen}>Se Connecter</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B5E20',
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)', // Filtre noir semi-transparent (45%)
    justifyContent: 'center',
    padding: 25,
  },
  content: {
    marginTop: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: 'white',
    lineHeight: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  description: {
    fontSize: 18,
    color: '#F5F5F5',
    marginTop: 20,
    marginBottom: 40,
    lineHeight: 26,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    elevation: 5,
  },
  btnSecondary: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flex: 1,
    alignItems: 'center',
    elevation: 5,
  },
  btnTextWhite: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTextGreen: {
    color: '#1B5E20',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomePage;