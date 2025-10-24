package cimema.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FilmePopularDTO {

    private String titulo;
    private String filmeId;
    private Long totalVendas;
    private BigDecimal receitaTotal;
}
