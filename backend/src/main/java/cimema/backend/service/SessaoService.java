package cimema.backend.service;

import cimema.backend.model.Assento;
import cimema.backend.model.Reserva;
import cimema.backend.model.Sessao;
import cimema.backend.model.StatusAssento;
import cimema.backend.repository.AssentoRepository;
import cimema.backend.repository.ReservaRepository;
import cimema.backend.repository.SessaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SessaoService {

    @Autowired
    private SessaoRepository sessaoRepository;

    @Autowired
    private AssentoRepository assentoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    /**
     * Busca sessões de um filme em uma data específica
     * @param filmeId ID do filme
     * @param data Data da sessão
     * @return Lista de sessões encontradas
     */
    public List<Sessao> findByFilmeAndData(String filmeId, LocalDate data) {
        return sessaoRepository.findByFilmeIdAndDataSessao(filmeId, data);
    }

    /**
     * Busca todas as sessões de uma data
     * @param data Data da sessão
     * @return Lista de sessões
     */
    public List<Sessao> findByData(LocalDate data) {
        return sessaoRepository.findByDataSessao(data);
    }

    /**
     * Busca os assentos de uma sessão específica
     * @param sessaoId ID da sessão
     * @return Mapa com informações dos assentos
     */
    public Map<String, Object> getAssentosSessao(Long sessaoId) {
        Optional<Sessao> sessaoOpt = sessaoRepository.findById(sessaoId);
        
        if (sessaoOpt.isEmpty()) {
            Map<String, Object> erro = new HashMap<>();
            erro.put("erro", "Sessão não encontrada");
            return erro;
        }

        Sessao sessao = sessaoOpt.get();
        List<Assento> assentos = assentoRepository.findBySessaoId(sessaoId);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("sessao", sessao);
        resultado.put("assentos", assentos);
        resultado.put("assentosDisponiveis", sessao.getAssentosDisponiveis());
        
        return resultado;
    }

    /**
     * Reserva um assento em uma sessão
     * @param sessaoId ID da sessão
     * @param numeroAssento Número do assento a ser reservado
     * @param cpf CPF do cliente
     * @return ResponseEntity com resultado da operação
     */
    @Transactional
    public ResponseEntity<?> reservarAssento(Long sessaoId, String numeroAssento, String cpf) {
        // Verificar se a sessão existe
        Optional<Sessao> sessaoOpt = sessaoRepository.findById(sessaoId);
        if (sessaoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Sessão não encontrada");
        }

        Sessao sessao = sessaoOpt.get();

        // Verificar se há assentos disponíveis
        if (sessao.getAssentosDisponiveis() <= 0) {
            return ResponseEntity.badRequest().body("Não há assentos disponíveis nesta sessão");
        }

        // Buscar o assento específico
        Optional<Assento> assentoOpt = assentoRepository.findBySessaoIdAndNumeroAssento(sessaoId, numeroAssento);
        
        if (assentoOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Assento não encontrado");
        }

        Assento assento = assentoOpt.get();

        // Verificar se o assento está disponível (comparando com o enum correto)
        if (assento.getStatus() != StatusAssento.DISPONIVEL) {
            return ResponseEntity.badRequest().body("Assento já está ocupado ou reservado");
        }

        // Marcar assento como reservado
        assento.setStatus(StatusAssento.RESERVADO);
        assentoRepository.save(assento);

        // Criar a reserva
        Reserva reserva = new Reserva();
        reserva.setSessao(sessao);
        reserva.setAssento(assento);
        reserva.setCpfCliente(cpf);
        reservaRepository.save(reserva);

        // Atualizar quantidade de assentos disponíveis
        sessao.setAssentosDisponiveis(sessao.getAssentosDisponiveis() - 1);
        sessaoRepository.save(sessao);

        // Retornar sucesso
        Map<String, Object> response = new HashMap<>();
        response.put("mensagem", "Reserva realizada com sucesso!");
        response.put("reserva", reserva);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Busca próximas sessões de um filme
     * @param filmeId ID do filme
     * @return Lista de próximas sessões
     */
    public List<Sessao> findProximasSessoes(String filmeId) {
        return sessaoRepository.findProximasSessoes(filmeId, LocalDate.now());
    }

    /**
     * Busca sessões com vagas disponíveis
     * @return Lista de sessões com vagas
     */
    public List<Sessao> findSessoesComVagas() {
        return sessaoRepository.findSessoesComVagas();
    }
}


