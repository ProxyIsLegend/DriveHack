package com.drivehack.backend.controller;

import com.drivehack.backend.model.Source;
import com.drivehack.backend.repository.SourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@AllArgsConstructor
@RestController
public class SourceController {
    private SourceRepository sourceRepository;

    @GetMapping("/sources")
    public List<Source> getAllSources() {
        return sourceRepository.findAll();
    }
}
