package com.drivehack.backend.repository;

import com.drivehack.backend.model.Article;
import com.drivehack.backend.model.Result;
import com.drivehack.backend.model.Source;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import javax.persistence.Entity;
import java.util.Date;
import java.util.List;

public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> getAllByEntityOrderByDate(String entity);

    List<Article> getAllByDateGreaterThanAndDateLessThan(Date lower, Date upper);

    List<Article> getAllBySourceAndDateGreaterThanAndDateLessThan(Source source, Date lower, Date upper);
}