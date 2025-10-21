package cimema.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sessao_id", nullable = false)
    private Sessao sessao;

    @ManyToOne
    @JoinColumn(name = "assento_id", nullable = false)
    private Assento assento;

    @Column(nullable = false)
    private String cpfCliente;

    @Column(nullable = false)
    private LocalDateTime dataReserva = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusReserva status = StatusReserva.CONFIRMADA;
}

enum StatusReserva {
    CONFIRMADA,
    CANCELADA,
    FINALIZADA
}

