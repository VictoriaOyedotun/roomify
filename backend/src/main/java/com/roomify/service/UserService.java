package com.roomify.service;

import com.roomify.domain.User;
import com.roomify.dto.UpdateUserRequest;
import com.roomify.dto.UserResponse;
import com.roomify.repository.UserRepository;
import com.roomify.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse getCurrentUser() {
        User user = getCurrentUserEntity();
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse updateCurrentUser(UpdateUserRequest request) {
        User user = getCurrentUserEntity();
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        user = userRepository.save(user);
        return UserResponse.from(user);
    }

    public User getCurrentUserEntity() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }
}
