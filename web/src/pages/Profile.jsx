import React, { useState, useEffect } from "react";
import api from "../service/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  ChevronRight,
  AlertCircle,
  FileText,
  ArrowLeft,
  Save,
  X,
  Loader,
  CheckCircle,
} from "lucide-react";

const COLORS = {
  primary: "#2E7D32",
  secondary: "#45a049",
  dark: "#1a1a1a",
  light: "#ffffff",
  gray: "#71717a",
  border: "#e4e4e7",
  bg: "#fafafa",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
};

const Badge = ({ status }) => {
  const map = {
    PENDING: { label: "En attente", bg: "#fef3c7", color: "#b45309" },
    APPROVED: { label: "Approuvé", bg: "#dcfce7", color: "#15803d" },
    REJECTED: { label: "Rejeté", bg: "#fee2e2", color: "#b91c1c" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span
      style={{
        padding: "4px 12px",
        borderRadius: "6px",
        background: s.bg,
        color: s.color,
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {s.label}
    </span>
  );
};

const Avatar = ({ src, name, size = 80 }) => {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";
  return src ? (
    <img
      src={`http://localhost:3000/${src}`}
      alt="avatar"
      style={{
        width: size,
        height: size,
        borderRadius: "20px",
        objectFit: "cover",
        border: `1px solid ${COLORS.border}`,
      }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "20px",
        background: "#f4f4f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COLORS.gray,
        fontSize: size * 0.35,
        fontWeight: 600,
        border: `1px solid ${COLORS.border}`,
      }}
    >
      {initials}
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [sellerRequests, setSellerRequests] = useState([]);
  const [editing, setEditing] = useState(false);
  const [formProfile, setFormProfile] = useState({
    nomComplet: "",
    telephone: "",
    adresseLivraison: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    farmName: "",
    farmLocation: "",
    description: "",
    document: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfileAndRequests();
  }, []);

  const fetchProfileAndRequests = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        api.get("/profile"),
        api.get("/seller-requests"),
      ]);
      setProfile(profileRes.data);
      setFormProfile({
        nomComplet: profileRes.data.nomComplet || "",
        telephone: profileRes.data.telephone || "",
        adresseLivraison: profileRes.data.adresseLivraison || "",
      });
      setSellerRequests(requestsRes.data);
    } catch (err) {
      setError("Impossible de charger les données du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("nomComplet", formProfile.nomComplet);
    formData.append("telephone", formProfile.telephone);
    formData.append("adresseLivraison", formProfile.adresseLivraison);
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      const res = await api.put("/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data);
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      window.scrollTo(0, 0);
    }
  };

  const handleSellerRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const formData = new FormData();
    formData.append("farmName", requestForm.farmName);
    formData.append("farmLocation", requestForm.farmLocation);
    formData.append("description", requestForm.description);
    if (requestForm.document) {
      formData.append("document", requestForm.document);
    }

    try {
      await api.post("/seller-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const res = await api.get("/seller-requests");
      setSellerRequests(res.data);
      setShowRequestForm(false);
      setRequestForm({
        farmName: "",
        farmLocation: "",
        description: "",
        document: null,
      });
      setSuccess("Demande envoyée avec succès !");
      window.scrollTo(0, 0);
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'envoi de la demande",
      );
      window.scrollTo(0, 0);
    } finally {
      setSubmitting(false);
    }
  };

  const latestRequest = sellerRequests.length === 0 ? null : sellerRequests[0];
  const isProducteur = profile?.user?.isProducteur || false;

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.bg,
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.primary,
            borderRadius: "50%",
          }}
        />
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.dark,
        padding: "40px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header avec retour */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "32px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "none",
              border: "none",
              color: COLORS.gray,
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <ArrowLeft size={18} /> Retour
          </button>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 800,
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Paramètres du compte
          </h1>
          <div style={{ width: 80 }}></div>
        </div>

        {/* Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: "#fef2f2",
                border: `1px solid #fee2e2`,
                color: COLORS.danger,
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "14px",
              }}
            >
              <AlertCircle size={18} /> {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                background: "#dcfce7",
                border: `1px solid #bbf7d0`,
                color: "#15803d",
                borderRadius: "12px",
                padding: "12px 16px",
                marginBottom: "24px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: "14px",
              }}
            >
              <CheckCircle size={18} /> {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}
        >
          {/* Carte Profil */}
          <section
            style={{
              background: COLORS.light,
              borderRadius: "20px",
              border: `1px solid ${COLORS.border}`,
              padding: "32px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "32px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <div style={{ position: "relative" }}>
                  <Avatar
                    src={avatarPreview || profile?.avatar}
                    name={profile?.nomComplet}
                    size={90}
                  />
                  {editing && (
                    <label
                      style={{
                        position: "absolute",
                        bottom: "-5px",
                        right: "-5px",
                        background: COLORS.primary,
                        color: "#fff",
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        border: "3px solid #fff",
                      }}
                    >
                      <Camera size={16} />
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setAvatarFile(file);
                            setAvatarPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: 700,
                      margin: "0 0 4px 0",
                    }}
                  >
                    {profile?.nomComplet || "Utilisateur"}
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: COLORS.gray,
                      fontSize: "14px",
                    }}
                  >
                    <Mail size={14} /> {profile?.user?.email}
                  </div>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: `1px solid ${COLORS.border}`,
                    background: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Modifier le profil
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {editing ? (
                <motion.form
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleProfileUpdate}
                  style={{ display: "grid", gap: "20px" }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nom complet</label>
                      <input
                        style={inputStyle}
                        value={formProfile.nomComplet}
                        onChange={(e) =>
                          setFormProfile({
                            ...formProfile,
                            nomComplet: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Téléphone</label>
                      <input
                        style={inputStyle}
                        value={formProfile.telephone}
                        onChange={(e) =>
                          setFormProfile({
                            ...formProfile,
                            telephone: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Adresse de livraison</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "80px" }}
                      value={formProfile.adresseLivraison}
                      onChange={(e) =>
                        setFormProfile({
                          ...formProfile,
                          adresseLivraison: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div
                    style={{ display: "flex", gap: "12px", marginTop: "10px" }}
                  >
                    <button type="submit" style={btnPrimary}>
                      <Save size={18} /> Enregistrer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setAvatarPreview(null);
                        setAvatarFile(null);
                      }}
                      style={btnSecondary}
                    >
                      <X size={18} /> Annuler
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <InfoBlock
                    icon={<Phone size={16} />}
                    label="Téléphone"
                    value={profile?.telephone}
                  />
                  <InfoBlock
                    icon={<MapPin size={16} />}
                    label="Adresse"
                    value={profile?.adresseLivraison}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Section Statut Professionnel */}
          <section
            style={{
              background: COLORS.light,
              borderRadius: "20px",
              border: `1px solid ${COLORS.border}`,
              padding: "32px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                margin: "0 0 20px 0",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.primary,
                }}
              ></div>
              Statut Professionnel
            </h3>

            {isProducteur ? (
              <div style={{ display: "grid", gap: "16px" }}>
                {/* Bannière de succès */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px",
                    background: "#f0fdf4",
                    borderRadius: "15px",
                    border: "1px solid #dcfce7",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, color: "#166534" }}>
                      ✅ Vous êtes un producteur certifié
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "14px",
                        color: "#15803d",
                      }}
                    >
                      Votre compte est configuré pour la vente.
                    </p>
                  </div>
                  <Badge status="APPROVED" />
                </div>

                {/* Boutons d'action pour le producteur */}
                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={() => navigate("/Productor/dashboard")}
                    style={{
                      ...btnPrimary,
                      flex: 1,
                      justifyContent: "center",
                      height: "50px",
                    }}
                  >
                    <FileText size={18} /> Gérer mes fermes & produits
                  </button>

                  {/* Optionnel : Garder le lien vers l'espace producteur général si nécessaire */}
                  <button
                    onClick={() => navigate("/espace-producteur")}
                    style={{
                      ...btnSecondary,
                      flex: 1,
                      justifyContent: "center",
                      height: "50px",
                    }}
                  >
                    Tableau de bord <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              /* ... Reste de ton code pour les demandes en attente ou le formulaire ... */
              <div>
                {!showRequestForm ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      border: `2px dashed ${COLORS.border}`,
                      borderRadius: "20px",
                    }}
                  >
                    {latestRequest ? (
                      <div style={{ textAlign: "left" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: "15px",
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            Statut de votre demande
                          </span>
                          <Badge status={latestRequest.status} />
                        </div>
                        <p style={{ fontSize: "14px", color: COLORS.gray }}>
                          Soumis le{" "}
                          {new Date(
                            latestRequest.createdAt,
                          ).toLocaleDateString()}
                        </p>
                        <p style={{ fontSize: "14px", marginTop: "8px" }}>
                          <strong>Ferme :</strong> {latestRequest.farmName}
                        </p>

                        {/* Si approuvé mais isProducteur n'est pas encore mis à jour dans le profil, on peut aussi rediriger ici */}
                        {latestRequest.status === "APPROVED" && (
                          <button
                            onClick={() => navigate("/Productor/dashboard")}
                            style={{
                              marginTop: "15px",
                              ...btnPrimary,
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            Accéder au Dashboard <ChevronRight size={18} />
                          </button>
                        )}

                        {latestRequest.status === "REJECTED" && (
                          <button
                            onClick={() => setShowRequestForm(true)}
                            style={{
                              marginTop: "15px",
                              ...btnSecondary,
                              width: "100%",
                              justifyContent: "center",
                            }}
                          >
                            Faire une nouvelle demande
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        <p style={{ color: COLORS.gray, marginBottom: "20px" }}>
                          Vendez vos produits locaux directement aux
                          consommateurs.
                        </p>
                        <button
                          onClick={() => setShowRequestForm(true)}
                          style={btnPrimary}
                        >
                          Devenir producteur
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  /* ... Ton formulaire actuel ... */
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSellerRequestSubmit}
                    style={{ display: "grid", gap: "20px" }}
                  >
                    {/* Les champs du formulaire farmName, farmLocation, etc. */}
                    {/* ... */}
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

// Styles
const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: COLORS.gray,
  marginBottom: "8px",
};
const inputStyle = {
  width: "100%",
  border: `1px solid ${COLORS.border}`,
  borderRadius: "10px",
  padding: "12px 14px",
  fontSize: "15px",
  outline: "none",
  background: "#fff",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
};
const btnPrimary = {
  background: COLORS.primary,
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "12px 24px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  transition: "opacity 0.2s",
};
const btnSecondary = {
  background: "#fff",
  color: COLORS.dark,
  border: `1px solid ${COLORS.border}`,
  borderRadius: "10px",
  padding: "12px 24px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const InfoBlock = ({ icon, label, value }) => (
  <div
    style={{
      padding: "16px",
      borderRadius: "12px",
      background: "#f8f8f8",
      border: "1px solid #f0f0f0",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: COLORS.gray,
        marginBottom: "8px",
      }}
    >
      {icon}{" "}
      <span
        style={{
          fontSize: "12px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
    </div>
    <div style={{ fontWeight: 600, fontSize: "15px" }}>{value || "—"}</div>
  </div>
);

// Animation pour le loader (si besoin)
const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default Profile;
