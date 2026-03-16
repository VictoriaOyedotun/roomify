package com.roomify.repository;

import com.roomify.domain.MatchQuestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchQuestionRepository extends JpaRepository<MatchQuestion, Long> {

    List<MatchQuestion> findAllByOrderByCategoryAscIdAsc();
}
