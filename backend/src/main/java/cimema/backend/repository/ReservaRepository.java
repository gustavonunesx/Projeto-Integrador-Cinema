package cimema.backend.repository;

import cimema.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    // Buscar reservas por CPF
    List<Reserva> findByCpfCliente(String cpfCliente);

    // Buscar reservas por sessão
    List<Reserva> findBySessaoId(Long sessaoId);

    // Buscar reservas em um período
    @Query("SELECT r FROM Reserva r WHERE r.dataReserva BETWEEN :inicio AND :fim")
    List<Reserva> findByDataReservaBetween(LocalDateTime inicio, LocalDateTime fim);
}
