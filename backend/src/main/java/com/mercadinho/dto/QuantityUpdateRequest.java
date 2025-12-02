package com.mercadinho.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;

public class QuantityUpdateRequest {

    @NotNull
    @Min(0)
    @Schema(description = "Nova quantidade em estoque", example = "10")
    private Integer quantity;

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
