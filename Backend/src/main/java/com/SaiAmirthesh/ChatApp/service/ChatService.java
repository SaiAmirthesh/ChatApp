package com.SaiAmirthesh.ChatApp.service;

import com.SaiAmirthesh.ChatApp.model.ChatMessage;
import com.SaiAmirthesh.ChatApp.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRepository repository;

    public ChatMessage save(ChatMessage message) {
        return repository.save(message);
    }
    public List<ChatMessage> findAll(){
        return repository.findAll();
    }

}
