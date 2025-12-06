package cimema.backend.model;

/**
 * Enum que representa os possíveis status de uma reserva
 */
public enum StatusReserva {
    CONFIRMADA,   // Reserva foi confirmada
    CANCELADA,    // Reserva foi cancelada pelo cliente ou sistema
    FINALIZADA    // Reserva foi utilizada (cliente compareceu)
}
