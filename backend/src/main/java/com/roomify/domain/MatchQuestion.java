package com.roomify.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "match_questions")
public class MatchQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 500)
    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Size(max = 50)
    private String category;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType = QuestionType.SINGLE_CHOICE;

    /** JSON array of options for choice questions, or "min,max" for scale */
    @Size(max = 2000)
    @Column(columnDefinition = "TEXT")
    private String optionsJson;

    /** Weight for compatibility scoring (higher = more important) */
    private Double weight = 1.0;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public String getOptionsJson() { return optionsJson; }
    public void setOptionsJson(String optionsJson) { this.optionsJson = optionsJson; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
}
