package cimema.backend.repository;

import cimema.backend.dto.FilmePopularDTO;
import cimema.backend.dto.HorarioMovimentoDTO;
import cimema.backend.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Reserva, Long> {

    /**
     * Busca os filmes mais vendidos em um período
     * Agrupa por filme e conta o total de reservas e soma a receita
     */
    @Query("SELECT new cimema.backend.dto.FilmePopularDTO(f.titulo, f.id, COUNT(r.id), SUM(s.preco)) " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "JOIN s.filme f " +
            "WHERE DATE(r.dataReserva) BETWEEN :startDate AND :endDate " +
            "GROUP BY f.id, f.titulo " +
            "ORDER BY COUNT(r.id) DESC")
    List<FilmePopularDTO> findFilmesMaisVendidos(@Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);

    /**
     * Busca os horários mais movimentados em um período
     * Agrupa por horário da sessão e conta o total de reservas
     */
    @Query("SELECT new cimema.backend.dto.HorarioMovimentoDTO(s.horario, COUNT(r.id)) " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "WHERE s.dataSessao BETWEEN :startDate AND :endDate " +
            "GROUP BY s.horario " +
            "ORDER BY COUNT(r.id) DESC")
    List<HorarioMovimentoDTO> findHorariosMaisMovimentados(@Param("startDate") LocalDate startDate,
                                                           @Param("endDate") LocalDate endDate);

    /**
     * Busca os dias da semana mais movimentados em um período
     * Retorna o nome do dia e o total de reservas
     */
    @Query("SELECT DAYNAME(s.dataSessao) as dia, COUNT(r.id) as total " +
            "FROM Reserva r " +
            "JOIN r.sessao s " +
            "WHERE s.dataSessao BETWEEN :startDate AND :endDate " +
            "GROUP BY DAYNAME(s.dataSessao) " +
            "ORDER BY COUNT(r.id) DESC")
    List<Object[]> findDiasMaisMovimentados(@Param("startDate") LocalDate startDate,
                                            @Param("endDate") LocalDate endDate);
}

