import React from 'react';
import { Link } from 'react-router-dom';
import { Film, User, BarChart2 } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-cinema-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Film className="h-8 w-8 text-cinema-neon" />
              <span className="font-bold text-xl tracking-wider text-white">CINE<span className="text-cinema-neon">VIBE</span></span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Início</Link>
                <Link to="/filmes" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">Filmes</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
               <Link to="/relatorios" className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
                <BarChart2 className="h-6 w-6" />
              </Link>
              <Link to="/login" className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors duration-200">
                <User className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
