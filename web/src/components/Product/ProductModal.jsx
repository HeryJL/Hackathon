import React from "react";
import { COLORS as C } from "../../constants/theme";
import { Btn } from "../UI";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(27,94,32,0.45)",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        zIndex: 1000,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          maxWidth: 500,
          width: "100%",

          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {product.image ? (
          <div style={{ height: 200, overflow: "hidden" }}>
            <img
              src={`http://localhost:3000/${product.image}`}
              alt={product.nom}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            style={{
              height: 120,
              background: `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
            }}
          >
            🥬
          </div>
        )}

        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 700,
                  color: C.darker,
                }}
              >
                {product.nom}
              </h2>

              {product.categorie && (
                <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>
                  {product.categorie}
                </p>
              )}
            </div>

            <span style={{ fontSize: 22, fontWeight: 700, color: C.dark }}>
              {product.prix ? `${product.prix} Ar` : "—"}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
            }}
          >
            {[
              {
                label: "Stock",
                val:
                  product.stock !== undefined ? `${product.stock} unités` : "—",
              },

              { label: "Unité", val: product.unit || "—" },

              {
                label: "Certifié bio",
                val: product.certifie ? "✓ Oui" : "Non",
              },

              { label: "Ferme", val: product.farm?.nom || "—" },
            ].map(({ label, val }) => (
              <div
                key={label}
                style={{
                  background: C.lightBg,
                  borderRadius: 9,
                  padding: "10px 14px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 700,
                    color: C.medium,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                  }}
                >
                  {label}
                </p>

                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "#222",
                  }}
                >
                  {val}
                </p>
              </div>
            ))}
          </div>

          {product.description && (
            <p
              style={{
                fontSize: 14,
                color: "#555",
                lineHeight: 1.6,
                borderLeft: `3px solid ${C.primary}`,
                paddingLeft: 12,
                margin: "0 0 16px",
              }}
            >
              {product.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              borderTop: `1px solid ${C.border}`,
              paddingTop: 16,
            }}
          >
            <Btn variant="ghost" small onClick={onClose}>
              Fermer
            </Btn>

            <Btn small onClick={() => {}}>
              Modifier
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
