package cimema.backend.repository;

import cimema.backend.model.Filme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FilmeRepository extends JpaRepository<Filme,String> {

    List<Filme> findByEmCartazTrue();

    @Query("SELECT f FROM Filme f WHERE f.titulo LIKE %:titulo%")
    List<Filme> findByTituloContaining(String titulo);

    @Query("SELECT f FROM Filme f WHERE f.genero LIKE %:genero%")
    List<Filme> findByGeneroContaining(String genero);
}
