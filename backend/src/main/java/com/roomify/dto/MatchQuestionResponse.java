package com.roomify.dto;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.roomify.domain.MatchQuestion;
import com.roomify.domain.QuestionType;

import java.util.List;

public class MatchQuestionResponse {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private Long id;
    private String questionText;
    private String category;
    private QuestionType questionType;
    private List<String> options;
    private Double weight;

    public static MatchQuestionResponse from(MatchQuestion q) {
        MatchQuestionResponse r = new MatchQuestionResponse();
        r.setId(q.getId());
        r.setQuestionText(q.getQuestionText());
        r.setCategory(q.getCategory());
        r.setQuestionType(q.getQuestionType());
        if (q.getOptionsJson() != null && !q.getOptionsJson().isEmpty()) {
            try {
                r.setOptions(OBJECT_MAPPER.readValue(q.getOptionsJson(), new TypeReference<>() {}));
            } catch (Exception e) {
                r.setOptions(List.of());
            }
        }
        r.setWeight(q.getWeight());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public QuestionType getQuestionType() { return questionType; }
    public void setQuestionType(QuestionType questionType) { this.questionType = questionType; }
    public List<String> getOptions() { return options; }
    public void setOptions(List<String> options) { this.options = options; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
}
