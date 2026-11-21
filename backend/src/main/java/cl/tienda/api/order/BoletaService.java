package cl.tienda.api.order;

import cl.tienda.api.product.ProductEntity;
import cl.tienda.api.product.ProductRepository;
import cl.tienda.api.product.ProductNotFoundException;
import cl.tienda.api.user.UserEntity;
import cl.tienda.api.user.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BoletaService {
    private static final BigDecimal DUOC_DISCOUNT_RATE = new BigDecimal("0.20");

    private final BoletaRepository boletaRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public BoletaService(
            BoletaRepository boletaRepository,
            ProductRepository productRepository,
            UserRepository userRepository
    ) {
        this.boletaRepository = boletaRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BoletaResponse create(String authenticatedEmail, CreateOrderRequest request) {
        UserEntity customer = userRepository.findByEmail(authenticatedEmail)
                .orElseThrow(() -> new IllegalStateException("El usuario autenticado ya no existe."));
        BigDecimal subtotal = BigDecimal.ZERO.setScale(2);
        Set<String> productIds = new HashSet<>();
        List<ResolvedLine> lines = request.productos().stream()
                .map(line -> {
                    if (!productIds.add(line.productoId())) {
                        throw new InvalidOrderException("Cada producto debe aparecer una sola vez en la compra.");
                    }
                    ProductEntity product = productRepository.findById(line.productoId())
                            .orElseThrow(() -> new ProductNotFoundException(line.productoId()));
                    BigDecimal lineTotal = product.getPrecio().multiply(BigDecimal.valueOf(line.cantidad()))
                            .setScale(2, RoundingMode.HALF_UP);
                    return new ResolvedLine(product, line.cantidad(), lineTotal);
                })
                .toList();

        for (ResolvedLine line : lines) {
            subtotal = subtotal.add(line.total());
        }
        BigDecimal discount = isDuocEmail(customer.getEmail())
                ? subtotal.multiply(DUOC_DISCOUNT_RATE).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO.setScale(2);
        BigDecimal total = subtotal.subtract(discount).setScale(2, RoundingMode.HALF_UP);

        BoletaEntity boleta = new BoletaEntity(
                customer,
                request.nombreEntrega().trim(),
                request.correoEntrega().trim().toLowerCase(java.util.Locale.ROOT),
                request.direccion().trim(),
                LocalDateTime.now(),
                subtotal,
                discount,
                total,
                "CONFIRMADA"
        );
        for (ResolvedLine line : lines) {
            boleta.addDetalle(new DetalleBoletaEntity(
                    line.product(),
                    line.product().getNombre(),
                    line.product().getPrecio(),
                    line.quantity(),
                    line.total()
            ));
        }
        return BoletaResponse.from(boletaRepository.save(boleta));
    }

    @Transactional(readOnly = true)
    public List<BoletaResponse> findAll() {
        return boletaRepository.findAll(Sort.by(Sort.Direction.DESC, "fechaCreacion"))
                .stream()
                .map(BoletaResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public BoletaResponse findById(Long id) {
        return boletaRepository.findById(id)
                .map(BoletaResponse::from)
                .orElseThrow(() -> new BoletaNotFoundException(id));
    }

    private boolean isDuocEmail(String email) {
        String normalizedEmail = email.toLowerCase(java.util.Locale.ROOT);
        return normalizedEmail.endsWith("@duoc.cl") || normalizedEmail.endsWith("@duocuc.cl");
    }

    private record ResolvedLine(ProductEntity product, int quantity, BigDecimal total) {
    }
}
