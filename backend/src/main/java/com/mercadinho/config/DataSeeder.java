package com.mercadinho.config;

import com.mercadinho.model.Product;
import com.mercadinho.model.ProductCategory;
import com.mercadinho.repository.ProductRepository;
import com.mercadinho.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("!prod")
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(ProductRepository productRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUser();
        seedProducts();
    }

    private Product createProduct(String name, ProductCategory category, BigDecimal price, int qty, String photoUrl) {
        Product product = new Product();
        product.setName(name);
        product.setCategory(category);
        product.setPrice(price);
        product.setQuantity(qty);
        product.setPhotoUrl(photoUrl);
        product.setDescription("Produto selecionado especialmente para o Mercadinho do Povo.");
        return product;
    }

    private void seedUser() {
        if (userRepository.existsByUsername("admin")) {
            return;
        }
        com.mercadinho.model.User user = new com.mercadinho.model.User();
        user.setUsername("admin");
        user.setPassword(passwordEncoder.encode("admin123"));
        userRepository.save(user);
    }

    private void seedProducts() {
        if (productRepository.count() > 0) {
            return;
        }

        List<Product> samples = List.of(
                createProduct("Arroz tio João", ProductCategory.ALIMENTO, new BigDecimal("5.00"), 60,
                        "https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=200&q=60"),
                createProduct("Feijão da Casa", ProductCategory.ALIMENTO, new BigDecimal("7.99"), 45,
                        "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=200&q=60"),
                createProduct("Detergente Azul", ProductCategory.LIMPEZA, new BigDecimal("3.50"), 30,
                        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=200&q=60"),
                createProduct("Sabão em pó", ProductCategory.LIMPEZA, new BigDecimal("12.90"), 25,
                        "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=200&q=60")
        );

        productRepository.saveAll(samples);
    }
}
