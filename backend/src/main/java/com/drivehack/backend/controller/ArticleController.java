package com.drivehack.backend.controller;

import com.drivehack.backend.model.Article;
import com.drivehack.backend.model.Result;
import com.drivehack.backend.repository.ArticleRepository;
import com.drivehack.backend.repository.SourceRepository;
import lombok.AllArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@RestController
public class ArticleController {
    private SourceRepository sourceRepository;
    private ArticleRepository repository;

    @GetMapping("/date")
    public List<Result> getByDate(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date start, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date end) {
        return aggregate(repository.getAllByDateGreaterThanAndDateLessThan(start, end));
    }

    @GetMapping("/date/{source}")
    @Transactional
    public List<Result> getBySourceAndDate(@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date start, @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date end, @PathVariable long source) {
        return aggregate(repository.getAllBySourceAndDateGreaterThanAndDateLessThan(
                sourceRepository.findById(source).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)),
                start,
                end
        ));
    }

    @GetMapping("/entity/{entity}")
    public List<Article> getByEntity(@PathVariable String entity) {
        return repository.getAllByEntityOrderByDate(entity);
    }

    private List<Result> aggregate(List<Article> articles) {
        Map<String, Long> results = new HashMap<>();

        for (var article : articles) {
            var it = results.get(article.getEntity());

            if (it == null) {
                results.put(article.getEntity(), 1l);
            } else {
                results.put(article.getEntity(), it + 1);
            }
        }

        return results
                .entrySet()
                .stream()
                .sorted((el1, el2) -> el2.getValue().compareTo(el1.getValue()))
                .map((o) -> new Result(o.getKey(), o.getValue()))
                .limit(10)
                .collect(Collectors.toList());
    }
}
