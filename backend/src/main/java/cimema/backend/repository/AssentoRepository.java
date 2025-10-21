package cimema.backend.repository;

import cimema.backend.model.Assento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssentoRepository extends JpaRepository<Assento, Long> {

    // Buscar assentos por sessão
    List<Assento> findBySessaoId(Long sessaoId);

    // Buscar assento específico de uma sessão
    Optional<Assento> findBySessaoIdAndNumeroAssento(Long sessaoId, String numeroAssento);
}
