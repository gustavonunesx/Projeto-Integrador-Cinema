package cimema.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "salas")
public class Sala {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome; // Ex: "Sala 1", "Sala 2"

    @Column(nullable = false)
    private Integer capacidade; // Número total de assentos

    @Column(nullable = false)
    private String tipo; // Ex: "2D", "3D", "IMAX"

    @Column(nullable = false)
    private Boolean ativa = true; // Se a sala está em funcionamento

    @OneToMany(mappedBy = "sala", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Sessao> sessoes = new ArrayList<>();
}

