package com.roomify.controller;

import com.roomify.dto.MatchQuestionResponse;
import com.roomify.dto.RecommendationResponse;
import com.roomify.dto.SubmitAnswersRequest;
import com.roomify.service.MatchmakingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matchmaking")
public class MatchmakingController {

    private final MatchmakingService matchmakingService;

    public MatchmakingController(MatchmakingService matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<MatchQuestionResponse>> getQuestions() {
        return ResponseEntity.ok(matchmakingService.getQuestions());
    }

    @PostMapping("/answers")
    public ResponseEntity<Void> submitAnswers(@Valid @RequestBody SubmitAnswersRequest request) {
        matchmakingService.submitAnswers(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations() {
        return ResponseEntity.ok(matchmakingService.getRecommendations());
    }

    @GetMapping("/score")
    public ResponseEntity<Map<String, Integer>> getScore(@RequestParam Long listingId) {
        return matchmakingService.getCompatibilityScoreForListing(listingId)
                .map(score -> ResponseEntity.ok(Map.of("compatibilityScore", score)))
                .orElse(ResponseEntity.ok(Map.of()));
    }
}
