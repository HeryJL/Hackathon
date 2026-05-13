import React, { useState, useEffect } from 'react';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Camera, 
  ChevronRight, Check, AlertCircle, FileText,
  ArrowLeft, Save, X
} from 'lucide-react';

const COLORS = {
  primary: '#2E7D32', // Un vert plus profond et pro
  secondary: '#45a049',
  dark: '#1a1a1a',
  light: '#ffffff',
  gray: '#71717a',
  border: '#e4e4e7',
  bg: '#fafafa',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

// Composant Badge épuré
const Badge = ({ status }) => {
  const map = {
    PENDING: { label: 'En attente', bg: '#fef3c7', color: '#b45309' },
    APPROVED: { label: 'Approuvé', bg: '#dcfce7', color: '#15803d' },
    REJECTED: { label: 'Rejeté', bg: '#fee2e2', color: '#b91c1c' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '6px', background: s.bg, color: s.color,
      fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>{s.label}</span>
  );
};

const Avatar = ({ src, name, size = 80 }) => {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  return src ? (
    <img src={`http://localhost:3000/${src}`} alt="avatar"
      style={{ width: size, height: size, borderRadius: '20px', objectFit: 'cover', border: `1px solid ${COLORS.border}` }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '20px', background: '#f4f4f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: COLORS.gray, fontSize: size * 0.35, fontWeight: 600, border: `1px solid ${COLORS.border}`
    }}>{initials}</div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formProfile, setFormProfile] = useState({ nomComplet: '', telephone: '', adresseLivraison: '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({ farmName: '', farmLocation: '', description: '', document: null });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchProfileAndRequests(); }, []);

  const fetchProfileAndRequests = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        api.get('/profile'),
        api.get('/seller-requests'),
      ]);
      setProfile(profileRes.data);
      setFormProfile({
        nomComplet: profileRes.data.nomComplet || '',
        telephone: profileRes.data.telephone || '',
        adresseLivraison: profileRes.data.adresseLivraison || '',
      });
      setSellerRequests(requestsRes.data);
    } catch (err) {
      setError('Impossible de charger les données du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nomComplet', formProfile.nomComplet);
    formData.append('telephone', formProfile.telephone);
    formData.append('adresseLivraison', formProfile.adresseLivraison);
    if (avatarFile) formData.append('avatar', avatarFile);
    try {
      const res = await api.put('/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProfile(res.data);
      setEditing(false);
    } catch { setError('Erreur lors de la mise à jour.'); }
  };

  const isProducteur = profile?.user?.isProducteur || false;
  const latestRequest = sellerRequests[0] || null;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: COLORS.bg }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, border: `3px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, color: COLORS.dark, padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', color: COLORS.gray, cursor: 'pointer', fontSize: '14px' }}>
            <ArrowLeft size={18} /> Retour
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>Paramètres du compte</h1>
          <div style={{ width: 80 }}></div> 
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fef2f2', border: `1px solid #fee2e2`, color: COLORS.danger, borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: 10, fontSize: '14px' }}>
            <AlertCircle size={18} /> {error}
          </motion.div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          
          {/* Section 1: Identité */}
          <section style={{ background: COLORS.light, borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ position: 'relative' }}>
                  <Avatar src={avatarPreview || profile?.avatar} name={profile?.nomComplet} size={90} />
                  {editing && (
                    <label style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: COLORS.primary, color: '#fff', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '3px solid #fff' }}>
                      <Camera size={16} />
                      <input type="file" hidden onChange={(e) => {
                        const file = e.target.files[0];
                        setAvatarFile(file);
                        if (file) setAvatarPreview(URL.createObjectURL(file));
                      }} />
                    </label>
                  )}
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px 0' }}>{profile?.nomComplet || 'Utilisateur'}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: COLORS.gray, fontSize: '14px' }}>
                    <Mail size={14} /> {profile?.user?.email}
                  </div>
                </div>
              </div>
              {!editing && (
                <button onClick={() => setEditing(true)} style={{ padding: '8px 16px', borderRadius: '10px', border: `1px solid ${COLORS.border}`, background: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Modifier le profil
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {editing ? (
                <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleProfileUpdate} style={{ display: 'grid', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="input-group">
                      <label style={labelStyle}>Nom complet</label>
                      <input style={inputStyle} value={formProfile.nomComplet} onChange={e => setFormProfile({...formProfile, nomComplet: e.target.value})} />
                    </div>
                    <div className="input-group">
                      <label style={labelStyle}>Téléphone</label>
                      <input style={inputStyle} value={formProfile.telephone} onChange={e => setFormProfile({...formProfile, telephone: e.target.value})} />
                    </div>
                  </div>
                  <div className="input-group">
                    <label style={labelStyle}>Adresse de livraison</label>
                    <textarea style={{...inputStyle, minHeight: '80px'}} value={formProfile.adresseLivraison} onChange={e => setFormProfile({...formProfile, adresseLivraison: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="submit" style={btnPrimary}><Save size={18} /> Enregistrer</button>
                    <button type="button" onClick={() => {setEditing(false); setAvatarPreview(null)}} style={btnSecondary}><X size={18} /> Annuler</button>
                  </div>
                </motion.form>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <InfoBlock icon={<Phone size={16}/>} label="Téléphone" value={profile?.telephone} />
                  <InfoBlock icon={<MapPin size={16}/>} label="Adresse" value={profile?.adresseLivraison} />
                </div>
              )}
            </AnimatePresence>
          </section>

          {/* Section 2: Statut Professionnel */}
          <section style={{ background: COLORS.light, borderRadius: '20px', border: `1px solid ${COLORS.border}`, padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS.primary }}></div>
              Statut Professionnel
            </h3>

            {isProducteur ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#f0fdf4', borderRadius: '15px', border: '1px solid #dcfce7' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#166534' }}>Vous êtes un producteur certifié</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#15803d' }}>Gérez vos fermes et produits depuis votre tableau de bord.</p>
                </div>
                <button onClick={() => navigate('/espace-producteur')} style={{ background: COLORS.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  Mon Espace <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div>
                {!showRequestForm ? (
                  <div style={{ textAlign: 'center', padding: '20px', border: `2px dashed ${COLORS.border}`, borderRadius: '20px' }}>
                    {latestRequest ? (
                      <div style={{ textAlign: 'left' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <span style={{ fontWeight: 600 }}>Dernière demande</span>
                            <Badge status={latestRequest.status} />
                         </div>
                         <p style={{ fontSize: '14px', color: COLORS.gray }}>Soumis le {new Date(latestRequest.createdAt).toLocaleDateString()}</p>
                         {latestRequest.status === 'REJECTED' && (
                            <button onClick={() => setShowRequestForm(true)} style={{ marginTop: '15px', ...btnSecondary }}>Réessayer</button>
                         )}
                      </div>
                    ) : (
                      <>
                        <p style={{ color: COLORS.gray, marginBottom: '20px' }}>Vendez vos produits locaux directement aux consommateurs.</p>
                        <button onClick={() => setShowRequestForm(true)} style={btnPrimary}>Devenir producteur</button>
                      </>
                    )}
                  </div>
                ) : (
                  <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={(e) => { e.preventDefault(); /* ...votre logique... */ }} style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="input-group">
                        <label style={labelStyle}>Nom de la ferme</label>
                        <input style={inputStyle} placeholder="Ex: Ferme du Soleil" />
                      </div>
                      <div className="input-group">
                        <label style={labelStyle}>Localisation</label>
                        <input style={inputStyle} placeholder="Ville, Région" />
                      </div>
                    </div>
                    <div className="input-group">
                      <label style={labelStyle}>Description de l'activité</label>
                      <textarea style={{...inputStyle, minHeight: '80px'}} placeholder="Expliquez ce que vous produisez..." />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button type="submit" style={btnPrimary}>Envoyer la demande</button>
                      <button type="button" onClick={() => setShowRequestForm(false)} style={btnSecondary}>Annuler</button>
                    </div>
                  </motion.form>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

// Styles internes
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: COLORS.gray, marginBottom: '8px' };
const inputStyle = {
  width: '100%', border: `1px solid ${COLORS.border}`, borderRadius: '10px',
  padding: '12px 14px', fontSize: '15px', outline: 'none', background: '#fff',
  boxSizing: 'border-box', transition: 'all 0.2s ease', fontFamily: 'inherit'
};
const btnPrimary = {
  background: COLORS.primary, color: '#fff', border: 'none', borderRadius: '10px',
  padding: '12px 24px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
  display: 'flex', alignItems: 'center', gap: 8, transition: 'opacity 0.2s'
};
const btnSecondary = {
  background: '#fff', color: COLORS.dark, border: `1px solid ${COLORS.border}`, 
  borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontSize: '14px', 
  fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8
};

const InfoBlock = ({ icon, label, value }) => (
  <div style={{ padding: '16px', borderRadius: '12px', background: '#f8f8f8', border: '1px solid #f0f0f0' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: COLORS.gray, marginBottom: '8px' }}>
      {icon} <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </div>
    <div style={{ fontWeight: 600, fontSize: '15px' }}>{value || '—'}</div>
  </div>
);

export default Profile;