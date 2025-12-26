package com.spring.online.demo.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtManager {

    public final String SEC_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890MKDJSHIEUFBEICBWIEOWDWUU";
    public final SecretKey key = Keys.hmacShaKeyFor(SEC_KEY.getBytes());

    public String generateToken(String email, String role) {
        Map<String, String> data = new HashMap<String, String>();
        data.put("email", email);
        data.put("role", role); // Include role in token

        return Jwts.builder()
                .setClaims(data)
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 3600000))
                .signWith(key)
                .compact();
    }

    public String validateToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return "401"; // Unauthorized
            }

            token = token.trim(); // Trim spaces before parsing

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            Date expiration = claims.getExpiration();
            if (expiration == null || expiration.before(new Date())) {
                return "401";
            }

            return claims.get("email", String.class);
        } catch (Exception e) {
            return "401"; // Return unauthorized on any JWT parsing error
        }
    }


}