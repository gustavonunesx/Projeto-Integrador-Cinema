package cimema.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sessoes")
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "filme_id", nullable = false)
    private Filme filme;

    @ManyToOne
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;

    @Column(nullable = false)
    private LocalDate dataSessao;

    @Column(nullable = false)
    private LocalTime horario;

    private String tipoExibicao;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer assentosDisponiveis;

    @OneToMany(mappedBy = "sessao", cascade = CascadeType.ALL)
    private List<Assento> assentos = new ArrayList<>();

    @OneToMany(mappedBy = "sessao")
    private List<Reserva> reservas = new ArrayList<>();
}
