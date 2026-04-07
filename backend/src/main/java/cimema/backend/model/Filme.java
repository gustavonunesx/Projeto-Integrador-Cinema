package cimema.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
    
    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "banner_url")
    private String bannerUrl;

    @Column(name = "trailer_url")
    private String trailerUrl;
    
    @Column(nullable = false)
    private Boolean emCartaz = (Boolean) true;
    
    private LocalDateTime dataCriacao = LocalDateTime.now();
    
    @OneToMany(mappedBy = "filme", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Sessao> sessoes = new ArrayList<>();
    
   
    
}
