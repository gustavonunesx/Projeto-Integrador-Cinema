package cimema.backend.service;

import cimema.backend.model.Filme;
import cimema.backend.repository.FilmeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FilmeService {

    @Autowired
    private FilmeRepository filmeRepository;

    /**
     * Busca todos os filmes cadastrados
     * @return Lista com todos os filmes
     */
    public List<Filme> findAll() {
        return filmeRepository.findAll();
    }

    /**
     * Busca apenas filmes que estão em cartaz
     * @return Lista de filmes em cartaz
     */
    public List<Filme> findEmCartaz() {
        return filmeRepository.findByEmCartazTrue();
    }

    /**
     * Busca um filme específico pelo ID
     * @param id ID do filme
     * @return Optional contendo o filme se encontrado
     */
    public Optional<Filme> findById(String id) {
        return filmeRepository.findById(id);
    }

    /**
     * Busca filmes pelo título (busca parcial)
     * @param titulo Parte do título do filme
     * @return Lista de filmes que contém o título buscado
     */
    public List<Filme> findByTituloContaining(String titulo) {
        return filmeRepository.findByTituloContaining(titulo);
    }

    /**
     * Busca filmes por gênero
     * @param genero Gênero do filme
     * @return Lista de filmes do gênero especificado
     */
    public List<Filme> findByGenero(String genero) {
        return filmeRepository.findByGeneroContaining(genero);
    }

    /**
     * Salva um novo filme ou atualiza um existente
     * @param filme Objeto filme a ser salvo
     * @return Filme salvo
     */
    public Filme save(Filme filme) {
        return filmeRepository.save(filme);
    }

    /**
     * Deleta um filme pelo ID
     * @param id ID do filme a ser deletado
     */
    public void deleteById(String id) {
        filmeRepository.deleteById(id);
    }
}
