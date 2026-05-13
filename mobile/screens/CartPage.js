import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Trash2, CheckCircle } from 'lucide-react-native';

const CartPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête avec titre et bouton de validation à côté */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Mon Panier</Text>
        
        <TouchableOpacity style={styles.topCheckoutBtn}>
          <CheckCircle color="white" size={18} style={{marginRight: 8}} />
          <Text style={styles.checkoutText}>Valider</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Résumé du total en haut de la liste */}
        <View style={styles.totalBanner}>
           <Text style={styles.totalText}>Total à payer : <Text style={styles.priceBold}>3.500 AR</Text></Text>
        </View>

        {/* Liste des items */}
        <View style={styles.item}>
          <View>
            <Text style={styles.itemName}>Tomates Bio</Text>
            <Text style={styles.itemPrice}>3.500 AR</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('Supprimer')}>
            <Trash2 color="#FF5252" size={20} />
          </TouchableOpacity>
        </View>

        {/* Espace vide en bas pour ne pas que le dernier item soit caché par le menu */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8F9FA',
  },
  header: { 
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#1B5E20'
  },
  topCheckoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#1B5E20',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
  },
  checkoutText: { 
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 14 
  },
  scrollContent: { 
    paddingHorizontal: 20,
  },
  totalBanner: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50'
  },
  totalText: {
    fontSize: 16,
    color: '#1B5E20'
  },
  priceBold: {
    fontWeight: 'bold',
    fontSize: 18
  },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemName: { 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  itemPrice: {
    color: '#666',
    marginTop: 4
  }
});

export default CartPage;