package cimema.backend.repository;

import cimema.backend.model.Sala;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalaRepository extends JpaRepository<Sala, Long> {

    // Buscar salas ativas
    List<Sala> findByAtivaTrue();

    // Buscar sala por nome
    Sala findByNome(String nome);
}
