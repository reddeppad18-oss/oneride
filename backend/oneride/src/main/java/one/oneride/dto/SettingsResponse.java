package one.oneride.dto;

public class SettingsResponse {

    private Boolean notificationsEnabled;

    private Boolean bookingNotificationsEnabled;

    private Boolean rideNotificationsEnabled;

    private String language;

    public SettingsResponse() {
    }

    public SettingsResponse(
            Boolean notificationsEnabled,
            Boolean bookingNotificationsEnabled,
            Boolean rideNotificationsEnabled,
            String language
    ) {
        this.notificationsEnabled = notificationsEnabled;
        this.bookingNotificationsEnabled =
                bookingNotificationsEnabled;
        this.rideNotificationsEnabled =
                rideNotificationsEnabled;
        this.language = language;
    }

    public Boolean getNotificationsEnabled() {
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(
            Boolean notificationsEnabled
    ) {
        this.notificationsEnabled =
                notificationsEnabled;
    }

    public Boolean getBookingNotificationsEnabled() {
        return bookingNotificationsEnabled;
    }

    public void setBookingNotificationsEnabled(
            Boolean bookingNotificationsEnabled
    ) {
        this.bookingNotificationsEnabled =
                bookingNotificationsEnabled;
    }

    public Boolean getRideNotificationsEnabled() {
        return rideNotificationsEnabled;
    }

    public void setRideNotificationsEnabled(
            Boolean rideNotificationsEnabled
    ) {
        this.rideNotificationsEnabled =
                rideNotificationsEnabled;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}