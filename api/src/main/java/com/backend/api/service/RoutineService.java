package com.backend.api.service;


import com.backend.api.model.Routine;

import com.backend.api.model.User;

import com.backend.api.repository.RoutineRepository;
import com.backend.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RoutineService {

    @Autowired
    private RoutineRepository routineRepository;


    @Autowired
    private UserRepository userRepository;

    public List<Routine> getRoutinesByUserId(Long userId) {
        return routineRepository.findByUserId(userId);
    }

    public List<Routine> getRoutinesByUserIdAndDifficulty(Long userId, String difficultyLevel) {
        return routineRepository.findByUserIdAndDifficultyLevelIgnoreCase(userId, difficultyLevel);
    }

    @Transactional
    public Routine createRoutine(Routine routine, Long userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isPresent()) {
            routine.setUser(user.get());
            return routineRepository.save(routine);
        }

        return null;
    }

    @Transactional
    public Routine updateRoutine(Long id, Routine routineDetails) {
        Optional<Routine> routine = routineRepository.findById(id);

        if (routine.isPresent()) {
            Routine existingRoutine = routine.get();
            existingRoutine.setName(routineDetails.getName());
            existingRoutine.setDescription(routineDetails.getDescription());
            existingRoutine.setDifficultyLevel(routineDetails.getDifficultyLevel());
            existingRoutine.setDurationMinutes(routineDetails.getDurationMinutes());

            return routineRepository.save(existingRoutine);
        }

        return null;
    }

    @Transactional
    public boolean deleteRoutine(Long id) {
        Optional<Routine> routine = routineRepository.findById(id);

        if (routine.isPresent()) {
            routineRepository.delete(routine.get());
            return true;
        }

        return false;
    }

}
