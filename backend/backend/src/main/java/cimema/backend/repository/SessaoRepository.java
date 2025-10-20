package cimema.backend.repository;

import cimema.backend.model.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SessaoRepository extends JpaRepository<Sessao,Long> {

    List<Sessao> findByFilmeIdAndDataSessao(String filmeId, LocalDate data);

    List<Sessao> findByDataSessao(LocalDate data);

    @Query("SELECT s FROM Sessao s WHERE s.filme.id = :filmeId AND s.dataSessao >= :data ORDER BY s.dataSessao, s.horario")
    List<Sessao> findProximasSessoes(@Param("filmeId") String filmeId, @Param("data") LocalDate data);

    @Query("SELECT s FROM Sessao s WHERE s.assentosDisponiveis > 0 AND s.dataSessao >= CURRENT_DATE")
    List<Sessao> findSessoesComVagas();
}
