package cl.tienda.api.product;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findAll() {
        return productRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"))
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(String id) {
        return ProductResponse.from(findEntity(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        ProductEntity product = new ProductEntity(
                UUID.randomUUID().toString(),
                request.nombre().trim(),
                request.precio(),
                request.categoria().trim(),
                request.descripcion().trim(),
                request.imagen().trim()
        );
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(String id, ProductRequest request) {
        ProductEntity product = findEntity(id);
        product.update(
                request.nombre().trim(),
                request.precio(),
                request.categoria().trim(),
                request.descripcion().trim(),
                request.imagen().trim()
        );
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public void delete(String id) {
        productRepository.delete(findEntity(id));
    }

    private ProductEntity findEntity(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
