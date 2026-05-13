import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal
} from 'react-native';
import { 
  Mail, Phone, MapPin, Camera, 
  ChevronRight, ArrowLeft, Save, X, Building2
} from 'lucide-react-native';
import api from '../services/api';

const COLORS = {
  primary: '#1B5E20',
  secondary: '#4CAF50',
  bg: '#F5F5F5',
  white: '#FFFFFF',
  gray: '#71717a',
  border: '#e4e4e7',
  danger: '#ef4444',
  success: '#10b981'
};

const ProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // States pour les formulaires
  const [form, setForm] = useState({ nomComplet: '', telephone: '', adresseLivraison: '' });
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ 
    farmName: '', 
    farmLocation: '', 
    description: '' 
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
      setForm({
        nomComplet: res.data.nomComplet || '',
        telephone: res.data.telephone || '',
        adresseLivraison: res.data.adresseLivraison || '',
      });
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put('/profile', form);
      setProfile(res.data);
      setEditing(false);
      Alert.alert("Succès", "Profil mis à jour !");
    } catch (err) {
      Alert.alert("Erreur", "La mise à jour a échoué");
    }
  };

  // Fonction pour envoyer la demande de producteur
  const handleSubmitRequest = async () => {
    if (!requestForm.farmName || !requestForm.farmLocation) {
      Alert.alert("Champs requis", "Veuillez renseigner au moins le nom et le lieu de la ferme.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/seller-requests', requestForm);
      Alert.alert("Demande envoyée", "Votre demande est en cours de traitement par nos administrateurs.");
      setShowRequestModal(false);
      setRequestForm({ farmName: '', farmLocation: '', description: '' });
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'envoyer la demande. Réessayez plus tard.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusPress = () => {
    if (profile?.user?.isProducteur) {
      navigation.navigate('EspaceProducteur');
    } else {
      setShowRequestModal(true); 
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft color={COLORS.gray} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Section Identité */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              {profile?.avatar ? (
                <Image source={{ uri: `http://localhost:3000/${profile.avatar}` }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarText}>
                  {profile?.nomComplet?.charAt(0).toUpperCase() || 'U'}
                </Text>
              )}
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera color="#fff" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.nomComplet || "Utilisateur"}</Text>
          <View style={styles.emailBadge}>
            <Mail color={COLORS.gray} size={14} />
            <Text style={styles.userEmail}>{profile?.user?.email}</Text>
          </View>
        </View>

        {/* Formulaire / Infos */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations personnelles</Text>
            {!editing && (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editLink}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>

          {editing ? (
            <View style={styles.form}>
              <Text style={styles.label}>Nom complet</Text>
              <TextInput style={styles.input} value={form.nomComplet} onChangeText={(t) => setForm({...form, nomComplet: t})} />
              <Text style={styles.label}>Téléphone</Text>
              <TextInput style={styles.input} value={form.telephone} keyboardType="phone-pad" onChangeText={(t) => setForm({...form, telephone: t})} />
              <Text style={styles.label}>Adresse de livraison</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={form.adresseLivraison} multiline onChangeText={(t) => setForm({...form, adresseLivraison: t})} />
              <View style={styles.btnGroup}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
                  <Save color="#fff" size={20} />
                  <Text style={styles.saveBtnText}>Enregistrer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                  <X color={COLORS.danger} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoList}>
              <InfoRow icon={<Phone size={18} color={COLORS.primary} />} label="Téléphone" value={profile?.telephone} />
              <InfoRow icon={<MapPin size={18} color={COLORS.primary} />} label="Adresse" value={profile?.adresseLivraison} />
            </View>
          )}
        </View>

        {/* Section Statut Producteur */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Statut Professionnel</Text>
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={handleStatusPress}
            style={[styles.statusCard, profile?.user?.isProducteur ? styles.statusPro : styles.statusStandard]}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>
                {profile?.user?.isProducteur ? "Producteur Certifié" : "Compte Client"}
              </Text>
              <Text style={styles.statusDesc}>
                {profile?.user?.isProducteur ? "Gérez vos ventes et produits." : "Vendez vos produits locaux directement."}
              </Text>
            </View>
            <ChevronRight color={profile?.user?.isProducteur ? "#166534" : COLORS.gray} />
          </TouchableOpacity>
        </View>

        {/* --- MODAL DE DEMANDE PRODUCTEUR --- */}
        <Modal visible={showRequestModal} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Building2 color={COLORS.primary} size={24} />
                <Text style={styles.modalTitle}>Devenir Producteur</Text>
                <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                  <X color={COLORS.gray} size={24} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                <Text style={styles.label}>Nom de la ferme</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Ferme du Soleil"
                  onChangeText={(t) => setRequestForm({...requestForm, farmName: t})}
                />

                <Text style={styles.label}>Localisation</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Antsirabe, Madagascar"
                  onChangeText={(t) => setRequestForm({...requestForm, farmLocation: t})}
                />

                <Text style={styles.label}>Description de l'activité</Text>
                <TextInput 
                  style={[styles.input, { height: 100 }]} 
                  multiline 
                  placeholder="Que produisez-vous ? (Porcs, légumes, etc.)"
                  onChangeText={(t) => setRequestForm({...requestForm, description: t})}
                />

                <TouchableOpacity 
                  style={[styles.saveBtn, { marginTop: 10 }]} 
                  onPress={handleSubmitRequest}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <>
                      <Save color="#fff" size={20} />
                      <Text style={styles.saveBtnText}>Envoyer la demande</Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>{icon}</View>
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Non renseigné"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.white, margin: 20, padding: 20, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarContainer: { position: 'relative', marginBottom: 15 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 30, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  avatarImg: { width: 100, height: 100, borderRadius: 30 },
  avatarText: { fontSize: 40, fontWeight: 'bold', color: COLORS.primary },
  cameraBtn: { position: 'absolute', bottom: -5, right: -5, backgroundColor: COLORS.primary, padding: 8, borderRadius: 12, borderWidth: 3, borderColor: COLORS.white },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  emailBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 5 },
  userEmail: { color: COLORS.gray, fontSize: 14 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.gray },
  editLink: { color: COLORS.primary, fontWeight: 'bold' },
  form: { backgroundColor: COLORS.white, padding: 15, borderRadius: 15 },
  label: { fontSize: 13, color: COLORS.gray, marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: '#F9F9F9', borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 12, marginBottom: 15, color: '#000' },
  btnGroup: { flexDirection: 'row', gap: 10 },
  saveBtn: { flex: 1, backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, gap: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
  cancelBtn: { width: 60, borderWidth: 1, borderColor: COLORS.danger, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  infoList: { backgroundColor: COLORS.white, borderRadius: 15, padding: 10 },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 15, gap: 15 },
  infoIcon: { width: 40, height: 40, backgroundColor: '#F1F8E9', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoLabel: { fontSize: 12, color: COLORS.gray },
  infoValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  statusSection: { paddingHorizontal: 20 },
  statusCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 15, marginTop: 10, borderWidth: 1, elevation: 2 },
  statusPro: { backgroundColor: '#E8F5E9', borderColor: '#C8E6C9' },
  statusStandard: { backgroundColor: COLORS.white, borderColor: COLORS.border },
  statusTitle: { fontWeight: 'bold', fontSize: 16, color: '#1b5e20' },
  statusDesc: { fontSize: 12, color: '#666', marginTop: 2 },
  
  // Styles Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary }
});

export default ProfileScreen;