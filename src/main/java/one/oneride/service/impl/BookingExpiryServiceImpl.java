package one.oneride.service.impl;

import lombok.RequiredArgsConstructor;
import one.oneride.entity.Booking;
import one.oneride.enums.BookingStatus;
import one.oneride.repository.BookingRepository;
import one.oneride.service.BookingExpiryService;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingExpiryServiceImpl
        implements BookingExpiryService {


    private final BookingRepository bookingRepository;


    @Override
    @Scheduled(fixedRate = 300000)
    public void expireBookings() {


        List<Booking> expiredBookings =
                bookingRepository.findByStatusAndExpiresAtBefore(
                        BookingStatus.PENDING,
                        LocalDateTime.now()
                );


        for (Booking booking : expiredBookings) {

            booking.setStatus(
                    BookingStatus.EXPIRED
            );
        }


        bookingRepository.saveAll(expiredBookings);
    }
}

