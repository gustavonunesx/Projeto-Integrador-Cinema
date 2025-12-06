package cimema.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;


import jakarta.persistence.*;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "filmes")
public class Filme {

    @Id
    private String id;
    
    @Column(nullable = false)
    private String titulo;
    
    @Column(nullable = false)
    private String duracao;
    
    @Column(nullable = false)
    private String genero;
    
    @Column(nullable = false)
    private String classificacao;
    
    @Column(columnDefinition = "TEXT")
    private String descricao;
    
    private String posterUrl;
    private String bannerUrl;
    private String trailerUrl;
    
    @Column(nullable = false)
    private Boolean emCartaz = (Boolean) true;
    
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Sessao> sessoes = new ArrayList<>();
    
   
    
}
