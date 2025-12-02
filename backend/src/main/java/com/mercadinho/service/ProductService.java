package com.mercadinho.service;

import com.mercadinho.dto.ProductRequest;
import com.mercadinho.dto.ProductResponse;
import com.mercadinho.dto.PageResponse;
import com.mercadinho.exception.ResourceNotFoundException;
import com.mercadinho.model.Product;
import com.mercadinho.model.ProductCategory;
import com.mercadinho.repository.ProductRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductResponse> findAll(String search, String category, Pageable pageable) {
        String term = search == null ? "" : search;
        var categoryEnum = category != null && !category.isBlank() ? ProductCategory.valueOf(category) : null;
        return PageResponse.from(repository.search(term, categoryEnum, pageable)
                .map(ProductResponse::from));
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(Long id) {
        return ProductResponse.from(getProductOrThrow(id));
    }

    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        applyData(product, request);
        product.setQuantity(request.getQuantity());
        return ProductResponse.from(repository.save(product));
    }

    public ProductResponse update(Long id, ProductRequest request) {
        Product product = getProductOrThrow(id);
        applyData(product, request);
        product.setQuantity(request.getQuantity());
        return ProductResponse.from(repository.save(product));
    }

    public ProductResponse updateQuantity(Long id, Integer quantity) {
        Product product = getProductOrThrow(id);
        product.setQuantity(quantity);
        return ProductResponse.from(repository.save(product));
    }

    public void delete(Long id) {
        Product product = getProductOrThrow(id);
        repository.delete(product);
    }

    private Product getProductOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + id));
    }

    private void applyData(Product product, ProductRequest request) {
        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setPhotoUrl(request.getPhotoUrl());
        product.setDescription(request.getDescription());
    }
}
