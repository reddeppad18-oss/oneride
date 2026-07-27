package one.oneride.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;


@RestControllerAdvice
public class GlobalExceptionHandler {


    private ResponseEntity<Map<String, Object>> buildResponse(
            HttpStatus status,
            String message) {


        Map<String, Object> response = new HashMap<>();

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "status",
                status.value()
        );

        response.put(
                "message",
                message
        );


        return new ResponseEntity<>(
                response,
                status
        );
    }



    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFound(
            UserNotFoundException exception) {


        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }



    @ExceptionHandler(RideNotFoundException.class)
    public ResponseEntity<?> handleRideNotFound(
            RideNotFoundException exception) {


        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }



    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<?> handleBookingNotFound(
            BookingNotFoundException exception) {


        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }



    @ExceptionHandler(UnAuthorisedException.class)
    public ResponseEntity<?> handleUnauthorized(
            UnAuthorisedException exception) {


        return buildResponse(
                HttpStatus.FORBIDDEN,
                exception.getMessage()
        );
    }



    @ExceptionHandler(InvalidStateException.class)
    public ResponseEntity<?> handleInvalidState(
            InvalidStateException exception) {


        return buildResponse(
                HttpStatus.BAD_REQUEST,
                exception.getMessage()
        );
    }



    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneralException(
            Exception exception) {


        return buildResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                exception.getMessage()
        );
    }
    @ExceptionHandler(RentalNotFoundException.class)
    public ResponseEntity<?> handleRentalNotFound(
            RentalNotFoundException exception) {

        return buildResponse(
                HttpStatus.NOT_FOUND,
                exception.getMessage()
        );
    }
}