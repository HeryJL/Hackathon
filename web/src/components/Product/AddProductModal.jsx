import React, { useState } from 'react';
import api from '../../service/api';
import { COLORS as C } from '../../constants/theme';

const CATEGORIES = [
  { value: 'LEGUMES', label: '🥦 Légumes' },
  { value: 'FRUITS', label: '🍎 Fruits' },
  { value: 'VIANDES', label: '🥩 Viandes' },
  { value: 'PRODUITS_LAITIERS', label: '🥛 Produits laitiers' },
  { value: 'OEUFS', label: '🥚 Œufs' },
  { value: 'MIEL', label: '🍯 Miel' },
  { value: 'CEREALES', label: '🌾 Céréales' },
  { value: 'PLANTES', label: '🌿 Plantes' },
  { value: 'AUTRE', label: '📦 Autre' },
];

const UNITS = ['kg', 'g', 'L', 'mL', 'pièce', 'boîte', 'bouquet', 'douzaine', 'sac'];

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

const AddProductModal = ({ onClose, onSuccess, farms }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: 'LEGUMES',
    stock: '',
    isOrganic: false,
    isAvailable: true,
    farmId: farms?.[0]?.id || '',
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
    if (!form.name.trim() || !form.price || !form.quantity || !form.farmId) {
      setError('Nom, prix, quantité et ferme sont obligatoires.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', parseFloat(form.price));
      formData.append('quantity', parseInt(form.quantity));
      formData.append('unit', form.unit);
      formData.append('category', form.category);
      formData.append('stock', parseInt(form.stock) || parseInt(form.quantity));
      formData.append('isOrganic', form.isOrganic);
      formData.append('isAvailable', form.isAvailable);
      formData.append('farmId', form.farmId);
      images.forEach(img => formData.append('images', img));

      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSuccess(res.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Erreur lors de la création du produit.');
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name) => ({
    style: inputStyle(focused === name),
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(''),
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(27,94,32,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16, overflowY: 'auto',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 18, maxWidth: 580, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden',
        margin: 'auto',
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: `linear-gradient(135deg, ${C.primary}, ${C.darker})`,
          padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🥬</span>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>Nouveau produit</h2>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff',
            borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24, maxHeight: '80vh', overflowY: 'auto' }}>
          {error && (
            <div style={{ background: '#FFEBEE', border: '1px solid #FFCDD2', color: '#C62828', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 14 }}>
              ⚠ {error}
            </div>
          )}

          <div style={{ display: 'grid', gap: 16 }}>

            {/* Ferme */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Ferme <span style={{ color: '#e53935' }}>*</span>
              </label>
              {farms && farms.length > 0 ? (
                <select
                  value={form.farmId}
                  {...field('farmId')}
                  onChange={e => setForm({ ...form, farmId: e.target.value })}
                  style={{ ...inputStyle(focused === 'farmId'), appearance: 'none', cursor: 'pointer' }}
                >
                  {farms.map(f => (
                    <option key={f.id} value={f.id}>{f.nom} — {f.localisation}</option>
                  ))}
                </select>
              ) : (
                <div style={{ background: '#FFF8E1', border: '1px solid #FFE082', borderRadius: 9, padding: '12px 14px', fontSize: 14, color: '#F57F17' }}>
                  ⚠ Vous devez d'abord créer une ferme avant d'ajouter des produits.
                </div>
              )}
            </div>

            {/* Nom */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Nom du produit <span style={{ color: '#e53935' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                placeholder="Ex: Tomates cerises"
                {...field('name')}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                placeholder="Décrivez votre produit..."
                {...field('description')}
                onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ ...inputStyle(focused === 'description'), resize: 'vertical' }}
              />
            </div>

            {/* Catégorie */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 8 }}>
                Catégorie
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <label key={cat.value} style={{
                    display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer',
                    padding: '8px 10px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    border: `1.5px solid ${form.category === cat.value ? C.primary : C.border}`,
                    background: form.category === cat.value ? C.lightBg2 : '#fff',
                    color: form.category === cat.value ? C.dark : '#555',
                    transition: 'all 0.15s',
                  }}>
                    <input
                      type="radio"
                      name="category"
                      value={cat.value}
                      checked={form.category === cat.value}
                      onChange={() => setForm({ ...form, category: cat.value })}
                      style={{ display: 'none' }}
                    />
                    {cat.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Prix + Unité */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                  Prix (Ar) <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.price}
                  placeholder="Ex: 5000"
                  {...field('price')}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                  Unité
                </label>
                <select
                  value={form.unit}
                  {...field('unit')}
                  onChange={e => setForm({ ...form, unit: e.target.value })}
                  style={{ ...inputStyle(focused === 'unit'), appearance: 'none', cursor: 'pointer' }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Quantité + Stock */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                  Quantité <span style={{ color: '#e53935' }}>*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.quantity}
                  placeholder="Ex: 100"
                  {...field('quantity')}
                  onChange={e => setForm({ ...form, quantity: e.target.value })}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                  Stock initial
                  <span style={{ color: '#999', fontWeight: 400, marginLeft: 4, fontSize: 12 }}>(défaut = quantité)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  placeholder={form.quantity || '0'}
                  {...field('stock')}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                />
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { key: 'isOrganic', label: '🌿 Produit biologique', desc: 'Certifié sans pesticides' },
                { key: 'isAvailable', label: '✅ Disponible à la vente', desc: 'Visible par les acheteurs' },
              ].map(({ key, label, desc }) => (
                <label key={key} style={{
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  background: C.lightBg, borderRadius: 10, padding: '12px 14px',
                  border: `1.5px solid ${form[key] ? C.primary : C.border}`,
                  transition: 'border-color 0.2s',
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                    background: form[key] ? C.primary : '#fff',
                    border: `2px solid ${form[key] ? C.primary : C.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}>
                    {form[key] && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
                  </div>
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.darker }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#888' }}>{desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Images */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: C.dark, marginBottom: 6 }}>
                Photos du produit
              </label>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '18px', background: C.lightBg,
                border: `2px dashed ${C.primary}`, borderRadius: 10, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = C.lightBg2}
                onMouseLeave={e => e.currentTarget.style.background = C.lightBg}
              >
                <span style={{ fontSize: 24, marginBottom: 4 }}>📸</span>
                <span style={{ fontSize: 13, color: C.dark, fontWeight: 500 }}>Cliquez pour sélectionner</span>
                <span style={{ fontSize: 11, color: '#999', marginTop: 2 }}>JPG, PNG</span>
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
                        color: '#fff', fontSize: 12, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
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
            <button
              type="submit"
              disabled={submitting || (farms && farms.length === 0)}
              style={{
                background: (submitting || (farms && farms.length === 0)) ? '#aaa' : C.primary,
                color: '#fff', border: 'none', borderRadius: 9,
                padding: '10px 28px',
                cursor: (submitting || (farms && farms.length === 0)) ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600, transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Création...' : '+ Créer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;