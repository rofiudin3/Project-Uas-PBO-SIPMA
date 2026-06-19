package com.timkita.app.controller;

import com.timkita.app.model.NotificationLog;
import com.timkita.app.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    /** GET /api/notifications/logs */
    @GetMapping("/logs")
    public ResponseEntity<List<NotificationLog>> getLogs() {
        return ResponseEntity.ok(notificationService.getAllLogs());
    }

    /** POST /api/notifications/send */
    @PostMapping("/send")
    public ResponseEntity<NotificationLog> send(@RequestBody Map<String, Object> payload) {
        NotificationLog log = notificationService.sendNotification(payload);
        return ResponseEntity.ok(log);
    }
}
