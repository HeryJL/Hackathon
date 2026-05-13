import React, { useState } from 'react';
import api from '../../service/api';
import { COLORS as C } from '../../constants/theme';

const inputStyle = (focused) => ({
  width: '100%',
  border: `1.5px solid ${focused ? C.primary : C.border}`,
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 15,
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxShadow: focused ? `0 0 0 3px rgba(76,175,80,0.15)` : 'none',
  fontFamily: 'inherit',
});

const AddFarmModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nom: '',
    localisation: '',
    certifie: false,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [focused, setFocused] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.localisation.trim()) {
      setError('Nom et localisation sont obligatoires.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('nom', form.nom);
      formData.append('localisation', form.localisation);
      formData.append('certifie', form.certifie);
      images.forEach(img => formData.append('images', img));

      const res = await api.post('/farms', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création de la ferme.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(27,94,32,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16,
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, maxWidth: 520, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.darker})`,
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🏡</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>Nouvelle ferme</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 14 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: 16 }}>
            {/* Nom */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Nom de la ferme <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.nom}
                placeholder="Ex: Ferme Ravelo"
                style={inputStyle(focused === 'nom')}
                onFocus={() => setFocused('nom')}
                onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, nom: e.target.value })}
              />
            </div>

            {/* Localisation */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Localisation <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.localisation}
                placeholder="Ex: Antsirabe, Vakinankaratra"
                style={inputStyle(focused === 'localisation')}
                onFocus={() => setFocused('localisation')}
                onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, localisation: e.target.value })}
              />
            </div>

            {/* Certification */}
            <div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: C.lightBg, borderRadius: 10, padding: '12px 16px',
                border: `1.5px solid ${form.certifie ? C.primary : C.border}`,
                transition: 'border-color 0.2s',
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                  background: form.certifie ? C.primary : '#fff',
                  border: `2px solid ${form.certifie ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {form.certifie && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                </div>
                <input
                  type="checkbox"
                  checked={form.certifie}
                  onChange={e => setForm({ ...form, certifie: e.target.checked })}
                  style={{ display: 'none' }}
                />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.darker }}>Ferme certifiée bio</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Cochez si votre ferme est certifiée biologique</p>
                </div>
              </label>
            </div>

            {/* Images */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Photos de la ferme <span style={{ color: '#888', fontWeight: 400 }}>(max 5)</span>
              </label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '20px', background: C.lightBg,
                border: `2px dashed ${C.primary}`, borderRadius: 10, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.lightBg2}
                onMouseLeave={e => e.currentTarget.style.background = C.lightBg}
              >
                <span style={{ fontSize: 28, marginBottom: 6 }}>📸</span>
                <span style={{ fontSize: 13, color: C.dark, fontWeight: 500 }}>Cliquez pour sélectionner des images</span>
                <span style={{ fontSize: 12, color: '#999', marginTop: 2 }}>JPG, PNG — max 5 fichiers</span>
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImageChange} />
              </label>

              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                  {previews.map((src, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: `2px solid ${C.border}` }} />
                      <button type="button" onClick={() => {
                        setPreviews(p => p.filter((_, j) => j !== i));
                        setImages(im => im.filter((_, j) => j !== i));
                      }} style={{
                        position: 'absolute', top: -6, right: -6, width: 20, height: 20,
                        background: '#e53935', border: 'none', borderRadius: '50%',
                        color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end', borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <button type="button" onClick={onClose} style={{
              background: '#f5f5f5', color: '#555', border: '1.5px solid #ddd',
              borderRadius: 9, padding: '10px 20px', cursor: 'pointer', fontSize: 14, fontWeight: 500,
            }}>Annuler</button>
            <button type="submit" disabled={submitting} style={{
              background: submitting ? '#aaa' : C.primary,
              color: '#fff', border: 'none', borderRadius: 9,
              padding: '10px 28px', cursor: submitting ? 'not-allowed' : 'pointer',
              fontSize: 14, fontWeight: 600, transition: 'background 0.2s',
            }}>
              {submitting ? 'Création...' : '+ Créer la ferme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFarmModal;