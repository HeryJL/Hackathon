import React from 'react';
import { COLORS as C } from '../../constants/theme';
import { Btn, Badge } from '../UI';
import ProductRow from '../Product/ProductRow';

const FarmDetail = ({ farm, products, onBack }) => {
  const farmProducts = products.filter(p => p.farmId === farm.id);

  return (
    <div>
      <button onClick={onBack} style={{ /* style retour */ }}>← Retour</button>
      <div style={{ background: `linear-gradient(135deg, ${C.primary}, ${C.darker})`, borderRadius: 16, padding: 32 }}>
        <h2>{farm.nom}</h2>
        {/* ... infos ferme ... */}
      </div>
      {/* Liste des produits via ProductRow */}
      {farmProducts.map(p => <ProductRow key={p.id} product={p} />)}
    </div>
  );
};

export default FarmDetail;