package cl.tienda.api.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record BoletaResponse(
        Long id,
        String clienteEmail,
        String nombreEntrega,
        String correoEntrega,
        String direccion,
        LocalDateTime fechaCreacion,
        BigDecimal subtotal,
        BigDecimal descuento,
        BigDecimal total,
        String estado,
        List<DetalleBoletaResponse> detalles
) {
    public static BoletaResponse from(BoletaEntity boleta) {
        return new BoletaResponse(
                boleta.getId(),
                boleta.getCliente().getEmail(),
                boleta.getNombreEntrega(),
                boleta.getCorreoEntrega(),
                boleta.getDireccion(),
                boleta.getFechaCreacion(),
                boleta.getSubtotal(),
                boleta.getDescuento(),
                boleta.getTotal(),
                boleta.getEstado(),
                boleta.getDetalles().stream().map(DetalleBoletaResponse::from).toList()
        );
    }
}
