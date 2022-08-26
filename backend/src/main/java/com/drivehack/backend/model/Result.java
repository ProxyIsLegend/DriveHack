package com.drivehack.backend.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Result {
    @Column(name = "entity")
    private String entity;

    @Column(name = "count")
    private Long count;
}