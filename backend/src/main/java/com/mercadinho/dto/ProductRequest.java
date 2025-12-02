package com.mercadinho.dto;

import com.mercadinho.model.ProductCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Schema(description = "Dados para criar ou atualizar um produto")
public class ProductRequest {

    @NotBlank
    @Size(max = 120)
    @Schema(description = "Nome do produto", example = "Arroz Tio João 1kg")
    private String name;

    @NotNull
    @Schema(description = "Categoria do produto", example = "ALIMENTO")
    private ProductCategory category;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = true)
    @Digits(integer = 10, fraction = 2)
    @Schema(description = "Preço de venda", example = "5.90")
    private BigDecimal price;

    @NotNull
    @Min(0)
    @Schema(description = "Quantidade em estoque", example = "20")
    private Integer quantity;

    @Size(max = 255)
    @Schema(description = "URL de foto do produto", example = "https://exemplo.com/foto.png")
    private String photoUrl;

    @Size(max = 500)
    @Schema(description = "Descrição ou observações", example = "Pacote de 1kg, arroz tipo 1.")
    private String description;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
