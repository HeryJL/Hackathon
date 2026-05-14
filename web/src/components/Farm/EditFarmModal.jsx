// src/components/FarmDetail/components/EditFarmModal.jsx
import React, { useState, useEffect } from 'react';
import { FaCheck, FaUpload, FaTrashAlt, FaTimes, FaLeaf, FaMapMarkerAlt, FaCertificate, FaImage } from 'react-icons/fa';
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

export const EditFarmModal = ({ farm, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    nom: farm?.nom || '',
    localisation: farm?.localisation || '',
    certifie: farm?.certifie || false,
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [focused, setFocused] = useState('');

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

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

      // Utilisation de PUT (comme dans votre backend)
      const res = await api.put(`/farms/${farm.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la modification.');
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
        <div style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.darker})`,
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FaCertificate size={20} color="#fff" />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>Modifier la ferme</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', borderRadius: 9, padding: '10px 14px', marginBottom: 16 }}>
              ⚠ {error}
            </div>
          )}
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                <FaLeaf style={{ marginRight: 6, verticalAlign: 'middle' }} /> Nom de la ferme *
              </label>
              <input type="text" required value={form.nom} style={inputStyle(focused === 'nom')}
                onFocus={() => setFocused('nom')} onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                <FaMapMarkerAlt style={{ marginRight: 6, verticalAlign: 'middle' }} /> Localisation *
              </label>
              <input type="text" required value={form.localisation} style={inputStyle(focused === 'localisation')}
                onFocus={() => setFocused('localisation')} onBlur={() => setFocused('')}
                onChange={e => setForm({ ...form, localisation: e.target.value })} />
            </div>
            <div>
              <label style={{
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                background: C.lightBg, borderRadius: 10, padding: '12px 16px',
                border: `1.5px solid ${form.certifie ? C.primary : C.border}`,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  background: form.certifie ? C.primary : '#fff',
                  border: `2px solid ${form.certifie ? C.primary : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {form.certifie && <FaCheck size={12} color="#fff" />}
                </div>
                <input type="checkbox" checked={form.certifie} onChange={e => setForm({ ...form, certifie: e.target.checked })} style={{ display: 'none' }} />
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.darker }}>
                    <FaCertificate style={{ marginRight: 6, color: C.primary }} /> Ferme certifiée bio
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Cochez si votre ferme est certifiée biologique</p>
                </div>
              </label>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                <FaImage style={{ marginRight: 6, verticalAlign: 'middle' }} /> Ajouter des photos (optionnel)
              </label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '20px', background: C.lightBg,
                border: `2px dashed ${C.primary}`, borderRadius: 10, cursor: 'pointer',
              }}>
                <FaUpload size={28} color={C.primary} style={{ marginBottom: 8 }} />
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
                      }}>
                        <FaTrashAlt size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {farm.images && farm.images.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FaImage /> {farm.images.length} photo(s) existante(s) (non modifiées)
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end', borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
            <button type="button" onClick={onClose} style={{
              background: '#f5f5f5', color: '#555', border: '1.5px solid #ddd',
              borderRadius: 9, padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <FaTimes size={12} /> Annuler
            </button>
            <button type="submit" disabled={submitting} style={{
              background: submitting ? '#aaa' : C.primary,
              color: '#fff', border: 'none', borderRadius: 9,
              padding: '10px 28px', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <FaCheck size={12} /> {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};