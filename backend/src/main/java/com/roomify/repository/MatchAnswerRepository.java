package com.roomify.repository;

import com.roomify.domain.AnswerEntityType;
import com.roomify.domain.MatchAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatchAnswerRepository extends JpaRepository<MatchAnswer, Long> {

    List<MatchAnswer> findByEntityTypeAndEntityId(AnswerEntityType entityType, Long entityId);

    Optional<MatchAnswer> findByQuestionIdAndEntityTypeAndEntityId(Long questionId, AnswerEntityType entityType, Long entityId);

    @Modifying
    @Query("DELETE FROM MatchAnswer a WHERE a.entityType = :entityType AND a.entityId = :entityId")
    void deleteByEntityTypeAndEntityId(@Param("entityType") AnswerEntityType entityType, @Param("entityId") Long entityId);

    @Query("SELECT DISTINCT a.entityId FROM MatchAnswer a WHERE a.entityType = :entityType")
    List<Long> findDistinctEntityIdsByEntityType(@Param("entityType") AnswerEntityType entityType);
}
