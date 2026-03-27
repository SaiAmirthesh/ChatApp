package com.SaiAmirthesh.ChatApp.controller;

import com.SaiAmirthesh.ChatApp.model.ChatMessage;
import com.SaiAmirthesh.ChatApp.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ChatRestController {

    private final ChatService chatService;

    @GetMapping("/messages")
    public List<ChatMessage> getMessage(){
        return chatService.findAll();
    }

}
