package com.roomify.controller;

import com.roomify.domain.ListingType;
import com.roomify.dto.CreateListingRequest;
import com.roomify.dto.ListingResponse;
import com.roomify.dto.UpdateListingRequest;
import com.roomify.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/listings")
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    @GetMapping
    public ResponseEntity<Page<ListingResponse>> list(
            @RequestParam(required = false) ListingType type,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal rentMin,
            @RequestParam(required = false) BigDecimal rentMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(listingService.list(type, location, rentMin, rentMax, PageRequest.of(page, size)));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> myListings() {
        return ResponseEntity.ok(listingService.getMyListings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ListingResponse> create(@Valid @RequestBody CreateListingRequest request) {
        return ResponseEntity.ok(listingService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> update(@PathVariable Long id, @Valid @RequestBody UpdateListingRequest request) {
        return ResponseEntity.ok(listingService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        listingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
