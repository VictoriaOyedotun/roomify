package com.roomify.dto;

import com.roomify.domain.Listing;
import com.roomify.domain.ListingStatus;
import com.roomify.domain.ListingType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class ListingResponse {

    private Long id;
    private ListingType listingType;
    private String title;
    private String description;
    private String location;
    private BigDecimal rent;
    private LocalDate availableDate;
    private Integer numberOfRoommates;
    private String amenities;
    private ListingStatus status;
    private Long createdById;
    private String createdByDisplayName;
    private Instant createdAt;
    private Instant updatedAt;

    public static ListingResponse from(Listing listing) {
        ListingResponse r = new ListingResponse();
        r.setId(listing.getId());
        r.setListingType(listing.getListingType());
        r.setTitle(listing.getTitle());
        r.setDescription(listing.getDescription());
        r.setLocation(listing.getLocation());
        r.setRent(listing.getRent());
        r.setAvailableDate(listing.getAvailableDate());
        r.setNumberOfRoommates(listing.getNumberOfRoommates());
        r.setAmenities(listing.getAmenities());
        r.setStatus(listing.getStatus());
        if (listing.getCreatedBy() != null) {
            r.setCreatedById(listing.getCreatedBy().getId());
            r.setCreatedByDisplayName(listing.getCreatedBy().getDisplayName());
        }
        r.setCreatedAt(listing.getCreatedAt());
        r.setUpdatedAt(listing.getUpdatedAt());
        return r;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Integer getNumberOfRoommates() { return numberOfRoommates; }
    public void setNumberOfRoommates(Integer numberOfRoommates) { this.numberOfRoommates = numberOfRoommates; }
    public String getAmenities() { return amenities; }
    public void setAmenities(String amenities) { this.amenities = amenities; }
    public ListingStatus getStatus() { return status; }
    public void setStatus(ListingStatus status) { this.status = status; }
    public Long getCreatedById() { return createdById; }
    public void setCreatedById(Long createdById) { this.createdById = createdById; }
    public String getCreatedByDisplayName() { return createdByDisplayName; }
    public void setCreatedByDisplayName(String createdByDisplayName) { this.createdByDisplayName = createdByDisplayName; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
