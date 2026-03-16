package com.roomify.repository;

import com.roomify.domain.CompatibilityScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompatibilityScoreRepository extends JpaRepository<CompatibilityScore, Long> {

    List<CompatibilityScore> findByUserIdOrderByScoreDesc(Long userId);

    Optional<CompatibilityScore> findByUserIdAndListingId(Long userId, Long listingId);

    void deleteByUserId(Long userId);
}
