package com.roomify.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "compatibility_scores", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "listing_id"})
})
public class CompatibilityScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    /** Score 0-100 */
    private Integer score;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
}
