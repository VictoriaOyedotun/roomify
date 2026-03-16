package com.roomify.repository;

import com.roomify.domain.Conversation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByListingIdAndOtherUserId(Long listingId, Long otherUserId);

    @Query("SELECT c FROM Conversation c WHERE c.owner.id = :userId OR c.otherUser.id = :userId ORDER BY c.createdAt DESC")
    List<Conversation> findByParticipantIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
