package cimema.backend.model;


/**
 * Enum que representa os possíveis status de um assento
 */
public enum StatusAssento {
    DISPONIVEL,   // Assento está livre para reserva
    OCUPADO,      // Assento foi vendido/confirmado
    RESERVADO     // Assento está temporariamente reservado
}
