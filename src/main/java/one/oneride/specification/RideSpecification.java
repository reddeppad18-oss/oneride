package one.oneride.specification;

import one.oneride.entity.Ride;
import one.oneride.enums.RideStatus;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public class RideSpecification {

    public static Specification<Ride> searchRide(

            String source,
            String destination,
            LocalDate travelDate,
            Integer availableSeats,
            Double maxPrice

    ) {

        return (root, query, cb) -> {

            var predicate = cb.conjunction();

            predicate = cb.and(
                    predicate,
                    cb.equal(
                            root.get("status"),
                            RideStatus.ACTIVE
                    )
            );

            if (source != null && !source.isBlank()) {

                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(root.get("source")),
                                "%" + source.toLowerCase() + "%"
                        )
                );
            }

            if (destination != null && !destination.isBlank()) {

                predicate = cb.and(
                        predicate,
                        cb.like(
                                cb.lower(root.get("destination")),
                                "%" + destination.toLowerCase() + "%"
                        )
                );
            }

            if (travelDate != null) {

                predicate = cb.and(
                        predicate,
                        cb.equal(
                                root.get("travelDate"),
                                travelDate
                        )
                );
            }

            if (availableSeats != null) {

                predicate = cb.and(
                        predicate,
                        cb.greaterThanOrEqualTo(
                                root.get("availableSeats"),
                                availableSeats
                        )
                );
            }

            if (maxPrice != null) {

                predicate = cb.and(
                        predicate,
                        cb.lessThanOrEqualTo(
                                root.get("pricePerSeat"),
                                maxPrice
                        )
                );
            }

            return predicate;
        };
    }
}