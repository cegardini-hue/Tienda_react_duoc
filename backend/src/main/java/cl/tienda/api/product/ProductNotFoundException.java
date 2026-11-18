package cl.tienda.api.product;

public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String id) {
        super("No se encontró el producto con ID " + id + ".");
    }
}
