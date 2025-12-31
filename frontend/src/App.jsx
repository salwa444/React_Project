
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ParticipantForm from './pages/ParticipantForm';
import TrainerForm from './pages/TrainerForm';
import Login from './auth/Login';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import FormationManager from './admin/FormationManager';
import FormateurManager from './admin/FormateurManager';
import EntrepriseManager from './admin/EntrepriseManager';
import PlanificationManager from './admin/PlanificationManager';
import InscriptionManager from './admin/InscriptionManager';
import EvaluationManager from './admin/EvaluationManager';
import UserManager from './admin/UserManager';
import './App.css';

// Public Layout to keep Navbar/Footer on site pages but NOT on admin pages
const PublicLayout = () => (
  <div className="app-container d-flex flex-column min-vh-100">
    <Navbar />
    <main className="main-content flex-grow-1">
      <Outlet />
    </main>
    <footer className="bg-dark text-white text-center py-4 mt-auto">
      <div className="container">
        <p className="mb-0">&copy; 2026 Centre de Formation. Tous droits réservés.</p>
      </div>
    </footer>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inscription/:formationId" element={<ParticipantForm />} />
          <Route path="/register-formateur" element={<TrainerForm />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="formations" element={<FormationManager />} />
          <Route path="formateurs" element={<FormateurManager />} />
          <Route path="entreprises" element={<EntrepriseManager />} />
          <Route path="planning" element={<PlanificationManager />} />
          <Route path="inscriptions" element={<InscriptionManager />} />
          <Route path="evaluations" element={<EvaluationManager />} />
          <Route path="utilisateurs" element={<UserManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
