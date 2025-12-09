import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Filmes from './pages/Filmes';
import FilmeDetalhes from './pages/FilmeDetalhes';
import Sessao from './pages/Sessao';
import Relatorios from './pages/Relatorios';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="filmes" element={<Filmes />} />
          <Route path="filme/:id" element={<FilmeDetalhes />} />
          <Route path="sessao/:id" element={<Sessao />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
