// src/App.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 1. IMPORTAR O 'motion'
import ApiService from './api-service.js'; 
import MovieCard from './components/MovieCard.jsx';
import './App.css'; 

// 2. Definir as "variantes" (regras de animação)
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Atraso de 0.1s entre cada "filho"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Começa invisível e 20px abaixo
  show: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 } // Anima para a posição final
  }
};

function App() {
  const [filmesEmAlta, setFilmesEmAlta] = useState([]);
  const [todosOsFilmes, setTodosOsFilmes] = useState([]);

  useEffect(() => {
    async function carregarFilmes() {
      const altaResult = await ApiService.getFilmesEmCartaz();
      if (altaResult.success) {
        setFilmesEmAlta(altaResult.data.slice(0, 4));
      }

      const todosResult = await ApiService.getAllFilmes();
      if (todosResult.success) {
        setTodosOsFilmes(todosResult.data);
      }
    }
    carregarFilmes();
  }, []);

  // 3. Renderizar os componentes
  return (
    <div className="App">
      {/* Você pode copiar seu CSS antigo do index.css/movie.css para o App.css */}
      
      <main className="container">
        <section id="movies">
          <h2 className="section-title">Filmes em Alta</h2>
          
          {/* 4. APLICAÇÃO CORRETA DAS PROPS */}
          <motion.div 
            className="movies-grid"
            variants={containerVariants} // Passado como atributo
            initial="hidden"           // Passado como atributo
            animate="show"             // Passado como atributo
          >
            {filmesEmAlta.map((filme, index) => ( // Adicione o 'index' aqui
              
              <motion.div
                key={filme.id}
                variants={itemVariants} // Passado como atributo
                
                // Bônus: Efeito de hover
                whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
              >
                <MovieCard filme={filme} />
              </motion.div>

            ))}
          </motion.div>
        </section>
        
        {/* Você criaria um componente MoviesSlider aqui */}
        
      </main>
      
      {/* Você criaria um componente Footer aqui */}
    </div>
  );
}

export default App;