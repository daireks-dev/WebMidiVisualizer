package com.example.demo.user;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUser(String id) {
        boolean userExists = userRepository.existsById(id);
        if (!userExists) {
            throw new IllegalStateException("A user of that ID does not exist");
        }
        return userRepository.findById(id);
    }

    public void registerUser(User user) {
        if (user == null) {
            throw new IllegalStateException("User not provided");
        }
        userRepository.save(user);

        System.out.println(user.getThemes().get(0).getTrack_colors());
        System.out.println(user.getThemes().get(1).getTrack_colors());
        System.out.println(user.getThemes().get(2).getTrack_colors());
        System.out.println(user.getThemes().get(3).getTrack_colors());
    }

    public void removeUser(String id) {
        boolean userExists = userRepository.existsById(id);
        if (!userExists) {
            throw new IllegalStateException("A user of that ID does not exist");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public User updateUser(String id, User user) {
        User existing = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update themes
        existing.getThemes().clear();
        if (user.getThemes() != null) {
            for (Theme theme : user.getThemes()) {
                theme.setUser(existing); // link to managed User
                existing.getThemes().add(theme);
            }
        }

        return userRepository.save(existing); // save managed entity
    }

}
