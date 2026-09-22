package one.oneride.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvailabilityRequest {

    @NotNull
    private Boolean available;
}