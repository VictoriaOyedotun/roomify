package com.roomify.dto;

import com.roomify.domain.ListingType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CreateListingRequest {

    @NotNull
    private ListingType listingType;

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @Size(max = 5000)
    private String description;

    @Size(max = 500)
    private String location;

    private BigDecimal rent;

    private LocalDate availableDate;

    private Integer numberOfRoommates;

    @Size(max = 1000)
    private String amenities;

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
}
