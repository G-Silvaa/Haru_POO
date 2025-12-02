package com.mercadinho.dto;

import com.mercadinho.model.OrderItem;
import com.mercadinho.model.ProductCategory;

import java.math.BigDecimal;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private ProductCategory category;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;

    public static OrderItemResponse from(OrderItem item) {
        OrderItemResponse resp = new OrderItemResponse();
        resp.setProductId(item.getProduct().getId());
        resp.setProductName(item.getProductName());
        resp.setCategory(ProductCategory.valueOf(item.getCategory()));
        resp.setPrice(item.getPrice());
        resp.setQuantity(item.getQuantity());
        resp.setSubtotal(item.getSubtotal());
        return resp;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public ProductCategory getCategory() {
        return category;
    }

    public void setCategory(ProductCategory category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
