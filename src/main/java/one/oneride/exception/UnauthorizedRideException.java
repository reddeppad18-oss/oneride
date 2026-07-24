package one.oneride.exception;

public class UnauthorizedRideException extends RuntimeException {

    public UnauthorizedRideException(String message) {
        super(message);
    }
}