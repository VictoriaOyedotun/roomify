package com.roomify.dto;

import com.roomify.domain.ListingType;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RecommendationResponse {

    private Long listingId;
    private Integer compatibilityScore;
    private ListingType listingType;
    private String title;
    private String description;
    private String location;
    private BigDecimal rent;
    private LocalDate availableDate;
    private String createdByDisplayName;

    public Long getListingId() { return listingId; }
    public void setListingId(Long listingId) { this.listingId = listingId; }
    public Integer getCompatibilityScore() { return compatibilityScore; }
    public void setCompatibilityScore(Integer compatibilityScore) { this.compatibilityScore = compatibilityScore; }
    public ListingType getListingType() { return listingType; }
    public void setListingType(ListingType listingType) { this.listingType = listingType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public BigDecimal getRent() { return rent; }
    public void setRent(BigDecimal rent) { this.rent = rent; }
    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }
    public String getCreatedByDisplayName() { return createdByDisplayName; }
    public void setCreatedByDisplayName(String createdByDisplayName) { this.createdByDisplayName = createdByDisplayName; }
}
