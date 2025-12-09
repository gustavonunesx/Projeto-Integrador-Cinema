import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-cinema-black border-t border-white/10 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CineVibe. Todos os direitos reservados.</p>
        <p className="mt-2">Desenvolvido com tecnologia de ponta para a melhor experiência cinematográfica.</p>
      </div>
    </footer>
  );
};

export default Footer;
