package com.example.backendprj.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PlanificationDTO {
    private Long id;
    private Long formationId;
    private Long formateurId;
    private Long entrepriseId;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private String type;
    private String remarques;
}
