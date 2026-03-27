package com.SaiAmirthesh.ChatApp.repository;

import com.SaiAmirthesh.ChatApp.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<ChatMessage,Long> {
}
