package org.example.controller;

import org.example.model.Bairro;
import org.example.repository.BairroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bairros")
@CrossOrigin(origins = "*")
public class BairroController {

    @Autowired
    private BairroRepository bairroRepository;

    @GetMapping("/buscar")
    public List<Bairro> buscarBairros(@RequestParam String nome) {
        return bairroRepository.findByNomeContainingIgnoreCase(nome);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bairro> getBairroById(@PathVariable Long id) {
        return bairroRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarBairro(@PathVariable Long id) {
        if (!bairroRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        bairroRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<?> cadastrarBairro(@RequestBody Bairro bairro) {
        if (bairroRepository.findByNomeIgnoreCase(bairro.getNome()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Um bairro com este nome já existe.");
        }
        bairro.getColetas().forEach(coleta -> coleta.setBairro(bairro));
        Bairro novoBairro = bairroRepository.save(bairro);
        return new ResponseEntity<>(novoBairro, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarBairro(@PathVariable Long id, @RequestBody Bairro bairroAtualizado) {
        Optional<Bairro> bairroExistenteOpt = bairroRepository.findById(id);
        if (bairroExistenteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Optional<Bairro> conflitoOpt = bairroRepository.findByNomeIgnoreCase(bairroAtualizado.getNome());
        if (conflitoOpt.isPresent() && !conflitoOpt.get().getId().equals(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Um bairro com este nome já existe.");
        }

        Bairro bairroExistente = bairroExistenteOpt.get();
        bairroExistente.setNome(bairroAtualizado.getNome());
        bairroExistente.getColetas().clear();
        bairroAtualizado.getColetas().forEach(coleta -> {
            coleta.setBairro(bairroExistente);
            bairroExistente.getColetas().add(coleta);});

        Bairro salvo = bairroRepository.save(bairroExistente);

        return ResponseEntity.ok(salvo);
    }
}