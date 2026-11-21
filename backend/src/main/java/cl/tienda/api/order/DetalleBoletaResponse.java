package cl.tienda.api.order;

import java.math.BigDecimal;

public record DetalleBoletaResponse(
        String nombreProducto,
        BigDecimal precioUnitario,
        int cantidad,
        BigDecimal totalLinea
) {
    public static DetalleBoletaResponse from(DetalleBoletaEntity detalle) {
        return new DetalleBoletaResponse(
                detalle.getNombreProducto(),
                detalle.getPrecioUnitario(),
                detalle.getCantidad(),
                detalle.getTotalLinea()
        );
    }
}
