package cimema.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import cimema.backend.model.Filme;
import cimema.backend.service.FilmeService;

@RestController
@RequestMapping("/api/filmes")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173", "https://cinema-project-oyrucw154-gustavonunesxs-projects.vercel.app"})
public class FilmeController {

    @Autowired
    private FilmeService filmeService;

    @GetMapping
    public List<Filme> getAllFilmes() {
        return filmeService.findAll();
    }

    @GetMapping("/em-cartaz")
    public List<Filme> getFilmesEmCartaz() {
        return filmeService.findEmCartaz();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Filme> getFilmeById(@PathVariable String id) {
        return filmeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/buscar")
    public List<Filme> searchFilmes(@RequestParam String titulo) {
        return filmeService.findByTituloContaining(titulo);
    }
}
