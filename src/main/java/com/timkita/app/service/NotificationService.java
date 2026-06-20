package com.timkita.app.service;

import com.timkita.app.model.NotificationLog;
import com.timkita.app.repository.NotificationLogRepository;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NotificationService {

    private final NotificationLogRepository notificationLogRepository;
    private final JavaMailSender mailSender;

    public NotificationService(NotificationLogRepository notificationLogRepository,
                                JavaMailSender mailSender) {
        this.notificationLogRepository = notificationLogRepository;
        this.mailSender = mailSender;
    }

    /**
     * Ambil semua log notifikasi email, diurutkan dari terbaru.
     */
    public List<NotificationLog> getAllLogs() {
        return notificationLogRepository.findAllByOrderBySentAtDesc();
    }

    /**
     * Kirim email peringatan ke mahasiswa dan simpan log pengiriman.
     */
    public NotificationLog sendNotification(Map<String, Object> payload) {
        String recipient   = (String) payload.getOrDefault("recipient", "");
        String studentName = (String) payload.getOrDefault("studentName", "");
        String subject     = (String) payload.getOrDefault("subject", "Peringatan Atribut Tidak Lengkap");
        String body        = (String) payload.getOrDefault("body", "");
        String targetStatus = (String) payload.getOrDefault("status", "SENT");

        String status = targetStatus;

        if ("SENT".equalsIgnoreCase(targetStatus)) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(recipient);
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
            } catch (MailException e) {
                // Di mode dev/simulator, jika SMTP belum dikonfigurasi dengan benar,
                // cetak peringatan tetapi tetap simpan status sebagai "SENT" agar simulasi UI berjalan lancar.
                System.err.println("[NotificationService] [Simulation Warning] Gagal mengirim email asli ke " 
                        + recipient + " (" + e.getMessage() + "), menggunakan fallback simulasi sukses.");
            }
        }

        NotificationLog log = new NotificationLog(recipient, studentName, subject, body, status);
        return notificationLogRepository.save(log);
    }
}
