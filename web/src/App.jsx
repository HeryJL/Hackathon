import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/Homepage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Producteur/Dashboard";

// Composant pour protéger les routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate replace to="/login" />;
};

// Composant pour les routes publiques (redirige vers home si déjà connecté)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate replace to="/" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Routes Publiques SANS Layout (pas de sidebar) */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Routes AVEC Layout (sidebar visible) */}
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />

        <Route
          path="/products"
          element={
            <Layout>
              <ProductsPage />
            </Layout>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Layout>
                <CartPage />
              </Layout>
            </PrivateRoute>
          }
        />

        {/* Routes protégées avec Layout */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/Productor/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/animals"
          element={
            <Layout>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Page Élevage</h1>
              </div>
            </Layout>
          }
        />

        <Route
          path="/machines"
          element={
            <Layout>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Page Matériel</h1>
              </div>
            </Layout>
          }
        />

        {/* Route 404 - Page non trouvée */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="p-8 text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404</h1>
                <p className="text-gray-600">Page non trouvée</p>
                <a
                  href="/"
                  className="text-green-600 hover:underline mt-4 inline-block"
                >
                  Retour à l'accueil
                </a>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
