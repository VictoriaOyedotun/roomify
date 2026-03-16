package com.roomify.service;

import com.roomify.domain.*;
import com.roomify.dto.MatchQuestionResponse;
import com.roomify.dto.RecommendationResponse;
import com.roomify.dto.SubmitAnswersRequest;
import com.roomify.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MatchmakingService {

    private final MatchQuestionRepository questionRepository;
    private final MatchAnswerRepository answerRepository;
    private final CompatibilityScoreRepository scoreRepository;
    private final ListingRepository listingRepository;
    private final UserService userService;

    public MatchmakingService(MatchQuestionRepository questionRepository, MatchAnswerRepository answerRepository,
                              CompatibilityScoreRepository scoreRepository, ListingRepository listingRepository,
                              UserService userService) {
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.scoreRepository = scoreRepository;
        this.listingRepository = listingRepository;
        this.userService = userService;
    }

    public List<MatchQuestionResponse> getQuestions() {
        return questionRepository.findAllByOrderByCategoryAscIdAsc().stream()
                .map(MatchQuestionResponse::from)
                .toList();
    }

    @Transactional
    public void submitAnswers(SubmitAnswersRequest request) {
        User user = userService.getCurrentUserEntity();
        AnswerEntityType entityType;
        Long entityId;
        if (request.getListingId() != null) {
            Listing listing = listingRepository.findById(request.getListingId())
                    .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
            if (!listing.getCreatedBy().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Not authorized to set profile for this listing");
            }
            entityType = AnswerEntityType.LISTING;
            entityId = listing.getId();
        } else {
            entityType = AnswerEntityType.USER;
            entityId = user.getId();
        }
        answerRepository.deleteByEntityTypeAndEntityId(entityType, entityId);
        for (SubmitAnswersRequest.AnswerEntry entry : request.getAnswers()) {
            MatchQuestion question = questionRepository.findById(entry.getQuestionId())
                    .orElseThrow(() -> new IllegalArgumentException("Question not found: " + entry.getQuestionId()));
            MatchAnswer answer = new MatchAnswer();
            answer.setQuestion(question);
            answer.setEntityType(entityType);
            answer.setEntityId(entityId);
            answer.setValueText(entry.getValueText() != null ? entry.getValueText() : "");
            answerRepository.save(answer);
        }
        if (entityType == AnswerEntityType.USER) {
            recomputeScoresForUser(user.getId());
        } else {
            recomputeScoresForListing(entityId);
        }
    }

    private void recomputeScoresForUser(Long userId) {
        scoreRepository.deleteByUserId(userId);
        List<Listing> activeListings = listingRepository.findByStatusAndListingType(ListingStatus.ACTIVE, ListingType.NEED_ROOMMATE);
        for (Listing listing : activeListings) {
            List<MatchAnswer> listingAnswers = answerRepository.findByEntityTypeAndEntityId(AnswerEntityType.LISTING, listing.getId());
            if (listingAnswers.isEmpty()) continue;
            int score = computeCompatibility(userId, listing.getId());
            CompatibilityScore cs = new CompatibilityScore();
            cs.setUserId(userId);
            cs.setListingId(listing.getId());
            cs.setScore(score);
            scoreRepository.save(cs);
        }
    }

    private void recomputeScoresForListing(Long listingId) {
        List<Long> usersWithAnswers = answerRepository.findDistinctEntityIdsByEntityType(AnswerEntityType.USER);
        for (Long userId : usersWithAnswers) {
            int score = computeCompatibility(userId, listingId);
            Optional<CompatibilityScore> existing = scoreRepository.findByUserIdAndListingId(userId, listingId);
            if (existing.isPresent()) {
                existing.get().setScore(score);
                scoreRepository.save(existing.get());
            } else {
                CompatibilityScore cs = new CompatibilityScore();
                cs.setUserId(userId);
                cs.setListingId(listingId);
                cs.setScore(score);
                scoreRepository.save(cs);
            }
        }
    }

    private int computeCompatibility(Long userId, Long listingId) {
        List<MatchAnswer> userAnswers = answerRepository.findByEntityTypeAndEntityId(AnswerEntityType.USER, userId);
        List<MatchAnswer> listingAnswers = answerRepository.findByEntityTypeAndEntityId(AnswerEntityType.LISTING, listingId);
        if (listingAnswers.isEmpty()) return 50; // default when listing has no profile
        Map<Long, String> userMap = userAnswers.stream().collect(Collectors.toMap(a -> a.getQuestion().getId(), MatchAnswer::getValueText, (a, b) -> a));
        double totalWeight = 0;
        double matchWeight = 0;
        for (MatchAnswer la : listingAnswers) {
            Long qId = la.getQuestion().getId();
            Double w = la.getQuestion().getWeight() != null ? la.getQuestion().getWeight() : 1.0;
            totalWeight += w;
            String userVal = userMap.get(qId);
            if (userVal != null && userVal.equals(la.getValueText())) {
                matchWeight += w;
            }
        }
        if (totalWeight == 0) return 50;
        return (int) Math.round(100.0 * matchWeight / totalWeight);
    }

    public List<RecommendationResponse> getRecommendations() {
        User user = userService.getCurrentUserEntity();
        List<MatchAnswer> userAnswers = answerRepository.findByEntityTypeAndEntityId(AnswerEntityType.USER, user.getId());
        if (userAnswers.isEmpty()) {
            return List.of(); // or return all active listings with score 50
        }
        recomputeScoresForUser(user.getId());
        List<CompatibilityScore> scores = scoreRepository.findByUserIdOrderByScoreDesc(user.getId());
        List<RecommendationResponse> result = new ArrayList<>();
        for (CompatibilityScore cs : scores) {
            Listing listing = listingRepository.findById(cs.getListingId()).orElse(null);
            if (listing == null || listing.getStatus() != ListingStatus.ACTIVE) continue;
            RecommendationResponse r = new RecommendationResponse();
            r.setListingId(listing.getId());
            r.setCompatibilityScore(cs.getScore());
            r.setListingType(listing.getListingType());
            r.setTitle(listing.getTitle());
            r.setDescription(listing.getDescription());
            r.setLocation(listing.getLocation());
            r.setRent(listing.getRent());
            r.setAvailableDate(listing.getAvailableDate());
            if (listing.getCreatedBy() != null) {
                r.setCreatedByDisplayName(listing.getCreatedBy().getDisplayName());
            }
            result.add(r);
        }
        return result;
    }
}
