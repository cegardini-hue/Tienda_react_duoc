package cl.tienda.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:tienda-test;DB_CLOSE_DELAY=-1",
        "app.jwt.secret=VGllbmRhUmVhY3QtZnJvbnRlbmQtdGVzdC1zZWNyZXQtMzItYnl0ZXM=",
        "app.admin.email=admin@test.local",
        "app.admin.initial-password=test-admin-password-123"
})
class ApiIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void catalogIsPublicAndSeeded() throws Exception {
        mockMvc.perform(get("/api/productos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(10)))
                .andExpect(jsonPath("$[0].id").exists());
    }

    @Test
    void adminMutationsRequireAuthentication() throws Exception {
        mockMvc.perform(post("/api/productos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Producto de prueba",
                                  "precio": 1000,
                                  "categoria": "Pruebas",
                                  "descripcion": "Descripción del producto de prueba",
                                  "imagen": "https://example.com/producto.png"
                                }
                                """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanCreateUpdateAndDeleteProducts() throws Exception {
        String adminToken = login("admin@test.local", "test-admin-password-123");
        String createBody = """
                {
                  "nombre": "Producto de prueba",
                  "precio": 1000,
                  "categoria": "Pruebas",
                  "descripcion": "Descripción del producto de prueba",
                  "imagen": "https://example.com/producto.png"
                }
                """;

        MvcResult created = mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nombre").value("Producto de prueba"))
                .andReturn();

        String productId = objectMapper.readTree(created.getResponse().getContentAsString())
                .get("id").asText();
        mockMvc.perform(get("/api/productos/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(productId));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put(
                                "/api/productos/{id}", productId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(createBody.replace("Producto de prueba", "Producto actualizado")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Producto actualizado"));

        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete(
                                "/api/productos/{id}", productId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/productos/{id}", productId))
                .andExpect(status().isNotFound());
    }

    @Test
    void registrationAndLoginReturnClientJwt() throws Exception {
        String email = "prueba-" + UUID.randomUUID() + "@duoc.cl";
        String registration = objectMapper.writeValueAsString(new RegisterPayload(
                "Usuario de prueba",
                email,
                LocalDate.now().minusYears(20).toString(),
                "password-segura-123"
        ));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registration))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.rol").value("CLIENTE"))
                .andExpect(jsonPath("$.descuentoDuoc").value(true));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new LoginRequestPayload(email.toUpperCase(), "password-segura-123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(900))
                .andExpect(jsonPath("$.user.rol").value("CLIENTE"))
                .andReturn();

        JsonNode response = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = response.get("accessToken").asText();
        mockMvc.perform(post("/api/productos")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nombre": "Producto de prueba",
                                  "precio": 1000,
                                  "categoria": "Pruebas",
                                  "descripcion": "Descripción del producto de prueba",
                                  "imagen": "https://example.com/producto.png"
                                }
                                """))
                .andExpect(status().isForbidden());
    }

    private record RegisterPayload(String nombre, String email, String fechaNacimiento, String password) {
    }

    private record LoginRequestPayload(String email, String password) {
    }

    private String login(String email, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequestPayload(email, password))))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString())
                .get("accessToken").asText();
    }
}
