package cimema.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface AnalyticsRepository extends JpaRepository<Object,Long> {

    @Query("SELECT new com.cinema.dto.FilmePopularDTO(f.titulo, f.id, COUNT(r.id), SUM(s.preco)) " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "JOIN s.filme f " +
            "WHERE r.dataReserva BETWEEN :startDate AND :endDate " +
            "GROUP BY f.id, f.titulo " +
            "ORDER BY COUNT(r.id) DESC")
    List<FilmePopularDTO> findFilmesMaisVendidos(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    @Query("SELECT new com.cinema.dto.HorarioMovimentoDTO(s.horario, COUNT(r.id)) " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "WHERE s.dataSessao BETWEEN :startDate AND :endDate " +
            "GROUP BY s.horario " +
            "ORDER BY COUNT(r.id) DESC")
    List<HorarioMovimentoDTO> findHorariosMaisMovimentados(@Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);

    @Query("SELECT DAYNAME(s.dataSessao) as dia, COUNT(r.id) as total " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "WHERE s.dataSessao BETWEEN :startDate AND :endDate " +
            "GROUP BY DAYNAME(s.dataSessao) " +
            "ORDER BY COUNT(r.id) DESC")
    List<Object[]> findDiasMaisMovimentados(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);

}
