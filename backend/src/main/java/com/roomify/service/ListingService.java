package com.roomify.service;

import com.roomify.domain.Listing;
import com.roomify.domain.ListingStatus;
import com.roomify.domain.ListingType;
import com.roomify.domain.User;
import com.roomify.dto.CreateListingRequest;
import com.roomify.dto.ListingResponse;
import com.roomify.dto.UpdateListingRequest;
import com.roomify.repository.ListingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ListingService {

    private final ListingRepository listingRepository;
    private final UserService userService;

    public ListingService(ListingRepository listingRepository, UserService userService) {
        this.listingRepository = listingRepository;
        this.userService = userService;
    }

    public Page<ListingResponse> list(ListingType type, String location, java.math.BigDecimal rentMin,
                                       java.math.BigDecimal rentMax, Pageable pageable) {
        Page<Listing> page = listingRepository.findByFilters(
                ListingStatus.ACTIVE, type, (location != null && !location.isBlank()) ? location : null,
                rentMin, rentMax, pageable);
        return page.map(ListingResponse::from);
    }

    public ListingResponse getById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        return ListingResponse.from(listing);
    }

    @Transactional
    public ListingResponse create(CreateListingRequest request) {
        User user = userService.getCurrentUserEntity();
        Listing listing = new Listing();
        listing.setListingType(request.getListingType());
        listing.setTitle(request.getTitle());
        listing.setDescription(request.getDescription());
        listing.setLocation(request.getLocation());
        listing.setRent(request.getRent());
        listing.setAvailableDate(request.getAvailableDate());
        listing.setNumberOfRoommates(request.getNumberOfRoommates());
        listing.setAmenities(request.getAmenities());
        listing.setStatus(ListingStatus.ACTIVE);
        listing.setCreatedBy(user);
        listing = listingRepository.save(listing);
        return ListingResponse.from(listing);
    }

    @Transactional
    public ListingResponse update(Long id, UpdateListingRequest request) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        if (!listing.getCreatedBy().getId().equals(userService.getCurrentUserEntity().getId())) {
            throw new IllegalArgumentException("Not authorized to update this listing");
        }
        if (request.getTitle() != null) listing.setTitle(request.getTitle());
        if (request.getDescription() != null) listing.setDescription(request.getDescription());
        if (request.getLocation() != null) listing.setLocation(request.getLocation());
        if (request.getRent() != null) listing.setRent(request.getRent());
        if (request.getAvailableDate() != null) listing.setAvailableDate(request.getAvailableDate());
        if (request.getNumberOfRoommates() != null) listing.setNumberOfRoommates(request.getNumberOfRoommates());
        if (request.getAmenities() != null) listing.setAmenities(request.getAmenities());
        if (request.getStatus() != null) listing.setStatus(request.getStatus());
        listing = listingRepository.save(listing);
        return ListingResponse.from(listing);
    }

    @Transactional
    public void delete(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found"));
        if (!listing.getCreatedBy().getId().equals(userService.getCurrentUserEntity().getId())) {
            throw new IllegalArgumentException("Not authorized to delete this listing");
        }
        listingRepository.delete(listing);
    }

    public java.util.List<ListingResponse> getMyListings() {
        User user = userService.getCurrentUserEntity();
        return listingRepository.findByCreatedById(user.getId()).stream()
                .map(ListingResponse::from)
                .toList();
    }

    public Listing getListingEntity(Long id) {
        return listingRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Listing not found"));
    }
}
