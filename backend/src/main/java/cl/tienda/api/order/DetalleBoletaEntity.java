package cl.tienda.api.order;

import cl.tienda.api.product.ProductEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "detalle_boleta")
public class DetalleBoletaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "boleta_id", nullable = false)
    private BoletaEntity boleta;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductEntity producto;

    @Column(nullable = false, length = 120)
    private String nombreProducto;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false)
    private int cantidad;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal totalLinea;

    protected DetalleBoletaEntity() {
    }

    public DetalleBoletaEntity(
            ProductEntity producto,
            String nombreProducto,
            BigDecimal precioUnitario,
            int cantidad,
            BigDecimal totalLinea
    ) {
        this.producto = producto;
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.cantidad = cantidad;
        this.totalLinea = totalLinea;
    }

    void setBoleta(BoletaEntity boleta) {
        this.boleta = boleta;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public int getCantidad() {
        return cantidad;
    }

    public BigDecimal getTotalLinea() {
        return totalLinea;
    }
}
