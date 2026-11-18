package cl.tienda.api.product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank @Size(max = 120) String nombre,
        @NotNull @DecimalMin("0.0") @Digits(integer = 10, fraction = 2) BigDecimal precio,
        @NotBlank @Size(max = 80) String categoria,
        @NotBlank @Size(max = 2000) String descripcion,
        @NotBlank @Size(max = 1000) String imagen
) {
}
