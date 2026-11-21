package cl.tienda.api.order;

import cl.tienda.api.user.UserEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boletas")
public class BoletaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private UserEntity cliente;

    @Column(nullable = false, length = 120)
    private String nombreEntrega;

    @Column(nullable = false, length = 254)
    private String correoEntrega;

    @Column(nullable = false, length = 500)
    private String direccion;

    @Column(nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal subtotal;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal descuento;

    @Column(nullable = false, precision = 16, scale = 2)
    private BigDecimal total;

    @Column(nullable = false, length = 30)
    private String estado;

    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleBoletaEntity> detalles = new ArrayList<>();

    protected BoletaEntity() {
    }

    public BoletaEntity(
            UserEntity cliente,
            String nombreEntrega,
            String correoEntrega,
            String direccion,
            LocalDateTime fechaCreacion,
            BigDecimal subtotal,
            BigDecimal descuento,
            BigDecimal total,
            String estado
    ) {
        this.cliente = cliente;
        this.nombreEntrega = nombreEntrega;
        this.correoEntrega = correoEntrega;
        this.direccion = direccion;
        this.fechaCreacion = fechaCreacion;
        this.subtotal = subtotal;
        this.descuento = descuento;
        this.total = total;
        this.estado = estado;
    }

    public void addDetalle(DetalleBoletaEntity detalle) {
        detalles.add(detalle);
        detalle.setBoleta(this);
    }

    public Long getId() {
        return id;
    }

    public UserEntity getCliente() {
        return cliente;
    }

    public String getNombreEntrega() {
        return nombreEntrega;
    }

    public String getCorreoEntrega() {
        return correoEntrega;
    }

    public String getDireccion() {
        return direccion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public String getEstado() {
        return estado;
    }

    public List<DetalleBoletaEntity> getDetalles() {
        return detalles;
    }
}
