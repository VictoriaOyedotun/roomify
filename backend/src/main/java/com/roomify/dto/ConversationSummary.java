package com.roomify.dto;

import java.time.Instant;

public class ConversationSummary {

    private Long id;
    private Long listingId;
    private String listingTitle;
    private String otherUserDisplayName;
    private Long otherUserId;
    private Instant lastMessageAt;
    private String lastMessagePreview;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
    public String getListingTitle() { return listingTitle; }
    public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }
    public String getOtherUserDisplayName() { return otherUserDisplayName; }
    public void setOtherUserDisplayName(String otherUserDisplayName) { this.otherUserDisplayName = otherUserDisplayName; }
    public Long getOtherUserId() { return otherUserId; }
    public void setOtherUserId(Long otherUserId) { this.otherUserId = otherUserId; }
    public Instant getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(Instant lastMessageAt) { this.lastMessageAt = lastMessageAt; }
    public String getLastMessagePreview() { return lastMessagePreview; }
    public void setLastMessagePreview(String lastMessagePreview) { this.lastMessagePreview = lastMessagePreview; }
}
