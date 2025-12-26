package com.spring.online.demo.service;

import com.spring.online.demo.DAO.UserDao;
import com.spring.online.demo.models.User;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import jakarta.mail.internet.MimeMessage;

@Service
public class UserService {

    @Autowired
    UserDao userDao;

    @Autowired
    JwtManager jwtManager;

    @Autowired
    JavaMailSender mailSender;

    public Map<String, Object> addUser(User user) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        
        // Validate input fields
        if (user == null) {
            response.put("status", "error");
            response.put("message", "User data is required");
            return response;
        }
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "Email is required");
            return response;
        }
        
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "Password is required");
            return response;
        }
        
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            response.put("status", "error");
            response.put("message", "Username is required");
            return response;
        }
        
        // Check if user with this email already exists
        try {
            User existingUser = userDao.findByEmail(user.getEmail());
            if (existingUser != null) {
                response.put("status", "error");
                response.put("message", "User with this email already exists");
                return response;
            }
        } catch (Exception e) {
            System.err.println("Error checking existing user: " + e.getMessage());
            // Continue with signup even if check fails (might be database issue)
        }
        
        // Debug print to check what role is being received
        System.out.println("Received user signup request - Email: " + user.getEmail() + ", Username: " + user.getUsername() + ", Role: " + user.getRole());
        
        // Set default role only if null
        if(user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("USER");
        } else {
            // Ensure role is uppercase for consistency
            user.setRole(user.getRole().toUpperCase());
        }
        
        // Debug print to check what role will be saved
        System.out.println("Saving user with role: " + user.getRole());
        
        try {
            userDao.save(user);
            System.out.println("User saved successfully with ID: " + user.getId());
            // sendMail(user.getEmail());
            
            // Generate JWT token similar to validateUser for immediate login after signup
            String token = jwtManager.generateToken(user.getEmail(), String.valueOf(user.getRole()));

            response.put("token", token);
            response.put("user", user);
            response.put("expiresIn", 3600); // 1 hour token expiry (in seconds)
            response.put("status", "success");
            response.put("message", "User created successfully");
            return response;
        } catch (Exception e) {
            System.err.println("Error saving user: " + e.getMessage());
            e.printStackTrace();
            response.put("status", "error");
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("ConstraintViolationException")) {
                response.put("message", "User with this email or username already exists");
            } else if (errorMsg != null && errorMsg.contains("DataIntegrityViolationException")) {
                response.put("message", "Invalid data. Please check your input.");
            } else {
                response.put("message", "Failed to create user: " + (errorMsg != null ? errorMsg : "Unknown error"));
            }
            return response;
        }
    }

    public Map<String, Object> validateUser(String email, String password) throws MessagingException {
        Map<String, Object> response = new HashMap<>();
        User user = userDao.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            String role = String.valueOf(user.getRole());
            String token = jwtManager.generateToken(user.getEmail(), role); // Include role in token
            // sendMail(email);
            // Create proper JSON response
            response.put("token", token);
            response.put("user", user);
            response.put("expiresIn", 3600); // 1 hour token expiry
            response.put("status", "success");
            return response;
        }
        response.put("status", "error");
        response.put("message", "Invalid Credentials");
        return response;
    }

    public User getUserById(int id) {
        return userDao.findById(id).orElse(null);
    }

    public String sendMail(String email) throws MessagingException {
        User user = userDao.findByEmail(email);
        if (user == null) {
            return "User not found";
        }
        String username = user.getUsername();
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
        String htmlContent = String.format("""
        <!DOCTYPE html>
        <html lang=\"en\">
        <head>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <title>Welcome to TuneUp</title>
            <style>
                body, html { margin: 0; padding: 0; font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #1DB954 0%%, #191414 100%%); color: #ffffff; }
                .email-container { max-width: 600px; margin: 20px auto; background: rgba(255, 255, 255, 0.1); border-radius: 15px; padding: 30px; text-align: center; }
                .header-title { font-size: 36px; font-weight: 700; color: #ffffff; }
                .welcome-message { font-size: 24px; font-weight: 600; color: #1ED760; }
                .cta-button { display: inline-block; padding: 15px 30px; background: #1ED760; color: #191414; text-decoration: none; border-radius: 50px; font-weight: 700; }
                .cta-button:hover { background: #1DB954; }
                .email-footer { margin-top: 20px; font-size: 12px; color: #ccc; }
            </style>
        </head>
        <body>
            <div class=\"email-container\">
                <h1 class=\"header-title\">Welcome to TuneUp, %s! 🎵</h1>
                <p class=\"welcome-message\">Your Musical Universe Awaits!</p>
                <p>Get ready to dive into a world where music meets magic. TuneUp is more than a platform—it's your personal soundtrack.</p>
                <a href=\"#\" class=\"cta-button\">Unleash Your Playlist</a>
                <div class=\"email-footer\">&copy; 2025 TuneUp. All rights reserved.</div>
            </div>
        </body>
        </html>
        """, username);
        helper.setTo(email);
        helper.setSubject("Welcome to TuneUp!");
        helper.setText(htmlContent, true);
        mailSender.send(mimeMessage);
        return "Mail Sent Successfully";
    }
}