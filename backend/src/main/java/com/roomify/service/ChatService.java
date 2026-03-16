package com.roomify.service;

import com.roomify.domain.Conversation;
import com.roomify.domain.Listing;
import com.roomify.domain.Message;
import com.roomify.domain.User;
import com.roomify.dto.ConversationSummary;
import com.roomify.dto.MessageResponse;
import com.roomify.dto.SendMessageRequest;
import com.roomify.repository.ConversationRepository;
import com.roomify.repository.ListingRepository;
import com.roomify.repository.MessageRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final ListingRepository listingRepository;
    private final UserService userService;

    public ChatService(ConversationRepository conversationRepository, MessageRepository messageRepository,
                       ListingRepository listingRepository, UserService userService) {
        this.conversationRepository = conversationRepository;
        this.messageRepository = messageRepository;
        this.listingRepository = listingRepository;
        this.userService = userService;
    }

    @Transactional
    public ConversationSummary getOrCreateConversation(Long listingId) {
        User currentUser = userService.getCurrentUserEntity();
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Listing not found"));
        User owner = listing.getCreatedBy();
        if (owner == null || owner.getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot start a conversation with yourself");
        }
        Optional<Conversation> existing = conversationRepository.findByListingIdAndOtherUserId(listingId, currentUser.getId());
        if (existing.isPresent()) {
            return toSummary(existing.get(), currentUser.getId());
        }
        Conversation conv = new Conversation();
        conv.setListing(listing);
        conv.setOwner(owner);
        conv.setOtherUser(currentUser);
        conv = conversationRepository.save(conv);
        return toSummary(conv, currentUser.getId());
    }

    public List<ConversationSummary> listMyConversations() {
        User currentUser = userService.getCurrentUserEntity();
        List<Conversation> list = conversationRepository.findByParticipantIdOrderByCreatedAtDesc(currentUser.getId());
        return list.stream()
                .map(c -> toSummary(c, currentUser.getId()))
                .collect(Collectors.toList());
    }

    public List<MessageResponse> getMessages(Long conversationId) {
        User currentUser = userService.getCurrentUserEntity();
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));
        ensureParticipant(conv, currentUser.getId());
        return messageRepository.findByConversationIdOrderByCreatedAtAsc(conv.getId()).stream()
                .map(this::toMessageResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse sendMessage(Long conversationId, SendMessageRequest request) {
        User currentUser = userService.getCurrentUserEntity();
        Conversation conv = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));
        ensureParticipant(conv, currentUser.getId());
        Message msg = new Message();
        msg.setConversation(conv);
        msg.setSender(currentUser);
        msg.setBody(request.getBody().trim());
        msg = messageRepository.save(msg);
        return toMessageResponse(msg);
    }

    private void ensureParticipant(Conversation conv, Long userId) {
        Long ownerId = conv.getOwner().getId();
        Long otherId = conv.getOtherUser().getId();
        if (!userId.equals(ownerId) && !userId.equals(otherId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant in this conversation");
        }
    }

    private ConversationSummary toSummary(Conversation c, Long currentUserId) {
        ConversationSummary s = new ConversationSummary();
        s.setId(c.getId());
        s.setListingId(c.getListing().getId());
        s.setListingTitle(c.getListing().getTitle());
        User other = currentUserId.equals(c.getOwner().getId()) ? c.getOtherUser() : c.getOwner();
        s.setOtherUserId(other.getId());
        s.setOtherUserDisplayName(other.getDisplayName() != null ? other.getDisplayName() : other.getEmail());
        messageRepository.findTopByConversationIdOrderByCreatedAtDesc(c.getId()).ifPresent(last -> {
            s.setLastMessageAt(last.getCreatedAt());
            String preview = last.getBody();
            if (preview != null && preview.length() > 80) preview = preview.substring(0, 80) + "...";
            s.setLastMessagePreview(preview);
        });
        return s;
    }

    private MessageResponse toMessageResponse(Message m) {
        MessageResponse r = new MessageResponse();
        r.setId(m.getId());
        r.setSenderId(m.getSender().getId());
        r.setSenderDisplayName(m.getSender().getDisplayName() != null ? m.getSender().getDisplayName() : m.getSender().getEmail());
        r.setBody(m.getBody());
        r.setCreatedAt(m.getCreatedAt());
        return r;
    }
}
