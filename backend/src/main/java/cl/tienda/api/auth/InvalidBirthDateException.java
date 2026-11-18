package cl.tienda.api.auth;

public class InvalidBirthDateException extends RuntimeException {
    public InvalidBirthDateException() {
        super("Debes tener al menos 18 años para registrarte.");
    }
}
