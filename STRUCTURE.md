# Estrutura do Projeto

```
.
├── README.md               # Visão geral e instruções
├── STRUCTURE.md            # Este arquivo
├── backend
│   ├── pom.xml
│   └── src
│       └── main
│           ├── java
│           │   └── com
│           │       └── mercadinho
│           │           ├── MercadinhoAdminApplication.java
│           │           ├── config
│           │           │   ├── DataSeeder.java
│           │           │   └── WebConfig.java
│           │           ├── controller
│           │           │   └── ProductController.java
│           │           ├── dto
│           │           │   ├── ProductRequest.java
│           │           │   ├── ProductResponse.java
│           │           │   └── QuantityUpdateRequest.java
│           │           ├── exception
│           │           │   ├── ApiExceptionHandler.java
│           │           │   └── ResourceNotFoundException.java
│           │           ├── model
│           │           │   ├── Product.java
│           │           │   └── ProductCategory.java
│           │           ├── repository
│           │           │   └── ProductRepository.java
│           │           └── service
│           │               └── ProductService.java
│           └── resources
│               └── application.properties
└── frontend
    ├── index.html
    ├── package.json
    ├── public
    │   ├── logo.svg
    │   └── sample-product.svg
    └── src
        ├── App.jsx
        ├── components
        │   ├── Header.jsx
        │   ├── HighlightCard.jsx
        │   ├── LoginPanel.jsx
        │   ├── ProductFormModal.jsx
        │   └── ProductTable.jsx
        ├── main.jsx
        ├── services
        │   └── productService.js
        └── styles
            └── index.css
```
