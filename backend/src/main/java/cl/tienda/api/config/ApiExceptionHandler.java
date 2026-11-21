package cl.tienda.api.config;

import cl.tienda.api.auth.EmailAlreadyRegisteredException;
import cl.tienda.api.auth.InvalidBirthDateException;
import cl.tienda.api.auth.InvalidPasswordException;
import cl.tienda.api.product.ProductNotFoundException;
import cl.tienda.api.order.BoletaNotFoundException;
import cl.tienda.api.order.InvalidOrderException;
import java.time.Instant;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(ProductNotFoundException.class)
    public ResponseEntity<Map<String, Object>> productNotFound(ProductNotFoundException exception) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(BoletaNotFoundException.class)
    public ResponseEntity<Map<String, Object>> boletaNotFound(BoletaNotFoundException exception) {
        return error(HttpStatus.NOT_FOUND, exception.getMessage());
    }

    @ExceptionHandler(InvalidOrderException.class)
    public ResponseEntity<Map<String, Object>> invalidOrder(InvalidOrderException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<Map<String, Object>> emailAlreadyRegistered(EmailAlreadyRegisteredException exception) {
        return error(HttpStatus.CONFLICT, exception.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> dataConflict() {
        return error(HttpStatus.CONFLICT, "No fue posible guardar el recurso porque ya existe.");
    }

    @ExceptionHandler(InvalidBirthDateException.class)
    public ResponseEntity<Map<String, Object>> invalidBirthDate(InvalidBirthDateException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(InvalidPasswordException.class)
    public ResponseEntity<Map<String, Object>> invalidPassword(InvalidPasswordException exception) {
        return error(HttpStatus.BAD_REQUEST, exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validation(MethodArgumentNotValidException exception) {
        FieldError fieldError = exception.getBindingResult().getFieldErrors().stream().findFirst().orElse(null);
        String message = fieldError == null ? "La solicitud contiene datos inválidos."
                : fieldError.getDefaultMessage();
        return error(HttpStatus.BAD_REQUEST, message);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> unreadableRequest() {
        return error(HttpStatus.BAD_REQUEST, "El cuerpo de la solicitud no es válido.");
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> invalidCredentials() {
        return error(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos.");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
                "timestamp", Instant.now().toString(),
                "status", status.value(),
                "message", message
        ));
    }
}
