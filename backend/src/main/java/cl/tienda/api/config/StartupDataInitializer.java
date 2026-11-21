package cl.tienda.api.config;

import cl.tienda.api.product.ProductEntity;
import cl.tienda.api.product.ProductRepository;
import cl.tienda.api.product.CategoryEntity;
import cl.tienda.api.product.CategoryRepository;
import cl.tienda.api.user.Role;
import cl.tienda.api.user.UserEntity;
import cl.tienda.api.user.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class StartupDataInitializer implements ApplicationRunner {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;
    private final String sellerEmail;
    private final String sellerPassword;

    public StartupDataInitializer(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.initial-password}") String adminPassword,
            @Value("${app.seller.email:}") String sellerEmail,
            @Value("${app.seller.initial-password:}") String sellerPassword
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.sellerEmail = sellerEmail;
        this.sellerPassword = sellerPassword;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedProducts();
        linkExistingProductCategories();
        seedAdmin();
        seedSeller();
    }

    private void seedProducts() {
        if (productRepository.count() != 0) return;

        List<ProductEntity> products = List.of(
                product("JM001", "Catan", 29990, "Juegos de Mesa",
                        "Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores.",
                        "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80"),
                product("JM002", "Carcassonne", 24990, "Juegos de Mesa",
                        "Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne.",
                        "https://images.unsplash.com/photo-1632501641765-e568d28b0015?auto=format&fit=crop&w=800&q=80"),
                product("AC001", "Controlador Inalámbrico Xbox Series X", 59990, "Accesorios",
                        "Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada.",
                        "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80"),
                product("AC002", "Auriculares Gamer HyperX Cloud II", 79990, "Accesorios",
                        "Proporcionan un sonido envolvente de calidad con un micrófono desmontable y almohadillas de espuma viscoelástica.",
                        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"),
                product("CO001", "PlayStation 5", 549900, "Consolas",
                        "La consola de última generación de Sony, que ofrece gráficos impresionantes y tiempos de carga ultrarrápidos.",
                        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"),
                product("CG001", "PC Gamer ASUS ROG Strix", 1299990, "Computadores Gamers",
                        "Un potente equipo diseñado para los gamers más exigentes, equipado con los últimos componentes.",
                        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80"),
                product("SG001", "Silla Gamer Secretlab Titan", 349990, "Sillas Gamers",
                        "Diseñada para el máximo confort, esta silla ofrece un soporte ergonómico y personalización ajustable.",
                        "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80"),
                product("MS001", "Mouse Gamer Logitech G502 HERO", 49990, "Mouse",
                        "Con sensor de alta precisión y botones personalizables, este mouse es ideal para un control preciso.",
                        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"),
                product("MP001", "Mousepad Razer Goliathus Extended Chroma", 29990, "Mousepad",
                        "Ofrece un área de juego amplia con iluminación RGB personalizable y una superficie suave.",
                        "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?auto=format&fit=crop&w=800&q=80"),
                product("PP001", "Polera Gamer Personalizada 'Level-Up'", 14990, "Poleras Personalizadas",
                        "Una camiseta cómoda y estilizada, con la posibilidad de personalizarla con tu gamer tag o diseño favorito.",
                        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80")
        );
        products.forEach(product -> product.setCategory(findOrCreateCategory(product.getCategoria())));
        productRepository.saveAll(products);
    }

    private void linkExistingProductCategories() {
        for (ProductEntity product : productRepository.findAll()) {
            if (product.getCategory() == null) {
                product.setCategory(findOrCreateCategory(product.getCategoria()));
                productRepository.save(product);
            }
        }
    }

    private CategoryEntity findOrCreateCategory(String name) {
        return categoryRepository.findByNombreIgnoreCase(name)
                .orElseGet(() -> categoryRepository.save(new CategoryEntity(name)));
    }

    private ProductEntity product(String id, String name, int price, String category, String description, String image) {
        return new ProductEntity(id, name, BigDecimal.valueOf(price), category, description, image);
    }

    private void seedAdmin() {
        if (adminEmail.isBlank()) return;
        String email = adminEmail.trim().toLowerCase(java.util.Locale.ROOT);
        UserEntity existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            if (existing.getRole() != Role.ADMIN) {
                throw new IllegalStateException("ADMIN_EMAIL ya existe y no tiene rol de administrador.");
            }
            return;
        }
        if (adminPassword.length() < 12) {
            throw new IllegalStateException("ADMIN_INITIAL_PASSWORD debe tener al menos 12 caracteres.");
        }

        userRepository.save(new UserEntity(
                email,
                "Administrador",
                passwordEncoder.encode(adminPassword),
                null,
                Role.ADMIN
        ));
    }

    private void seedSeller() {
        if (sellerEmail.isBlank()) {
            if (!sellerPassword.isBlank()) {
                throw new IllegalStateException("SELLER_EMAIL es obligatorio cuando se configura SELLER_INITIAL_PASSWORD.");
            }
            return;
        }
        String email = sellerEmail.trim().toLowerCase(java.util.Locale.ROOT);
        UserEntity existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            if (existing.getRole() != Role.VENDEDOR) {
                throw new IllegalStateException("SELLER_EMAIL ya existe y no tiene rol de vendedor.");
            }
            return;
        }
        if (sellerPassword.length() < 12) {
            throw new IllegalStateException("SELLER_INITIAL_PASSWORD debe tener al menos 12 caracteres.");
        }

        userRepository.save(new UserEntity(
                email,
                "Vendedor",
                passwordEncoder.encode(sellerPassword),
                null,
                Role.VENDEDOR
        ));
    }
}
