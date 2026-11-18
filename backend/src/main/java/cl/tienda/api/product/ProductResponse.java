package cl.tienda.api.product;

import java.math.BigDecimal;

public record ProductResponse(
        String id,
        String nombre,
        BigDecimal precio,
        String categoria,
        String descripcion,
        String imagen
) {
    public static ProductResponse from(ProductEntity product) {
        return new ProductResponse(
                product.getId(),
                product.getNombre(),
                product.getPrecio(),
                product.getCategoria(),
                product.getDescripcion(),
                product.getImagen()
        );
    }
}
