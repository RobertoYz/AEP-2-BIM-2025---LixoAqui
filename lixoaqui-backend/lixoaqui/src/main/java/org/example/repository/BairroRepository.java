package org.example.repository;

import org.example.model.Bairro;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BairroRepository extends JpaRepository<Bairro, Long> {

    List<Bairro> findByNomeContainingIgnoreCase(String nome);
    Optional<Bairro> findByNomeIgnoreCase(String nome);
}