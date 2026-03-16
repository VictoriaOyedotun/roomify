package com.roomify.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class SubmitAnswersRequest {

    /** When submitting for a listing's "ideal roommate" profile, set listingId. Otherwise null for user's own profile. */
    private Long listingId;

    @NotNull
    @Valid
    private List<AnswerEntry> answers;

    public static class AnswerEntry {
        @NotNull
        private Long questionId;
        /** Selected option index (0-based), comma-separated indices for multi, or scale value */
        private String valueText;

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public String getValueText() { return valueText; }
        public void setValueText(String valueText) { this.valueText = valueText; }
    }

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
    public List<AnswerEntry> getAnswers() { return answers; }
    public void setAnswers(List<AnswerEntry> answers) { this.answers = answers; }
}
