package cl.tienda.api.auth;

import cl.tienda.api.user.Role;
import cl.tienda.api.user.UserEntity;

public record UserResponse(String nombre, String email, Role rol, boolean descuentoDuoc) {
    public static UserResponse from(UserEntity user) {
        String email = user.getEmail();
        boolean esDuoc = email.endsWith("@duoc.cl") || email.endsWith("@duocuc.cl");
        return new UserResponse(user.getNombre(), email, user.getRole(), esDuoc);
    }
}
