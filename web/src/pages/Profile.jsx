import React, { useState, useEffect } from 'react';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';

const colors = {
  primary: '#4CAF50',
  dark: '#2E7D32',
  darker: '#1B5E20',
  medium: '#388E3C',
  hover: '#45a049',
  lightBg: '#F1F8E9',
  lightBg2: '#E8F5E9',
  border: '#C8E6C9',
  textOnGreen: '#fff',
};

const Badge = ({ status }) => {
  const map = {
    PENDING: { label: 'En attente', bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
    APPROVED: { label: 'Approuvé', bg: '#E8F5E9', color: '#2E7D32', border: '#A5D6A7' },
    REJECTED: { label: 'Rejeté', bg: '#FFEBEE', color: '#B71C1C', border: '#FFCDD2' },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 12px', borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontSize: 13, fontWeight: 600, letterSpacing: 0.3,
    }}>{s.label}</span>
  );
};

const Avatar = ({ src, name, size = 72 }) => {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  return src ? (
    <img src={`http://localhost:3000/${src}`} alt="avatar"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${colors.primary}` }} />
  ) : (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.33, fontWeight: 700, letterSpacing: 1,
      border: `3px solid ${colors.dark}`,
    }}>{initials}</div>
  );
};

const inputStyle = {
  width: '100%', border: `1.5px solid ${colors.border}`, borderRadius: 10,
  padding: '10px 14px', fontSize: 15, outline: 'none', background: '#fff',
  boxSizing: 'border-box', transition: 'border-color 0.2s',
  fontFamily: 'inherit',
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
  const [focusedField, setFocusedField] = useState('');

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
      setError('Erreur chargement du profil');
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
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch { setError('Erreur mise à jour profil'); }
  };

  const handleSellerRequestSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('farmName', requestForm.farmName);
    formData.append('farmLocation', requestForm.farmLocation);
    formData.append('description', requestForm.description);
    if (requestForm.document) formData.append('document', requestForm.document);
    setSubmitting(true);
    try {
      await api.post('/seller-requests', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      const res = await api.get('/seller-requests');
      setSellerRequests(res.data);
      setShowRequestForm(false);
      setRequestForm({ farmName: '', farmLocation: '', description: '', document: null });
    } catch { setError("Erreur lors de l'envoi de la demande"); }
    finally { setSubmitting(false); }
  };

  const getLatestRequest = () => sellerRequests.length === 0 ? null : sellerRequests[0];
  const latestRequest = getLatestRequest();
  const isProducteur = profile?.user?.isProducteur || false;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.lightBg }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: `4px solid ${colors.border}`, borderTopColor: colors.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: colors.dark, fontWeight: 500 }}>Chargement...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  const card = {
    background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(46,125,50,0.08)',
    border: `1px solid ${colors.border}`, padding: '28px 32px', marginBottom: 24,
  };

  const fieldStyle = (name) => ({
    ...inputStyle,
    borderColor: focusedField === name ? colors.primary : colors.border,
    boxShadow: focusedField === name ? `0 0 0 3px rgba(76,175,80,0.15)` : 'none',
  });

  return (
    <div style={{ minHeight: '100vh', background: colors.lightBg, padding: '32px 16px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 5, height: 36, background: colors.primary, borderRadius: 4 }} />
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: colors.darker }}>Mon profil</h1>
        </div>

        {error && (
          <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14 }}>
            ⚠ {error}
          </div>
        )}

        {/* Carte identité */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Avatar src={profile?.avatar} name={profile?.nomComplet} />
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.darker }}>
                  {profile?.nomComplet || 'Nom non renseigné'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: 14, color: '#666' }}>{profile?.user?.email}</p>
                {isProducteur && (
                  <span style={{ display: 'inline-block', marginTop: 6, fontSize: 12, background: colors.lightBg2, color: colors.dark, border: `1px solid ${colors.border}`, borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                    ✓ Producteur
                  </span>
                )}
              </div>
            </div>
            {!editing && (
              <button onClick={() => setEditing(true)} style={{
                background: 'transparent', border: `1.5px solid ${colors.primary}`, color: colors.primary,
                borderRadius: 8, padding: '7px 16px', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = colors.primary; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = colors.primary; }}
              >
                Modifier
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleProfileUpdate}>
              <div style={{ display: 'grid', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Nom complet</label>
                  <input type="text" value={formProfile.nomComplet} style={fieldStyle('nomComplet')}
                    onFocus={() => setFocusedField('nomComplet')} onBlur={() => setFocusedField('')}
                    onChange={e => setFormProfile({ ...formProfile, nomComplet: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Téléphone</label>
                  <input type="tel" value={formProfile.telephone} style={fieldStyle('telephone')}
                    onFocus={() => setFocusedField('telephone')} onBlur={() => setFocusedField('')}
                    onChange={e => setFormProfile({ ...formProfile, telephone: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Adresse de livraison</label>
                  <textarea value={formProfile.adresseLivraison} rows={2} style={{ ...fieldStyle('adresse'), resize: 'vertical' }}
                    onFocus={() => setFocusedField('adresse')} onBlur={() => setFocusedField('')}
                    onChange={e => setFormProfile({ ...formProfile, adresseLivraison: e.target.value })} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Photo de profil</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    {(avatarPreview || profile?.avatar) && (
                      <Avatar src={avatarPreview ? undefined : profile?.avatar} name={formProfile.nomComplet} size={56} />
                    )}
                    <label style={{
                      display: 'inline-block', padding: '8px 16px', background: colors.lightBg2,
                      border: `1.5px dashed ${colors.primary}`, borderRadius: 8, cursor: 'pointer',
                      fontSize: 13, color: colors.dark, fontWeight: 500,
                    }}>
                      Choisir une image
                      <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                        const f = e.target.files[0];
                        setAvatarFile(f);
                        if (f) setAvatarPreview(URL.createObjectURL(f));
                      }} />
                    </label>
                    {avatarFile && <span style={{ fontSize: 13, color: '#666' }}>{avatarFile.name}</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="submit" style={{
                  background: colors.primary, color: '#fff', border: 'none', borderRadius: 9,
                  padding: '10px 24px', cursor: 'pointer', fontSize: 15, fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = colors.hover}
                  onMouseLeave={e => e.currentTarget.style.background = colors.primary}
                >Enregistrer</button>
                <button type="button" onClick={() => { setEditing(false); setAvatarPreview(null); }} style={{
                  background: '#f5f5f5', color: '#555', border: '1.5px solid #ddd', borderRadius: 9,
                  padding: '10px 20px', cursor: 'pointer', fontSize: 15,
                }}>Annuler</button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
              {[
                { label: 'Téléphone', val: profile?.telephone },
                { label: 'Adresse de livraison', val: profile?.adresseLivraison },
              ].map(({ label, val }) => (
                <div key={label} style={{ background: colors.lightBg, borderRadius: 10, padding: '12px 16px' }}>
                  <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: colors.medium, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 15, color: val ? '#222' : '#aaa' }}>{val || 'Non renseigné'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section Producteur */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: colors.lightBg2, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌱</div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: colors.darker }}>Statut producteur</h2>
          </div>

          {isProducteur ? (
            <div>
              <p style={{ color: colors.dark, fontWeight: 500, marginBottom: 16, fontSize: 15 }}>✅ Vous êtes producteur</p>
              <button onClick={() => navigate('/espace-producteur')} style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
                color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px',
                cursor: 'pointer', fontSize: 15, fontWeight: 600, letterSpacing: 0.3,
              }}>
                Accéder à mon espace →
              </button>
            </div>
          ) : (
            <>
              {latestRequest && latestRequest.status !== 'REJECTED' ? (
                <div style={{ background: colors.lightBg, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: '#666' }}>
                      Soumise le {new Date(latestRequest.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <Badge status={latestRequest.status} />
                  </div>
                  {latestRequest.comment && (
                    <p style={{ margin: '8px 0 0', fontSize: 14, color: '#555', borderLeft: `3px solid ${colors.primary}`, paddingLeft: 10 }}>
                      {latestRequest.comment}
                    </p>
                  )}
                  {latestRequest.status === 'APPROVED' && (
                    <p style={{ marginTop: 12, color: colors.dark, fontWeight: 500 }}>🎉 Félicitations ! Vous pouvez maintenant gérer vos produits.</p>
                  )}
                </div>
              ) : (
                !showRequestForm && (
                  <div>
                    <p style={{ color: '#666', fontSize: 14, marginBottom: 16 }}>
                      Rejoignez notre réseau de producteurs et vendez vos produits directement aux consommateurs.
                    </p>
                    <button onClick={() => setShowRequestForm(true)} style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.dark})`,
                      color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px',
                      cursor: 'pointer', fontSize: 15, fontWeight: 600,
                    }}>
                      Devenir producteur
                    </button>
                  </div>
                )
              )}

              {showRequestForm && (
                <form onSubmit={handleSellerRequestSubmit}>
                  <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: 20, display: 'grid', gap: 14 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: colors.darker }}>Demande de statut producteur</h3>
                    {[
                      { label: 'Nom de la ferme *', key: 'farmName', type: 'text', required: true },
                      { label: 'Localisation *', key: 'farmLocation', type: 'text', required: true },
                    ].map(({ label, key, type, required }) => (
                      <div key={key}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>{label}</label>
                        <input type={type} required={required} value={requestForm[key]} style={fieldStyle(key)}
                          onFocus={() => setFocusedField(key)} onBlur={() => setFocusedField('')}
                          onChange={e => setRequestForm({ ...requestForm, [key]: e.target.value })} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Description (activité, surface, etc.)</label>
                      <textarea rows={3} value={requestForm.description} style={{ ...fieldStyle('desc'), resize: 'vertical' }}
                        onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField('')}
                        onChange={e => setRequestForm({ ...requestForm, description: e.target.value })} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.dark, marginBottom: 6 }}>Document justificatif (PDF, image)</label>
                      <label style={{
                        display: 'inline-block', padding: '8px 16px', background: colors.lightBg2,
                        border: `1.5px dashed ${colors.primary}`, borderRadius: 8, cursor: 'pointer',
                        fontSize: 13, color: colors.dark, fontWeight: 500,
                      }}>
                        Choisir un fichier
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }}
                          onChange={e => setRequestForm({ ...requestForm, document: e.target.files[0] })} />
                      </label>
                      {requestForm.document && <span style={{ marginLeft: 10, fontSize: 13, color: '#666' }}>{requestForm.document.name}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button type="submit" disabled={submitting} style={{
                      background: submitting ? '#aaa' : colors.primary, color: '#fff',
                      border: 'none', borderRadius: 9, padding: '10px 24px',
                      cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600,
                    }}>{submitting ? 'Envoi...' : 'Envoyer la demande'}</button>
                    <button type="button" onClick={() => setShowRequestForm(false)} style={{
                      background: '#f5f5f5', color: '#555', border: '1.5px solid #ddd',
                      borderRadius: 9, padding: '10px 20px', cursor: 'pointer', fontSize: 15,
                    }}>Annuler</button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;