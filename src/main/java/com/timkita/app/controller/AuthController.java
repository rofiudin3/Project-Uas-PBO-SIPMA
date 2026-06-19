package com.timkita.app.controller;

import com.timkita.app.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** POST /api/auth/register */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, Object> body) {
        String username   = (String) body.get("username");
        String password   = (String) body.get("password");
        String fullName   = (String) body.get("fullName");
        String role       = (String) body.get("role");
        String department = (String) body.get("department");

        if (username == null || password == null || fullName == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Username, password, dan nama lengkap wajib diisi."));
        }

        Map<String, Object> result = authService.register(username, password, fullName, role, department);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    /** POST /api/auth/login */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Username dan password wajib diisi."));
        }

        Map<String, Object> result = authService.login(username, password);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return success ? ResponseEntity.ok(result) : ResponseEntity.status(401).body(result);
    }

    /** POST /api/auth/request-otp */
    @PostMapping("/request-otp")
    public ResponseEntity<Map<String, Object>> requestOtp(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        if (username == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Username wajib diisi."));
        }
        Map<String, Object> result = authService.requestOtp(username);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }

    /** POST /api/auth/verify-otp */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String otp      = (String) body.get("otp");

        if (username == null || otp == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Username dan OTP wajib diisi."));
        }

        Map<String, Object> result = authService.verifyOtp(username, otp);
        boolean success = Boolean.TRUE.equals(result.get("success"));
        return success ? ResponseEntity.ok(result) : ResponseEntity.badRequest().body(result);
    }
}
