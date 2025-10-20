package cimema.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

@Data
@AllArgsConstructor
public class HorarioMovimentoDTO {

    private LocalTime horario;
    private Long totalReservas;
}
