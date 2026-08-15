package com.roomify.service;

import com.roomify.domain.Listing;
import com.roomify.domain.ListingStatus;
import com.roomify.domain.ListingType;
import com.roomify.domain.User;
import com.roomify.dto.CreateListingRequest;
import com.roomify.dto.ListingResponse;
import com.roomify.dto.UpdateListingRequest;
import com.roomify.repository.ListingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ListingServiceTest {

    private ListingRepository listingRepository;
    private UserService userService;
    private ListingService listingService;

    @BeforeEach
    void setUp() {
        listingRepository = mock(ListingRepository.class);
        userService = mock(UserService.class);
        listingService = new ListingService(listingRepository, userService);
    }

    @Test
    void createAssignsTheCurrentUserAndActiveStatus() {
        User currentUser = user(7L, "Victoria");
        CreateListingRequest request = new CreateListingRequest();
        request.setListingType(ListingType.NEED_ROOMMATE);
        request.setTitle("Bright room near downtown");
        request.setLocation("Winnipeg");
        request.setRent(new BigDecimal("820.00"));

        when(userService.getCurrentUserEntity()).thenReturn(currentUser);
        when(listingRepository.save(any(Listing.class))).thenAnswer(invocation -> {
            Listing listing = invocation.getArgument(0);
            listing.setId(42L);
            return listing;
        });

        ListingResponse response = listingService.create(request);

        assertEquals(42L, response.getId());
        assertEquals("Bright room near downtown", response.getTitle());
        assertEquals(ListingStatus.ACTIVE, response.getStatus());
        assertEquals(7L, response.getCreatedById());
        verify(listingRepository).save(any(Listing.class));
    }

    @Test
    void updateRejectsAUserWhoDoesNotOwnTheListing() {
        User owner = user(10L, "Owner");
        User currentUser = user(20L, "Another user");
        Listing listing = new Listing();
        listing.setId(5L);
        listing.setCreatedBy(owner);

        when(listingRepository.findById(5L)).thenReturn(Optional.of(listing));
        when(userService.getCurrentUserEntity()).thenReturn(currentUser);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> listingService.update(5L, new UpdateListingRequest())
        );

        assertEquals("Not authorized to update this listing", exception.getMessage());
    }

    private User user(Long id, String displayName) {
        User user = new User();
        user.setId(id);
        user.setDisplayName(displayName);
        user.setEmail(displayName.toLowerCase().replace(" ", "") + "@example.com");
        user.setPasswordHash("test-hash");
        return user;
    }
}
