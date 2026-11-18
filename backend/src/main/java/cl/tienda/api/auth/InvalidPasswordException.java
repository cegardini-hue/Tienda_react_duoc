package cl.tienda.api.auth;

public class InvalidPasswordException extends RuntimeException {
    public InvalidPasswordException() {
        super("La contraseña no puede superar los 72 bytes.");
    }
}
