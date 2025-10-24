package cimema.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@AllArgsConstructor
public class HorarioMovimentoDTO {

    @JsonFormat(pattern = "HH:mm:ss")
    private LocalTime horario;
    private Long totalReservas;
}
