import React, { useState, useEffect } from 'react';
import { Btn } from '../UI';
import ProductModal from './ProductModal';
import { COLORS as C } from '../../constants/theme';


const ProductRow = ({ product }) => {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
        background: C.lightBg, borderRadius: 10, border: `1px solid ${C.border}`,
      }}>
        <div style={{ width: 44, height: 44, borderRadius: 8, background: '#fff', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
          {product.image ? <img src={`http://localhost:3000/${product.image}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 7 }} /> : '🌿'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 600, color: '#222', fontSize: 15 }}>{product.nom}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>{product.categorie || 'Sans catégorie'}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, color: C.dark, fontSize: 15 }}>{product.prix ? `${product.prix} Ar` : '—'}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: '#888' }}>Stock: {product.stock ?? '—'}</p>
        </div>
        <Btn small variant="outline" onClick={() => setSelected(product)}>Détails</Btn>
      </div>
      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default ProductRow
 