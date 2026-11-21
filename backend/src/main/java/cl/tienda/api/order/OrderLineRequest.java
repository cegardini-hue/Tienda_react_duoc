package cl.tienda.api.order;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrderLineRequest(
        @NotBlank @Size(max = 64) String productoId,
        @NotNull @Min(1) @Max(99) Integer cantidad
) {
}
