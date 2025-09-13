package com.example.demo.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/{id}")
    public Optional<User> getUser(@PathVariable String id) {
        return userService.getUser(id);
    }

    @PostMapping
    public void registerUser(@RequestBody User user) {
        System.out.println("TESTTTTTT");
        userService.registerUser(user);
    }

    @DeleteMapping(path = "/{id}")
    public void removeUser(@PathVariable String id) {
        userService.removeUser(id);
    }

    @PutMapping(path = "/{id}")
    public void updateUser(@PathVariable String id, @RequestBody User newUser) {
        userService.updateUser(id, newUser);
    }
}
