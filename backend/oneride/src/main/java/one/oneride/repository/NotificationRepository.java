package one.oneride.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import one.oneride.entity.Notification;
import one.oneride.entity.User;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(
            User user
    );

    List<Notification> findByUserAndReadFalseOrderByCreatedAtDesc(
            User user
    );

    long countByUserAndReadFalse(
            User user
    );
}