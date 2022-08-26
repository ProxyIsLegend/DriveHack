package com.drivehack.backend.repository;

import com.drivehack.backend.model.Source;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SourceRepository extends JpaRepository<Source, Long> {
    Optional<Source> getByName(String name);
}