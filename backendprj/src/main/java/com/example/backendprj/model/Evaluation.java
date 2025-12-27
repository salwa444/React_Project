package com.example.backendprj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "participant_id", nullable = false)
    private Participant participant;

    @ManyToOne
    @JoinColumn(name = "planification_id", nullable = false)
    private Planification planification;

    @Column(name = "note_pedagogie", nullable = false)
    private int notePedagogie;

    @Column(name = "note_rythme", nullable = false)
    private int noteRythme;

    @Column(name = "note_support", nullable = false)
    private int noteSupport;

    @Column(name = "note_maitrise", nullable = false)
    private int noteMaitrise;

    private String commentaire;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
