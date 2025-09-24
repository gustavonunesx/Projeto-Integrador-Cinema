import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Mantido, mas CSS override para desktop

const Header = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search) navigate(`/search?q=${search}`);  // Placeholder
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ width: '100%' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link className="navbar-brand" to="/">Neighborhood Cinema</Link>
        <form className="d-flex mx-auto" style={{ maxWidth: '400px' }} onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search movies"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '300px' }}  // Fixo para desktop
          />
          <button className="btn btn-outline-light" type="submit">Search</button>
        </form>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login (Opcional)</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin">Admin (Acesso Livre)</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
