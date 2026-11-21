package cl.tienda.api.order;

public class BoletaNotFoundException extends RuntimeException {
    public BoletaNotFoundException(Long id) {
        super("No se encontró la boleta " + id + ".");
    }
}
