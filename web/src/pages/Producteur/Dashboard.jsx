import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Home,
  Leaf,
  Package,
  User,
  Plus,
  MapPin,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Sprout,
  TrendingUp,
  BarChart2,
  Sun,
  Droplets,
  Wind,
  Thermometer,
  Star,
  Activity,
  ArrowUpRight,
  Eye,
  ShoppingCart,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";
import api from "../../service/api";
import { COLORS as C } from "../../constants/theme";
import { StatCard, Btn } from "../../components/UI";
import ProductModal from "../../components/Product/ProductModal";
import FarmDetail from "../../components/Farm/FarmDetail";
import AddFarmModal from "../../components/Farm/AddFarmModal";
import AddProductModal from "../../components/Product/AddProductModal";

/* ─── Variants ─────────────────────────────────────────── */
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
  hidden: { y: 28, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 340, damping: 26 },
  },
};
const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/* ─── Badge ─────────────────────────────────────────────── */
const Badge = ({ children, type = "default" }) => {
  const map = {
    default: { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB" },
    warning: { bg: "#FFFBEB", color: "#92400E", border: "#FDE68A" },
    success: { bg: "#ECFDF5", color: "#065F46", border: "#6EE7B7" },
    danger: { bg: "#FEF2F2", color: "#991B1B", border: "#FECACA" },
    info: { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE" },
    bio: { bg: "#D1FAE5", color: "#065F46", border: "#34D399" },
  };
  const s = map[type] || map.default;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "4px 12px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </span>
  );
};

/* ─── Toast ─────────────────────────────────────────────── */
const Toast = ({ message, type }) => (
  <motion.div
    initial={{ x: 120, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 120, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 28 }}
    style={{
      position: "fixed",
      bottom: 32,
      right: 32,
      zIndex: 3000,
      background: type === "success" ? "#111827" : "#7F1D1D",
      color: "#fff",
      borderRadius: 16,
      padding: "16px 24px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      fontSize: 14,
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      gap: 12,
      backdropFilter: "blur(10px)",
    }}
  >
    {type === "success" ? (
      <CheckCircle size={18} color="#34D399" />
    ) : (
      <AlertTriangle size={18} color="#FCA5A5" />
    )}
    {message}
  </motion.div>
);

/* ─── Weather Widget ─────────────────────────────────────── */
const WeatherCard = () => {
  const items = [
    {
      icon: <Sun size={20} color="#F59E0B" />,
      label: "Météo",
      value: "24°C",
      sub: "Ensoleillé",
    },
    {
      icon: <Droplets size={20} color="#3B82F6" />,
      label: "Humidité",
      value: "68%",
      sub: "Optimal",
    },
    {
      icon: <Wind size={20} color="#10B981" />,
      label: "Vent",
      value: "12 km/h",
      sub: "Léger",
    },
  ];
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background:
          "linear-gradient(135deg, #065F46 0%, #047857 60%, #059669 100%)",
        borderRadius: 24,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 20px 60px rgba(5,150,105,0.35)",
      }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          bottom: -60,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />

      <div style={{ zIndex: 1 }}>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: "0 0 4px",
          }}
        >
          Antananarivo
        </p>
        <p
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: 800,
            margin: 0,
            lineHeight: 1,
          }}
        >
          Bonne journée !
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.65)",
            fontSize: 13,
            margin: "6px 0 0",
          }}
        >
          Conditions idéales pour vos cultures
        </p>
      </div>
      <div style={{ display: "flex", gap: 24, zIndex: 1 }}>
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 8px",
              }}
            >
              {it.icon}
            </div>
            <p
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                margin: 0,
              }}
            >
              {it.value}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 11,
                margin: "2px 0 0",
              }}
            >
              {it.sub}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Activity Feed ──────────────────────────────────────── */
const ActivityFeed = () => {
  const events = [
    {
      icon: <Sprout size={14} color="#10B981" />,
      text: "Nouvelle récolte enregistrée",
      time: "Il y a 2h",
      color: "#ECFDF5",
      dot: "#10B981",
    },
    {
      icon: <ShoppingCart size={14} color="#3B82F6" />,
      text: "Commande #1042 expédiée",
      time: "Il y a 5h",
      color: "#EFF6FF",
      dot: "#3B82F6",
    },
    {
      icon: <Package size={14} color="#F59E0B" />,
      text: "Stock tomates mis à jour",
      time: "Hier",
      color: "#FFFBEB",
      dot: "#F59E0B",
    },
    {
      icon: <Star size={14} color="#8B5CF6" />,
      text: "Avis 5 étoiles reçu",
      time: "Hier",
      color: "#F5F3FF",
      dot: "#8B5CF6",
    },
  ];
  return (
    <motion.div
      variants={fadeUp}
      style={{
        background: "#fff",
        borderRadius: 20,
        border: "1px solid #F3F4F6",
        padding: "24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Activity size={16} color={C.primary} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#111827" }}>
            Activité récente
          </span>
        </div>
        <button
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "#6B7280",
            fontSize: 12,
          }}
        >
          <RefreshCw size={12} /> Actualiser
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {events.map((e, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 12,
              background: e.color,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              {e.icon}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                {e.text}
              </p>
            </div>
            <span
              style={{ fontSize: 11, color: "#9CA3AF", whiteSpace: "nowrap" }}
            >
              {e.time}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ─── Quick Stats Row ────────────────────────────────────── */
const QuickStat = ({ icon, label, value, trend, color }) => (
  <motion.div
    variants={fadeUp}
    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
    style={{
      background: "#fff",
      borderRadius: 20,
      padding: "22px 24px",
      border: "1px solid #F3F4F6",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.3s ease",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 80,
        height: 80,
        borderRadius: "0 20px 0 100%",
        background: `${color}18`,
      }}
    />
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          background: `${color}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.cloneElement(icon, { size: 20, color })}
      </div>
      {trend !== undefined && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontSize: 12,
            fontWeight: 700,
            color: trend >= 0 ? "#10B981" : "#EF4444",
            background: trend >= 0 ? "#ECFDF5" : "#FEF2F2",
            padding: "4px 10px",
            borderRadius: 999,
          }}
        >
          <ArrowUpRight
            size={12}
            style={{ transform: trend < 0 ? "rotate(90deg)" : "none" }}
          />
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <p
      style={{
        margin: "0 0 4px",
        fontSize: 26,
        fontWeight: 800,
        color: "#111827",
        lineHeight: 1,
      }}
    >
      {value}
    </p>
    <p style={{ margin: 0, fontSize: 12, color: "#9CA3AF", fontWeight: 500 }}>
      {label}
    </p>
  </motion.div>
);

/* ─── Farm Card (centered) ────────────────────────────────── */
const FarmCard = ({ farm, products, onClick }) => {
  const prodCount = products.filter((p) => p.farmId === farm.id).length;
  const totalStock = products
    .filter((p) => p.farmId === farm.id)
    .reduce((s, p) => s + (p.stock || 0), 0);

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -10, boxShadow: "0 32px 64px rgba(0,0,0,0.14)" }}
      onClick={onClick}
      style={{
        background: "#fff",
        borderRadius: 24,
        border: "1px solid #F3F4F6",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.35s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image zone */}
      <div
        style={{
          height: 200,
          background: "linear-gradient(135deg, #D1FAE5, #A7F3D0)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {farm.images?.[0] ? (
          <img
            src={`http://localhost:3000/${farm.images[0]}`}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Home size={48} color="#059669" strokeWidth={1.2} />
            </motion.div>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)",
          }}
        />
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            gap: 6,
          }}
        >
          {farm.certifie && <Badge type="bio">🌿 Bio</Badge>}
          <Badge type="success">Actif</Badge>
        </div>
        {/* Product count pill */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 999,
            padding: "5px 12px",
            fontSize: 12,
            fontWeight: 700,
            color: "#065F46",
            display: "flex",
            alignItems: "center",
            gap: 5,
            backdropFilter: "blur(8px)",
          }}
        >
          <Leaf size={12} color="#059669" /> {prodCount} produits
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: "22px 24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            margin: "0 0 6px",
            fontSize: 18,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.2,
          }}
        >
          {farm.nom}
        </h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#9CA3AF",
            fontSize: 13,
            marginBottom: 20,
          }}
        >
          <MapPin size={13} /> {farm.localisation}
        </div>

        {/* Mini stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Produits",
              value: prodCount,
              icon: <Leaf size={14} color="#059669" />,
            },
            {
              label: "Stock total",
              value: `${totalStock} u.`,
              icon: <Package size={14} color="#3B82F6" />,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "#F9FAFB",
                borderRadius: 12,
                padding: "10px 12px",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {s.icon}
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 14,
                    color: "#111827",
                  }}
                >
                  {s.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 10,
                    color: "#9CA3AF",
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={12}
                fill={i <= 4 ? "#F59E0B" : "none"}
                color="#F59E0B"
              />
            ))}
            <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>
              (24)
            </span>
          </div>
          <motion.div
            whileHover={{ x: 4 }}
            style={{
              color: "#059669",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Gérer <ChevronRight size={16} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Main Dashboard ─────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("fermes");
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [toast, setToast] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [farmsRes, productsRes] = await Promise.all([
        api.get("/farms"),
        api.get("/products"),
      ]);
      setFarms(farmsRes.data);
      setProducts(productsRes.data);
    } catch {
      showToast("Erreur lors de la récupération des données", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFarmCreated = (f) => {
    setFarms((p) => [f, ...p]);
    showToast(`Ferme "${f.nom}" créée !`);
  };
  const handleProductCreated = (p) => {
    setProducts((prev) => [p, ...prev]);
    showToast("Produit créé !");
  };

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const timeStr = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  /* Loading */
  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F9FAFB",
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ textAlign: "center" }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            <Loader2
              size={40}
              style={{
                color: "#059669",
                margin: "0 auto 16px",
                display: "block",
              }}
            />
          </motion.div>
          <p style={{ color: "#059669", fontWeight: 700, fontSize: 15 }}>
            Synchronisation en cours…
          </p>
        </motion.div>
      </div>
    );

  /* Farm detail */
  if (selectedFarm)
    return (
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        style={{
          minHeight: "100vh",
          background: "#F9FAFB",
          padding: "28px 32px 28px 96px",
        }}
      >
        <FarmDetail
          farm={selectedFarm}
          products={products}
          measurements={measurements}
          onBack={() => setSelectedFarm(null)}
        />
      </motion.div>
    );

  /* ─── Main render ──────────────────────────────────────── */
  return (
    <div
      style={{ minHeight: "100vh", background: "#F9FAFB", paddingBottom: 60 }}
    >
      {/* ── Header ── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          padding: "0 40px 0 96px",
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(249,250,251,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 68,
          }}
        >
          {/* Date / time */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "7px 14px",
              }}
            >
              <Clock size={14} color="#9CA3AF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
                {timeStr}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "7px 14px",
              }}
            >
              <Calendar size={14} color="#9CA3AF" />
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "capitalize",
                }}
              >
                {dateStr}
              </span>
            </div>
          </div>
          {/* Profile */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/profile")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#fff",
              border: "1px solid #E5E7EB",
              color: "#111827",
              borderRadius: 12,
              padding: "8px 18px",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #059669, #34D399)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={14} color="#fff" />
            </div>
            Mon profil
          </motion.button>
        </div>
      </motion.header>

      {/* ── Body ── */}
      <div style={{ padding: "36px 40px 36px 96px" }}>
        {/* Weather banner */}
        <WeatherCard />

        {/* KPI row */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 18,
            marginBottom: 32,
          }}
        >
          <QuickStat
            icon={<Home />}
            label="Fermes actives"
            value={farms.length}
            trend={12}
            color="#059669"
          />
          <QuickStat
            icon={<Leaf />}
            label="Produits"
            value={products.length}
            trend={8}
            color="#3B82F6"
          />
          <QuickStat
            icon={<Package />}
            label="Stock total"
            value={`${totalStock}`}
            trend={-3}
            color="#F59E0B"
          />
          <QuickStat
            icon={<TrendingUp />}
            label="Revenus (mois)"
            value="2.4M Ar"
            trend={22}
            color="#8B5CF6"
          />
        </motion.div>

        {/* Two-column: tabs + activity */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* Left: tabs + list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Tab bar + action */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 14,
                  padding: 5,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                {[
                  {
                    id: "fermes",
                    label: "Mes fermes",
                    icon: <Home size={15} />,
                  },
                  {
                    id: "produits",
                    label: "Mes produits",
                    icon: <Leaf size={15} />,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      background: "transparent",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 22px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                      zIndex: 1,
                      color: activeTab === t.id ? "#111827" : "#9CA3AF",
                    }}
                  >
                    {activeTab === t.id && (
                      <motion.div
                        layoutId="tab-bg"
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
                          borderRadius: 10,
                          zIndex: -1,
                          boxShadow: "0 4px 12px rgba(5,150,105,0.15)",
                        }}
                      />
                    )}
                    {React.cloneElement(t.icon, {
                      color: activeTab === t.id ? "#059669" : "#9CA3AF",
                    })}
                    {t.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "fermes" ? (
                  <motion.div
                    key="btn-farm"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.button
                      whileHover={{
                        scale: 1.04,
                        boxShadow: "0 8px 25px rgba(5,150,105,0.4)",
                      }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setShowAddFarm(true)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "linear-gradient(135deg, #059669, #10B981)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "11px 22px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: "0 4px 15px rgba(5,150,105,0.3)",
                      }}
                    >
                      <Plus size={17} /> Ajouter une ferme
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="btn-prod"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        farms.length === 0
                          ? showToast("Créez d'abord une ferme.", "error")
                          : setShowAddProduct(true)
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "linear-gradient(135deg, #3B82F6, #60A5FA)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 12,
                        padding: "11px 22px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                        boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
                      }}
                    >
                      <Plus size={17} /> Ajouter un produit
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "fermes" ? (
                <motion.div
                  key="fermes"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {farms.length === 0 ? (
                    <motion.div
                      variants={fadeUp}
                      style={{
                        background: "#fff",
                        borderRadius: 24,
                        border: "2px dashed #D1FAE5",
                        padding: "80px 24px",
                        textAlign: "center",
                      }}
                    >
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                      >
                        <Sprout
                          size={52}
                          color="#D1FAE5"
                          strokeWidth={1.5}
                          style={{ marginBottom: 16 }}
                        />
                      </motion.div>
                      <p
                        style={{
                          color: "#9CA3AF",
                          fontSize: 15,
                          marginBottom: 20,
                        }}
                      >
                        Aucune ferme configurée
                      </p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAddFarm(true)}
                        style={{
                          background:
                            "linear-gradient(135deg, #059669, #10B981)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 12,
                          padding: "12px 28px",
                          cursor: "pointer",
                          fontSize: 14,
                          fontWeight: 700,
                          boxShadow: "0 4px 15px rgba(5,150,105,0.3)",
                        }}
                      >
                        Créer ma première ferme
                      </motion.button>
                    </motion.div>
                  ) : (
                    /* ── FARM GRID — centered ── */
                    <motion.div
                      variants={stagger}
                      initial="hidden"
                      animate="visible"
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(300px, 1fr))",
                        gap: 24,
                        justifyContent: "center",
                        justifyItems: "center",
                      }}
                    >
                      {farms.map((farm) => (
                        <div
                          key={farm.id}
                          style={{ width: "100%", maxWidth: 380 }}
                        >
                          <FarmCard
                            farm={farm}
                            products={products}
                            onClick={() => setSelectedFarm(farm)}
                            onFarmUpdate={(updatedFarm) => {
                              // Met à jour la liste des fermes
                              setFarms((prev) =>
                                prev.map((f) =>
                                  f.id === updatedFarm.id ? updatedFarm : f,
                                ),
                              );
                              // Met à jour la ferme courante (pour que la vue détail change immédiatement)
                              setSelectedFarm(updatedFarm);
                            }}
                          />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                /* ── PRODUCT TABLE ── */
                <motion.div
                  key="produits"
                  variants={fadeIn}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 20,
                      border: "1px solid #F3F4F6",
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 100px",
                        padding: "14px 24px",
                        background: "#FAFAFA",
                        borderBottom: "1px solid #F3F4F6",
                        fontSize: 11,
                        fontWeight: 800,
                        color: "#9CA3AF",
                        letterSpacing: "0.06em",
                      }}
                    >
                      <span>DÉSIGNATION</span>
                      <span>PROVENANCE</span>
                      <span>PRIX</span>
                      <span>STOCK</span>
                      <span>ACTION</span>
                    </div>
                    {products.length === 0 ? (
                      <div
                        style={{
                          padding: "60px 24px",
                          textAlign: "center",
                          color: "#9CA3AF",
                        }}
                      >
                        <Leaf
                          size={40}
                          color="#E5E7EB"
                          style={{ marginBottom: 12 }}
                        />
                        <p>Aucun produit enregistré</p>
                      </div>
                    ) : (
                      products.map((product, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          key={product.id}
                          whileHover={{ background: "#FAFAFA" }}
                          style={{
                            display: "grid",
                            gridTemplateColumns: "2.5fr 1fr 1.2fr 1fr 100px",
                            padding: "14px 24px",
                            alignItems: "center",
                            borderBottom:
                              i < products.length - 1
                                ? "1px solid #F3F4F6"
                                : "none",
                            transition: "background 0.2s",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <div
                              style={{
                                width: 42,
                                height: 42,
                                borderRadius: 12,
                                background: "#ECFDF5",
                                overflow: "hidden",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              {product.images?.[0] ? (
                                <img
                                  src={`http://localhost:3000/${product.images[0]}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                  alt=""
                                />
                              ) : (
                                <Leaf size={16} color="#059669" />
                              )}
                            </div>
                            <span
                              style={{
                                fontWeight: 700,
                                fontSize: 14,
                                color: "#111827",
                              }}
                            >
                              {product.name || product.nom}
                            </span>
                          </div>
                          <span style={{ fontSize: 13, color: "#6B7280" }}>
                            {product.farm?.nom || "—"}
                          </span>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              color: "#111827",
                            }}
                          >
                            {product.price || product.prix} Ar
                          </span>
                          <Badge
                            type={
                              (product.stock || 0) > 10 ? "success" : "warning"
                            }
                          >
                            {product.stock || 0} pcs
                          </Badge>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedProduct(product)}
                            style={{
                              background: "#ECFDF5",
                              border: "none",
                              color: "#059669",
                              fontWeight: 700,
                              cursor: "pointer",
                              borderRadius: 8,
                              padding: "6px 14px",
                              fontSize: 12,
                              display: "flex",
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Eye size={13} /> Voir
                          </motion.button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Quick actions */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1px solid #F3F4F6",
                padding: "24px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  margin: "0 0 16px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#111827",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <BarChart2 size={16} color="#059669" /> Actions rapides
              </p>
              {[
                {
                  label: "Nouvelle récolte",
                  icon: <Sprout size={15} />,
                  color: "#059669",
                  bg: "#ECFDF5",
                  action: () => setShowAddFarm(true),
                },
                {
                  label: "Ajouter stock",
                  icon: <Package size={15} />,
                  color: "#3B82F6",
                  bg: "#EFF6FF",
                  action: () => setShowAddProduct(true),
                },
                {
                  label: "Voir rapports",
                  icon: <BarChart2 size={15} />,
                  color: "#8B5CF6",
                  bg: "#F5F3FF",
                  action: () => {},
                },
              ].map((a, i) => (
                <motion.button
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={a.action}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 0",
                    borderBottom: i < 2 ? "1px solid #F9FAFB" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: a.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(a.icon, { color: a.color })}
                  </div>
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}
                  >
                    {a.label}
                  </span>
                  <ChevronRight
                    size={14}
                    color="#D1D5DB"
                    style={{ marginLeft: "auto" }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Activity */}
            <ActivityFeed />

            {/* Mini progress card */}
            <motion.div
              variants={fadeUp}
              style={{
                background: "linear-gradient(135deg, #1E40AF, #3B82F6)",
                borderRadius: 20,
                padding: "24px",
                boxShadow: "0 12px 30px rgba(59,130,246,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -20,
                  top: -20,
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
              <p
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  margin: "0 0 4px",
                }}
              >
                Objectif mensuel
              </p>
              <p
                style={{
                  color: "#fff",
                  fontSize: 24,
                  fontWeight: 800,
                  margin: "0 0 16px",
                }}
              >
                78% atteint
              </p>
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  height: 8,
                  marginBottom: 8,
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "78%" }}
                  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                  style={{
                    height: "100%",
                    background: "#fff",
                    borderRadius: 999,
                  }}
                />
              </div>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                5.2M Ar / 6.7M Ar
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Toasts */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

      {/* Modals */}
      {showAddFarm && (
        <AddFarmModal
          onClose={() => setShowAddFarm(false)}
          onSuccess={handleFarmCreated}
        />
      )}
      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSuccess={handleProductCreated}
          farms={farms}
        />
      )}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
