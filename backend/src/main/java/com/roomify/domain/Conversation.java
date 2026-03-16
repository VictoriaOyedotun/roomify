package com.roomify.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "conversations", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "listing_id", "other_user_id" })
})
public class Conversation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "other_user_id", nullable = false)
    private User otherUser;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Listing getListing() { return listing; }
    public void setListing(Listing listing) { this.listing = listing; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
    public User getOtherUser() { return otherUser; }
    public void setOtherUser(User otherUser) { this.otherUser = otherUser; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
