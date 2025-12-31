package com.example.backendprj.controller;

import com.example.backendprj.model.Evaluation;
import com.example.backendprj.repository.EvaluationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluations")
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluationController {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @GetMapping
    public List<Evaluation> getAllEvaluations() {
        return evaluationRepository.findAll();
    }

    @PostMapping
    public Evaluation createEvaluation(@RequestBody Evaluation evaluation) {
        return evaluationRepository.save(evaluation);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Evaluation> getEvaluationById(@PathVariable Long id) {
        return evaluationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Evaluation> updateEvaluation(@PathVariable Long id, @RequestBody Evaluation details) {
        return evaluationRepository.findById(id).map(evaluation -> {
            evaluation.setNotePedagogie(details.getNotePedagogie());
            evaluation.setNoteRythme(details.getNoteRythme());
            evaluation.setNoteSupport(details.getNoteSupport());
            evaluation.setNoteMaitrise(details.getNoteMaitrise());
            evaluation.setCommentaire(details.getCommentaire());
            evaluation.setParticipant(details.getParticipant());
            evaluation.setPlanification(details.getPlanification());
            return ResponseEntity.ok(evaluationRepository.save(evaluation));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvaluation(@PathVariable Long id) {
        return evaluationRepository.findById(id).map(evaluation -> {
            evaluationRepository.delete(evaluation);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
