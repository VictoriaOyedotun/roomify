package com.roomify.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "match_answers", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"question_id", "entity_type", "entity_id"})
})
public class MatchAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private MatchQuestion question;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "entity_type", nullable = false)
    private AnswerEntityType entityType;

    @NotNull
    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    /** Selected option index(es) or scale value. Stored as string for flexibility (e.g. "0" or "0,2" or "7") */
    @Column(name = "value_text", length = 200)
    private String valueText;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public MatchQuestion getQuestion() { return question; }
    public void setQuestion(MatchQuestion question) { this.question = question; }
    public AnswerEntityType getEntityType() { return entityType; }
    public void setEntityType(AnswerEntityType entityType) { this.entityType = entityType; }
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    public String getValueText() { return valueText; }
    public void setValueText(String valueText) { this.valueText = valueText; }
}
