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
    }

    public void removeUser(String id) {
        boolean userExists = userRepository.existsById(id);
        if (!userExists) {
            throw new IllegalStateException("A user of that ID does not exist");
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public void updateUser(String id, User newUser) {
        User existingUser = userRepository.findById(id).orElseThrow(
                () -> new IllegalStateException("User not found")
        );

        existingUser.setColor(newUser.getColor());
        existingUser.setxZoom(newUser.getxZoom());
        existingUser.setyZoom(newUser.getyZoom());

    }

}
