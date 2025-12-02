package com.mercadinho.repository;

import com.mercadinho.model.Product;
import com.mercadinho.model.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(ProductCategory category);

    @Query("""
            SELECT p FROM Product p
            WHERE (:category IS NULL OR p.category = :category)
              AND LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
            """)
    Page<Product> search(
            @Param("search") String search,
            @Param("category") ProductCategory category,
            Pageable pageable);
}
