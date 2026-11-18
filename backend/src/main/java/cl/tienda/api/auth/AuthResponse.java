package cl.tienda.api.auth;

public record AuthResponse(String accessToken, String tokenType, long expiresIn, UserResponse user) {
}
