import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Admin from './pages/Admin';
import Login from './pages/Login';
import './styles.css';  // CSS desktop-only agora

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <footer className="bg-dark text-white py-4 mt-5" style={{ width: '100%', position: 'fixed', bottom: 0 }}>
        <div className="container text-center">
          <p>&copy; 2025 Neighborhood Cinema Hub.</p>
        </div>
      </footer>
    </Router>
  );
}

export default App;
