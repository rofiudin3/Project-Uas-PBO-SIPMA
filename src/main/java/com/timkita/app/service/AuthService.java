package com.timkita.app.service;

import com.timkita.app.model.Admin;
import com.timkita.app.repository.AdminRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registrasi akun admin baru.
     */
    public Map<String, Object> register(String username, String password, String fullName, String role, String department) {
        Map<String, Object> response = new HashMap<>();

        if (adminRepository.existsByUsername(username)) {
            response.put("success", false);
            response.put("message", "Username sudah terdaftar.");
            return response;
        }

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFullName(fullName);
        admin.setRole(role != null ? role : "Academic Inspector");
        admin.setDepartment(department != null ? department : "Panitia Monitor");

        adminRepository.save(admin);

        response.put("success", true);
        response.put("message", "Akun berhasil didaftarkan. Menunggu persetujuan administrator.");
        return response;
    }

    /**
     * Login admin dengan username dan password.
     */
    public Map<String, Object> login(String username, String password) {
        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Username atau password salah.");
            return response;
        }

        Admin admin = adminOpt.get();
        if (!passwordEncoder.matches(password, admin.getPassword())) {
            response.put("success", false);
            response.put("message", "Username atau password salah.");
            return response;
        }

        // Simulasi token sederhana (gunakan JWT di production)
        String token = "sipma-token-" + admin.getId() + "-" + System.currentTimeMillis();

        response.put("success", true);
        response.put("message", "Login berhasil.");
        response.put("token", token);
        response.put("adminId", admin.getId());
        response.put("username", admin.getUsername());
        response.put("fullName", admin.getFullName());
        response.put("role", admin.getRole());
        response.put("department", admin.getDepartment());
        response.put("avatarUrl", admin.getAvatarUrl());
        return response;
    }

    /**
     * Generate OTP 6 digit dan simpan ke database (simulasi).
     * Di production: kirim via email/SMS.
     */
    public Map<String, Object> requestOtp(String username) {
        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Akun dengan username tersebut tidak ditemukan.");
            return response;
        }

        Admin admin = adminOpt.get();
        String otp = String.format("%06d", new Random().nextInt(999999));
        admin.setOtpCode(otp);
        admin.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        adminRepository.save(admin);

        // Di production: kirim OTP via email. Untuk dev, tampilkan di response.
        response.put("success", true);
        response.put("message", "OTP berhasil digenerate.");
        response.put("otp", otp); // Hanya untuk development/testing!
        return response;
    }

    /**
     * Verifikasi kode OTP yang dikirimkan pengguna.
     */
    public Map<String, Object> verifyOtp(String username, String otp) {
        Map<String, Object> response = new HashMap<>();

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isEmpty()) {
            response.put("success", false);
            response.put("message", "Akun tidak ditemukan.");
            return response;
        }

        Admin admin = adminOpt.get();

        if (admin.getOtpCode() == null || !admin.getOtpCode().equals(otp)) {
            response.put("success", false);
            response.put("message", "Kode OTP tidak valid.");
            return response;
        }

        if (admin.getOtpExpiry() == null || LocalDateTime.now().isAfter(admin.getOtpExpiry())) {
            response.put("success", false);
            response.put("message", "Kode OTP sudah kedaluwarsa. Silakan minta OTP baru.");
            return response;
        }

        // Hapus OTP setelah berhasil diverifikasi
        admin.setOtpCode(null);
        admin.setOtpExpiry(null);
        adminRepository.save(admin);

        response.put("success", true);
        response.put("message", "OTP berhasil diverifikasi.");
        return response;
    }
}
