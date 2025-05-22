package com.backend.api.repository;

import com.backend.api.model.Routine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoutineRepository extends JpaRepository<Routine, Long> {

    List<Routine> findByUserId(Long userId);

    List<Routine> findByUserIdAndDifficultyLevelIgnoreCase(Long userId, String difficultyLevel);

    @Query("SELECT r FROM Routine r WHERE r.user.id = :userId AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Routine> findByUserIdAndNameContaining(@Param("userId") Long userId, @Param("keyword") String keyword);

}