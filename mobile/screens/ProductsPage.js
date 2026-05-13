import React, { useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Search, ShoppingCart } from 'lucide-react-native';

const products = [
  { id: '1', name: "Veau de Lait", cat: "ANIMAUX", price: 15500, img: "https://images.unsplash.com/photo-1547595628-c61a29f496f0?q=80&w=500" },
  { id: '2', name: "Panier de Saison", cat: "VEGETAL", price: 12000, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500" },
  { id: '3', name: "Poulet Fermier", cat: "ANIMAUX", price: 9500, img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=500" },
];

const ProductsPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Search color="#888" size={20} />
        <TextInput placeholder="Rechercher..." style={styles.input} />
      </View>
      
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.img }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.cat}>{item.cat}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()} AR</Text>
              <TouchableOpacity style={styles.addBtn}>
                <ShoppingCart color="white" size={16} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', padding: 15, paddingTop: 50 },
  searchBox: { flexDirection: 'row', backgroundColor: 'white', padding: 12, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  input: { marginLeft: 10, flex: 1 },
  card: { flex: 1, backgroundColor: 'white', margin: 8, borderRadius: 20, overflow: 'hidden', elevation: 3 },
  image: { width: '100%', height: 120 },
  info: { padding: 12 },
  cat: { fontSize: 10, color: '#4CAF50', fontWeight: 'bold' },
  name: { fontSize: 14, fontWeight: 'bold', marginVertical: 4 },
  price: { color: '#1B5E20', fontWeight: '900' },
  addBtn: { position: 'absolute', bottom: 10, right: 10, backgroundColor: '#1B5E20', padding: 8, borderRadius: 10 }
});

export default ProductsPage;