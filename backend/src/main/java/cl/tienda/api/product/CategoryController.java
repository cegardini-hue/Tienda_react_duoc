package cl.tienda.api.product;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/categorias", "/api/categorias"})
public class CategoryController {
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public List<String> findAll() {
        return categoryRepository.findAll(Sort.by(Sort.Direction.ASC, "nombre"))
                .stream()
                .map(CategoryEntity::getNombre)
                .toList();
    }
}
