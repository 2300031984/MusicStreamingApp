package com.spring.online.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.online.demo.models.User;
import com.spring.online.demo.service.UserService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserService us;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> addUser(@RequestBody User user) {
        try {
            // Debug logging to check what's in the request body
            System.out.println("Received signup request - Email: " + 
                (user != null ? user.getEmail() : "null") + 
                ", Username: " + (user != null ? user.getUsername() : "null") + 
                ", Role: " + (user != null ? user.getRole() : "null"));
            
            if (user == null) {
                Map<String, Object> errorResponse = new java.util.HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "User data is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }
            
            Map<String, Object> result = us.addUser(user);
            if ("error".equals(result.get("status"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
            }
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } catch (Exception e) {
            System.err.println("Exception in signup endpoint: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new java.util.HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "An unexpected error occurred: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<Map<String, Object>> signin(@RequestBody User user) throws MessagingException {
        Map<String, Object> result = us.validateUser(user.getEmail(), user.getPassword());
        if ("error".equals(result.get("status"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
        return ResponseEntity.status(HttpStatus.OK).body(result);
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable int id) {
       return us.getUserById(id); 
    }
    
}