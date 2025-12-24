import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ParticipantForm from './pages/ParticipantForm';
import TrainerForm from './pages/TrainerForm';
import Login from './auth/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/inscription/:formationId" element={<ParticipantForm />} />
            <Route path="/register-formateur" element={<TrainerForm />} />
          </Routes>
        </main>

        <footer className="bg-dark text-white text-center py-4 mt-auto">
          <div className="container">
            <p className="mb-0">&copy; 2026 Centre de Formation. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
