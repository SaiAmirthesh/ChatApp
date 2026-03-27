package com.SaiAmirthesh.ChatApp.config;


import com.SaiAmirthesh.ChatApp.model.ChatMessage;
import com.SaiAmirthesh.ChatApp.model.MessageType;
import com.SaiAmirthesh.ChatApp.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    private final ChatService chatService;

    @EventListener
    public void HandleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        if(headerAccessor.getSessionAttributes()!=null) {
            String username = (String) headerAccessor.getSessionAttributes().get("username");
            if (username != null) {
                log.info("User disconnected:{}", username);
                var chatMessage = ChatMessage.builder()
                        .type(MessageType.LEAVE)
                        .sender(username)
                        .build();
                messageTemplate.convertAndSend("/topic/public", chatMessage);
            }
        }
    }
}
