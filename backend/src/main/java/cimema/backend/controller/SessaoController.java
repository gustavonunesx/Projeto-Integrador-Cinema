package cimema.backend.controller;

import cimema.backend.model.Sessao;
import cimema.backend.service.SessaoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/sessoes")
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500", "http://localhost:5173"})
public class SessaoController {

    @Autowired
    private SessaoService sessaoService;

    @GetMapping("/filme/{filmeId}")
    public List<Sessao> getSessoesPorFilme(
            @PathVariable String filmeId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data) {
        return sessaoService.findByFilmeAndData(filmeId, data);
    }

    @GetMapping("/{id}/assentos")
    public ResponseEntity<?> getAssentosSessao(@PathVariable Long id) {
        return ResponseEntity.ok(sessaoService.getAssentosSessao(id));
    }

    @PostMapping("/{sessaoId}/reservar")
    public ResponseEntity<?> reservarAssento(
            @PathVariable Long sessaoId,
            @RequestParam String numeroAssento,
            @RequestParam String cpf) {
        return sessaoService.reservarAssento(sessaoId, numeroAssento, cpf);
    }
}
