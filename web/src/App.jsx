import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/Homepage';

// Composant pour protéger les routes
// Si pas de token, on redirige vers /login
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate replace to="/login" />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Routes Publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes Protégées (Accessibles uniquement si connecté) */}
       
          
         
          <Route path="/" element={<HomePage />} />

        </Routes>
      </div>
    </Router>
  );
};

export default App;