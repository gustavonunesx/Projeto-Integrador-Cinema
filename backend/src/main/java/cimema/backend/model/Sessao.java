package cimema.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    @JsonIgnore
    private Filme filme;

    @ManyToOne
    @JoinColumn(name = "sala_id", nullable = false)
    private Sala sala;

    @Column(name = "data_sessao",nullable = false)
    private LocalDate dataSessao;

    @Column(name= "horario",nullable = false)
    private LocalTime horario;

    @Column(name = "tipo_exibicao")
    private String tipoExibicao;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(name = "assentos_disponiveis", nullable = false)
    private Integer assentosDisponiveis;

    @OneToMany(mappedBy = "sessao", cascade = CascadeType.ALL)
    @JsonManagedReference("sessao-assento")
    private List<Assento> assentos = new ArrayList<>();

    @OneToMany(mappedBy = "sessao")
    @JsonManagedReference("sessao-reserva")
    private List<Reserva> reservas = new ArrayList<>();
}
