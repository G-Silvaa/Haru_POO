package com.mercadinho.service;

import com.mercadinho.dto.OrderItemRequest;
import com.mercadinho.dto.OrderRequest;
import com.mercadinho.dto.OrderResponse;
import com.mercadinho.exception.ResourceNotFoundException;
import com.mercadinho.model.Order;
import com.mercadinho.model.OrderItem;
import com.mercadinho.model.Product;
import com.mercadinho.repository.OrderRepository;
import com.mercadinho.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public OrderResponse create(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Carrinho vazio");
        }

        if (!request.getPaymentMethod().matches("(?i)(PIX|CARD)")) {
            throw new IllegalArgumentException("Pagamento inválido");
        }
        if (!request.getDeliveryMethod().matches("(?i)(DELIVERY|PICKUP)")) {
            throw new IllegalArgumentException("Método de entrega inválido");
        }

        Order order = new Order();
        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setPaymentMethod(request.getPaymentMethod().toUpperCase());
        order.setDeliveryMethod(request.getDeliveryMethod().toUpperCase());

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado: " + itemRequest.getProductId()));

            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Estoque insuficiente para " + product.getName());
            }

            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setCategory(product.getCategory().name());
            item.setPrice(product.getPrice());
            item.setQuantity(itemRequest.getQuantity());
            item.setSubtotal(product.getPrice().multiply(BigDecimal.valueOf(itemRequest.getQuantity())));

            order.addItem(item);
            total = total.add(item.getSubtotal());
        }

        order.setTotal(total);
        Order saved = orderRepository.save(order);
        return OrderResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream()
                .map(OrderResponse::from)
                .toList();
    }

    public OrderResponse updateStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        if (!status.matches("(?i)(PENDING|PAID|REJECTED)")) {
            throw new IllegalArgumentException("Status inválido");
        }
        order.setStatus(status.toUpperCase());
        return OrderResponse.from(orderRepository.save(order));
    }

    public void delete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
        orderRepository.delete(order);
    }
}
