package cl.tienda.api.auth;

public class EmailAlreadyRegisteredException extends RuntimeException {
    public EmailAlreadyRegisteredException() {
        super("El correo ya se encuentra registrado.");
    }
}
