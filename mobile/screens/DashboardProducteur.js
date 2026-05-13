import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { 
  Home, Leaf, Package, User, Plus, MapPin, 
  ChevronRight, LayoutDashboard, Sprout, ArrowLeft
} from 'lucide-react-native';
import api from '../services/api';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#1B5E20',
  secondary: '#4CAF50',
  bg: '#F8FAF9',
  white: '#FFFFFF',
  gray: '#71717a',
  border: '#e4e4e7',
  text: '#1a1a1a'
};

const EspaceProducteur = ({ navigation }) => {
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fermes');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, productsRes] = await Promise.all([
        api.get('/farms'),
        api.get('/products'),
      ]);
      setFarms(farmsRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      Alert.alert("Erreur", "Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  };

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.gray }}>Synchronisation...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={COLORS.text} size={24} />
        </TouchableOpacity>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>ESPACE PRODUCTEUR</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <User color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard icon={<Home size={20} color={COLORS.primary} />} label="Fermes" value={farms.length} />
          <StatCard icon={<Leaf size={20} color={COLORS.primary} />} label="Produits" value={products.length} />
          <StatCard icon={<Package size={20} color={COLORS.primary} />} label="Stock" value={totalStock} />
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'fermes' && styles.tabItemActive]} 
            onPress={() => setActiveTab('fermes')}
          >
            <Home size={18} color={activeTab === 'fermes' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.tabText, activeTab === 'fermes' && styles.tabTextActive]}>Mes fermes</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'produits' && styles.tabItemActive]} 
            onPress={() => setActiveTab('produits')}
          >
            <Leaf size={18} color={activeTab === 'produits' ? COLORS.primary : COLORS.gray} />
            <Text style={[styles.tabText, activeTab === 'produits' && styles.tabTextActive]}>Mes produits</Text>
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeTab === 'fermes' ? "Gestion des Fermes" : "Inventaire Produits"}
            </Text>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => activeTab === 'fermes' ? navigation.navigate('AddFarm') : navigation.navigate('AddProduct')}
            >
              <Plus color="#fff" size={20} />
            </TouchableOpacity>
          </View>

          {activeTab === 'fermes' ? (
            farms.length === 0 ? <EmptyState icon={<Sprout size={48} color="#ccc" />} text="Aucune ferme configurée" /> :
            farms.map(farm => (
              <TouchableOpacity key={farm.id} style={styles.farmCard} onPress={() => navigation.navigate('FarmDetail', { farm })}>
                <Image 
                  source={farm.images?.[0] ? { uri: `http://localhost:3000/${farm.images[0]}` } : require('../assets/placeholder-farm.png')} 
                  style={styles.farmImage} 
                />
                <View style={styles.farmInfo}>
                  <Text style={styles.farmName}>{farm.nom}</Text>
                  <View style={styles.locationRow}>
                    <MapPin size={12} color={COLORS.gray} />
                    <Text style={styles.locationText}>{farm.localisation}</Text>
                  </View>
                </View>
                <ChevronRight color={COLORS.border} size={20} />
              </TouchableOpacity>
            ))
          ) : (
            products.map(product => (
              <View key={product.id} style={styles.productRow}>
                <View style={styles.productIconBg}>
                   <Leaf size={16} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.productName}>{product.name || product.nom}</Text>
                  <Text style={styles.productSub}>{product.price || product.prix} Ar</Text>
                </View>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockText}>{product.stock || 0} pcs</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Composants internes
const StatCard = ({ icon, label, value }) => (
  <View style={styles.statCard}>
    <View style={styles.statIcon}>{icon}</View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const EmptyState = ({ icon, text }) => (
  <View style={styles.emptyState}>
    {icon}
    <Text style={styles.emptyText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 20, backgroundColor: COLORS.white 
  },
  headerBadge: { backgroundColor: COLORS.primary, paddingVertical: 6, paddingHorizontal: 15, borderRadius: 10 },
  headerBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  scrollContent: { padding: 15 },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 25 },
  statCard: { 
    flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 20, 
    alignItems: 'center', elevation: 2, shadowOpacity: 0.05 
  },
  statIcon: { marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.gray, textTransform: 'uppercase' },
  tabBar: { 
    flexDirection: 'row', backgroundColor: '#e2e8f0', borderRadius: 15, 
    padding: 5, marginBottom: 25 
  },
  tabItem: { 
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', 
    paddingVertical: 10, gap: 8, borderRadius: 12 
  },
  tabItemActive: { backgroundColor: COLORS.white },
  tabText: { fontSize: 14, color: COLORS.gray, fontWeight: '600' },
  tabTextActive: { color: COLORS.text },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
  addButton: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  farmCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, 
    padding: 12, borderRadius: 20, marginBottom: 12, elevation: 2 
  },
  farmImage: { width: 60, height: 60, borderRadius: 15, backgroundColor: '#f0f0f0' },
  farmInfo: { flex: 1, marginLeft: 15 },
  farmName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  locationText: { fontSize: 12, color: COLORS.gray },
  productRow: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, 
    padding: 15, borderRadius: 18, marginBottom: 10 
  },
  productIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  productName: { fontSize: 15, fontWeight: '600' },
  productSub: { fontSize: 12, color: COLORS.gray, fontWeight: 'bold' },
  stockBadge: { backgroundColor: '#F1F8E9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  stockText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  emptyState: { padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc', borderRadius: 20 }
});

export default DashboardProducteur;