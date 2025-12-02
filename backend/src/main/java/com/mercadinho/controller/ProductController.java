package com.mercadinho.controller;

import com.mercadinho.dto.ProductRequest;
import com.mercadinho.dto.ProductResponse;
import com.mercadinho.dto.QuantityUpdateRequest;
import com.mercadinho.dto.PageResponse;
import com.mercadinho.service.ProductService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Produtos", description = "Operações de consulta e gestão de produtos")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista produtos com filtro e paginação")
    public PageResponse<ProductResponse> findAll(
            @RequestParam(required = false, defaultValue = "") @Parameter(description = "Filtro por nome") String search,
            @RequestParam(required = false) @Parameter(description = "Categoria do produto") String category,
            @Parameter(description = "Parâmetros de paginação") @PageableDefault(size = 10) Pageable pageable) {
        return service.findAll(search, category, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um produto pelo id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto encontrado"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ProductResponse findById(@PathVariable @Parameter(description = "Identificador do produto") Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria um novo produto")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    public ProductResponse create(@RequestBody @Valid ProductRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um produto existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto atualizado"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ProductResponse update(@PathVariable @Parameter(description = "Identificador do produto") Long id,
                                  @RequestBody @Valid ProductRequest request) {
        return service.update(id, request);
    }

    @PatchMapping("/{id}/quantity")
    @Operation(summary = "Atualiza apenas a quantidade em estoque")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantidade atualizada"),
            @ApiResponse(responseCode = "400", description = "Quantidade inválida"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public ProductResponse updateQuantity(@PathVariable @Parameter(description = "Identificador do produto") Long id,
                                          @RequestBody @Valid QuantityUpdateRequest request) {
        return service.updateQuantity(id, request.getQuantity());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remove um produto")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Produto removido"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado")
    })
    public void delete(@PathVariable @Parameter(description = "Identificador do produto") Long id) {
        service.delete(id);
    }
}
