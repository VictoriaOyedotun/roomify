package com.roomify.repository;

import com.roomify.domain.Listing;
import com.roomify.domain.ListingStatus;
import com.roomify.domain.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long> {

    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);

    List<Listing> findByStatusAndListingType(ListingStatus status, ListingType listingType);

    Page<Listing> findByStatusAndListingType(ListingStatus status, ListingType listingType, Pageable pageable);

    List<Listing> findByCreatedById(Long userId);

    @Query("SELECT l FROM Listing l WHERE l.status = :status AND (:type IS NULL OR l.listingType = :type) " +
           "AND (:location IS NULL OR LOWER(l.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:rentMin IS NULL OR l.rent >= :rentMin) AND (:rentMax IS NULL OR l.rent <= :rentMax)")
    Page<Listing> findByFilters(@Param("status") ListingStatus status, @Param("type") ListingType type,
                               @Param("location") String location, @Param("rentMin") BigDecimal rentMin,
                               @Param("rentMax") BigDecimal rentMax, Pageable pageable);
}
