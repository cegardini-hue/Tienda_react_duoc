package cl.tienda.api.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "products")
public class ProductEntity {
    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false, length = 80)
    private String categoria;

    @Column(nullable = false, length = 2000)
    private String descripcion;

    @Column(nullable = false, length = 1000)
    private String imagen;

    protected ProductEntity() {
    }

    public ProductEntity(String id, String nombre, BigDecimal precio, String categoria, String descripcion, String imagen) {
        this.id = id;
        update(nombre, precio, categoria, descripcion, imagen);
    }

    public void update(String nombre, BigDecimal precio, String categoria, String descripcion, String imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.descripcion = descripcion;
        this.imagen = imagen;
    }

    public String getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getImagen() {
        return imagen;
    }
}
