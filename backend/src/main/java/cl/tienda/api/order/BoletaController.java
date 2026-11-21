package cl.tienda.api.order;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/boletas")
@SecurityRequirement(name = "bearerAuth")
public class BoletaController {
    private final BoletaService boletaService;

    public BoletaController(BoletaService boletaService) {
        this.boletaService = boletaService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BoletaResponse create(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        return boletaService.create(authentication.getName(), request);
    }

    @GetMapping
    public List<BoletaResponse> findAll() {
        return boletaService.findAll();
    }

    @GetMapping("/{id}")
    public BoletaResponse findById(@PathVariable Long id) {
        return boletaService.findById(id);
    }
}
