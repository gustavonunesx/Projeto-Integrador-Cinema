package cimema.backend.service;

import cimema.backend.dto.FilmePopularDTO;
import cimema.backend.dto.HorarioMovimentoDTO;
import cimema.backend.repository.AnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private AnalyticsRepository analyticsRepository;

    public Map<String, Object> getFilmesMaisVendidos(LocalDate inicio, LocalDate fim) {
        List<FilmePopularDTO> filmes = analyticsRepository.findFilmesMaisVendidos(inicio, fim);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("periodo", inicio + " a " + fim);
        resultado.put("totalFilmes", filmes.size());
        resultado.put("filmes", filmes);

        return resultado;
    }

    public Map<String, Object> getHorariosMaisMovimentados(LocalDate inicio, LocalDate fim) {
        List<HorarioMovimentoDTO> horarios = analyticsRepository.findHorariosMaisMovimentados(inicio, fim);
        List<Object[]> dias = analyticsRepository.findDiasMaisMovimentados(inicio, fim);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("horarios", horarios);
        resultado.put("dias", dias);

        return resultado;
    }

    public Map<String, Object> getDashboardData() {
        LocalDate hoje = LocalDate.now();
        LocalDate umaSemanaAtras = hoje.minusDays(7);
        LocalDate umMesAtras = hoje.minusMonths(1);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("filmesPopularesSemana",
                analyticsRepository.findFilmesMaisVendidos(umaSemanaAtras, hoje));
        dashboard.put("horariosPopularesMes",
                analyticsRepository.findHorariosMaisMovimentados(umMesAtras, hoje));
        dashboard.put("resumoPeriodo", Map.of(
                "semana", umaSemanaAtras + " a " + hoje,
                "mes", umMesAtras + " a " + hoje
        ));

        return dashboard;
    }
}
