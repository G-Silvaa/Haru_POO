import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import LoginPanel from './components/LoginPanel.jsx';
import HighlightCard from './components/HighlightCard.jsx';
import ProductTable from './components/ProductTable.jsx';
import ProductFormModal from './components/ProductFormModal.jsx';
import { productService } from './services/productService.js';
import { authService } from './services/authService.js';
import { orderService } from './services/orderService.js';

const App = () => {
  const [view, setView] = useState(() => localStorage.getItem('uiView') || 'shop'); // shop | admin

  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('authToken')));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleteQuantity, setDeleteQuantity] = useState(1);
  const [message, setMessage] = useState('');

  // Loja (shop) state
  const [shopProducts, setShopProducts] = useState([]);
  const [shopLoading, setShopLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [checkout, setCheckout] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'PIX',
    deliveryMethod: 'DELIVERY'
  });
  const [shopMessage, setShopMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [adminTab, setAdminTab] = useState(() => localStorage.getItem('adminTab') || 'products'); // products | orders
  const [confirmOrderAction, setConfirmOrderAction] = useState(null);

  useEffect(() => {
    productService.setAuthToken(token);
    orderService.setAuthToken(token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem('uiView', view);
  }, [view]);

  useEffect(() => {
    localStorage.setItem('adminTab', adminTab);
  }, [adminTab]);

  useEffect(() => {
    if (!isAuthenticated || view !== 'admin') return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll({ page, size, search, category });
        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (error) {
        console.error(error);
        setMessage('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isAuthenticated, page, size, search, category, view]);

  useEffect(() => {
    if (view !== 'shop') return;
    const fetchShopProducts = async () => {
      setShopLoading(true);
      try {
        const data = await productService.getAll({ page: 0, size: 50, search: shopSearch, category: shopCategory });
        setShopProducts(data.content);
      } catch (error) {
        console.error(error);
        setShopMessage('Não foi possível carregar os produtos.');
      } finally {
        setShopLoading(false);
      }
    };
    fetchShopProducts();
  }, [shopSearch, shopCategory, view]);

  const totalItems = useMemo(() => products.reduce((acc, product) => acc + product.quantity, 0), [products]);

  const handleLogin = async ({ username, password }) => {
    if (!username.trim() || !password.trim()) {
      setMessage('Informe usuário e senha para entrar.');
      return;
    }
    try {
      const { token: jwt } = await authService.login({ username, password });
      setToken(jwt);
      localStorage.setItem('authToken', jwt);
      setIsAuthenticated(true);
      setMessage('');
    } catch (error) {
      console.error(error);
      setMessage('Usuário ou senha inválidos.');
      setIsAuthenticated(false);
      setToken(null);
      localStorage.removeItem('authToken');
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleSizeChange = (event) => {
    setSize(Number(event.target.value));
    setPage(0);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((current) => current + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage((current) => current - 1);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (payload) => {
    try {
      let saved;
      if (editingProduct) {
        saved = await productService.update(editingProduct.id, payload);
        setProducts((current) => current.map((item) => (item.id === saved.id ? saved : item)));
      } else {
        saved = await productService.create(payload);
        setProducts((current) => [...current, saved]);
      }
      setMessage('Produto salvo com sucesso.');
    } catch (error) {
      console.error(error);
      setMessage('Erro ao salvar produto.');
    } finally {
      setShowModal(false);
      setEditingProduct(null);
    }
  };

  const handleQuantityChange = async (product, quantity) => {
    try {
      const updated = await productService.updateQuantity(product.id, quantity);
      setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível atualizar a quantidade.');
    }
  };

  const handleQuickSale = async (product) => {
    if (product.quantity === 0) return;
    await handleQuantityChange(product, product.quantity - 1);
    setMessage(`Venda rápida registrada para ${product.name}.`);
  };

  const handleRequestDelete = (product) => {
    setDeletingProduct(product);
    setDeleteQuantity(1);
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      if (deleteQuantity >= deletingProduct.quantity) {
        await productService.remove(deletingProduct.id);
        setProducts((current) => current.filter((item) => item.id !== deletingProduct.id));
        setMessage(`Produto "${deletingProduct.name}" removido.`);
      } else {
        const updated = await productService.updateQuantity(
          deletingProduct.id,
          deletingProduct.quantity - deleteQuantity
        );
        setProducts((current) => current.map((item) => (item.id === updated.id ? updated : item)));
        setMessage(`Removidos ${deleteQuantity} itens de "${deletingProduct.name}".`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível remover itens.');
    } finally {
      setDeletingProduct(null);
      setDeleteQuantity(1);
    }
  };

  const handleCancelDelete = () => {
    setDeletingProduct(null);
    setDeleteQuantity(1);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('authToken');
    setProducts([]);
    setPage(0);
    setSearch('');
    setCategory('');
    setTotalPages(0);
    setTotalElements(0);
    setOrders([]);
    setOrderStatusFilter('');
    setConfirmOrderAction(null);
  };

  // Loja - cart helpers
  const cartTotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
    [cart]
  );

  const handleAddToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + 1, product.quantity);
        return current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...current, { product, quantity: 1 }];
    });
    setShopMessage(`${product.name} adicionado ao carrinho.`);
  };

  const handleUpdateCartQty = (productId, quantity, max) => {
    if (quantity <= 0) {
      setCart((current) => current.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, max) }
          : item
      )
    );
  };

  const handleCheckoutChange = (field, value) => {
    setCheckout((current) => ({ ...current, [field]: value }));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setShopMessage('Adicione itens ao carrinho.');
      return;
    }
    if (!checkout.customerName || !checkout.email || !checkout.phone || !checkout.address) {
      setShopMessage('Preencha seus dados para finalizar.');
      return;
    }
    try {
      await orderService.create({
        customerName: checkout.customerName,
        email: checkout.email,
        phone: checkout.phone,
        address: checkout.address,
        paymentMethod: checkout.paymentMethod,
        deliveryMethod: checkout.deliveryMethod,
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      });
      setShopMessage('Pedido realizado com sucesso! Obrigado pela compra.');
      setCart([]);
      setCheckout({
        customerName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'PIX',
        deliveryMethod: 'DELIVERY'
      });
    } catch (error) {
      console.error(error);
      setShopMessage('Não foi possível finalizar o pedido.');
    }
  };

  // admin orders
  useEffect(() => {
    if (!isAuthenticated || view !== 'admin') return;
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const data = await orderService.list();
        setOrders(data);
      } catch (error) {
        console.error(error);
        setMessage('Não foi possível carregar os pedidos.');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, view]);

  const filteredOrders = useMemo(() => {
    if (!orderStatusFilter) return orders;
    return orders.filter((o) => o.status === orderStatusFilter);
  }, [orders, orderStatusFilter]);

  const statusLabel = {
    PENDING: 'Pendente',
    PAID: 'Pago',
    REJECTED: 'Recusado'
  };

  return (
    <div className="app-shell">
      <div className="mode-switch">
        <button className={view === 'shop' ? 'active' : ''} onClick={() => setView('shop')}>
          Loja
        </button>
        <button className={view === 'admin' ? 'active' : ''} onClick={() => setView('admin')}>
          Admin
        </button>
        <div className="brand">
          <span className="dot" />
          <strong>Mercadinho do Povo</strong>
        </div>
      </div>

      {view === 'shop' ? (
        <main className="shop">
          <section className="hero">
            <div>
              <p className="eyebrow">Mercadinho do Povo</p>
              <h1>Escolha seus produtos favoritos</h1>
              <p className="subtitle">Selecione itens, preencha seus dados e finalize o pedido rapidinho.</p>
              <div className="shop-filters">
                <input
                  type="search"
                  placeholder="Buscar produtos"
                  value={shopSearch}
                  onChange={(e) => setShopSearch(e.target.value)}
                />
                <select value={shopCategory} onChange={(e) => setShopCategory(e.target.value)}>
                  <option value="">Todas as categorias</option>
                  <option value="ALIMENTO">Alimento</option>
                  <option value="BEBIDA">Bebida</option>
                  <option value="LIMPEZA">Limpeza</option>
                  <option value="HIGIENE">Higiene</option>
                  <option value="OUTRO">Outro</option>
                </select>
              </div>
            </div>
            <div className="cart-summary-card">
              <h3>Seu carrinho</h3>
              <p>{cart.length} itens</p>
              <strong>Subtotal: R$ {cartTotal.toFixed(2)}</strong>
            </div>
          </section>

          {shopMessage && <p className="feedback">{shopMessage}</p>}

          <section className="shop-content">
            <div className="product-grid">
              {shopLoading && <p>Carregando produtos...</p>}
              {!shopLoading && shopProducts.length === 0 && <p>Nenhum produto encontrado.</p>}
              {!shopLoading &&
                shopProducts.map((product) => (
                  <article key={product.id} className="product-card">
                    <img src={product.photoUrl || '/sample-product.svg'} alt={product.name} />
                    <div className="product-card__body">
                      <span className="category-pill">{product.category}</span>
                      <h4>{product.name}</h4>
                      <p className="price">R$ {Number(product.price).toFixed(2)}</p>
                      <p className="stock">Estoque: {product.quantity}</p>
                    </div>
                    <button
                      className="add-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}
                    >
                      {product.quantity === 0 ? 'Sem estoque' : 'Adicionar'}
                    </button>
                  </article>
                ))}
            </div>

            <div className="checkout-panel">
              <h3>Finalizar pedido</h3>
              <div className="cart-list">
                {cart.length === 0 && <p>Nenhum item no carrinho.</p>}
                {cart.map((item) => (
                  <div key={item.product.id} className="cart-line">
                    <div>
                      <strong>{item.product.name}</strong>
                      <span>R$ {Number(item.product.price).toFixed(2)}</span>
                    </div>
                    <div className="quantity-control">
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, item.quantity - 1, item.product.quantity)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateCartQty(item.product.id, item.quantity + 1, item.product.quantity)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="checkout-form">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={checkout.customerName}
                  onChange={(e) => handleCheckoutChange('customerName', e.target.value)}
                />
                <input
                  type="email"
                  placeholder="E-mail"
                  value={checkout.email}
                  onChange={(e) => handleCheckoutChange('email', e.target.value)}
                />
                <input
                  type="tel"
                  placeholder="Telefone"
                  value={checkout.phone}
                  onChange={(e) => handleCheckoutChange('phone', e.target.value)}
                />
                <textarea
                  placeholder="Endereço completo"
                  value={checkout.address}
                  onChange={(e) => handleCheckoutChange('address', e.target.value)}
                />
                <div className="two-cols">
                  <label className="radio-group">
                    <span>Entrega</span>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="delivery"
                          value="DELIVERY"
                          checked={checkout.deliveryMethod === 'DELIVERY'}
                          onChange={(e) => handleCheckoutChange('deliveryMethod', e.target.value)}
                        />
                        Delivery
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="delivery"
                          value="PICKUP"
                          checked={checkout.deliveryMethod === 'PICKUP'}
                          onChange={(e) => handleCheckoutChange('deliveryMethod', e.target.value)}
                        />
                        Retirada
                      </label>
                    </div>
                  </label>
                  <label className="radio-group">
                    <span>Pagamento</span>
                    <div>
                      <label>
                        <input
                          type="radio"
                          name="payment"
                          value="PIX"
                          checked={checkout.paymentMethod === 'PIX'}
                          onChange={(e) => handleCheckoutChange('paymentMethod', e.target.value)}
                        />
                        Pix
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="payment"
                          value="CARD"
                          checked={checkout.paymentMethod === 'CARD'}
                          onChange={(e) => handleCheckoutChange('paymentMethod', e.target.value)}
                        />
                        Cartão
                      </label>
                    </div>
                  </label>
                </div>
                <div className="checkout-total">
                  <span>Total</span>
                  <strong>R$ {cartTotal.toFixed(2)}</strong>
                </div>
                <button className="primary" onClick={handleCheckout}>Finalizar compra</button>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <>
          <Header isAuthenticated={isAuthenticated} onNewProduct={handleCreate} onLogout={handleLogout} />

          {!isAuthenticated ? (
            <main className="login-wrapper">
              <LoginPanel onSubmit={handleLogin} />
              <HighlightCard />
            </main>
          ) : (
            <main className="dashboard">
              <div className="admin-nav">
                <button className={adminTab === 'products' ? 'active' : ''} onClick={() => setAdminTab('products')}>
                  Produtos
                </button>
                <button className={adminTab === 'orders' ? 'active' : ''} onClick={() => setAdminTab('orders')}>
                  Pedidos
                </button>
              </div>

              {adminTab === 'products' && (
                <>
                  <div className="dashboard__head">
                    <div>
                      <p className="eyebrow">Mercadinho do Povo</p>
                      <h1>Bem vindo!</h1>
                      <p className="subtitle">Controle tudo o que entra e sai do estoque da mercearia.</p>
                    </div>
                    <button className="new-product" onClick={handleCreate}>
                      Novo produto <span>+</span>
                    </button>
                  </div>

                  <section className="summary">
                    <div>
                      <strong>{totalElements}</strong>
                      <span>Produtos cadastrados</span>
                    </div>
                    <div>
                      <strong>{totalItems}</strong>
                      <span>Itens em estoque</span>
                    </div>
                  </section>

                  {message && <p className="feedback">{message}</p>}

                  <div className="table-actions">
                    <input
                      type="search"
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Buscar por nome"
                    />
                    <select value={category} onChange={handleCategoryChange} className="category-filter">
                      <option value="">Todas as categorias</option>
                      <option value="ALIMENTO">Alimento</option>
                      <option value="BEBIDA">Bebida</option>
                      <option value="LIMPEZA">Limpeza</option>
                      <option value="HIGIENE">Higiene</option>
                      <option value="OUTRO">Outro</option>
                    </select>
                    <div className="pagination-controls">
                      <label>
                        Itens por página
                        <select value={size} onChange={handleSizeChange}>
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                        </select>
                      </label>
                      <div className="pager">
                        <button type="button" onClick={handlePrevPage} disabled={page === 0 || loading}>
                          Anterior
                        </button>
                        <span>
                          Página {totalPages === 0 ? 0 : page + 1} de {totalPages}
                        </span>
                        <button type="button" onClick={handleNextPage} disabled={page >= totalPages - 1 || loading}>
                          Próxima
                        </button>
                      </div>
                    </div>
                  </div>

                  <ProductTable
                    products={products}
                    loading={loading}
                    onEdit={handleEdit}
                    onQuantityChange={handleQuantityChange}
                    onQuickSale={handleQuickSale}
                    onDeleteRequest={handleRequestDelete}
                  />
                </>
              )}

              {adminTab === 'orders' && (
                <section className="orders-panel">
                  <div className="orders-head">
                    <div>
                      <p className="eyebrow">Pedidos</p>
                      <h1>Visão geral de entregas</h1>
                    </div>
                    <div className="orders-filters">
                      <select value={orderStatusFilter} onChange={(e) => setOrderStatusFilter(e.target.value)}>
                        <option value="">Todos</option>
                        <option value="PENDING">Pendentes</option>
                        <option value="PAID">Pagos</option>
                        <option value="REJECTED">Rejeitados</option>
                      </select>
                      {ordersLoading && <span className="pill">Carregando...</span>}
                    </div>
                  </div>
                  {filteredOrders.length === 0 && !ordersLoading && <p>Nenhum pedido encontrado.</p>}
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-main">
                        <div>
                          <strong>#{order.id}</strong>
                          <p>
                            {order.customerName} · {order.deliveryMethod === 'DELIVERY' ? 'Delivery' : 'Retirada'}
                          </p>
                          <small>{order.email} · {order.phone}</small>
                          <p className="address">{order.address}</p>
                          <p className="address">Pagamento: {order.paymentMethod}</p>
                        </div>
                        <div className="order-total">
                          <span className="pill">{statusLabel[order.status] || order.status}</span>
                          <strong>R$ {Number(order.total).toFixed(2)}</strong>
                          <small>{new Date(order.createdAt).toLocaleString()}</small>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.items.map((item) => (
                          <span key={`${order.id}-${item.productId}`} className="pill">
                            {item.quantity}x {item.productName}
                          </span>
                        ))}
                      </div>
                      <div className="order-actions">
                        <button onClick={() => setConfirmOrderAction({ order, status: 'PAID' })}>Marcar pago</button>
                        <button className="ghost" onClick={() => setConfirmOrderAction({ order, status: 'REJECTED' })}>Rejeitar</button>
                      </div>
                    </div>
                  ))}
                </section>
              )}
            </main>
          )}
        </>
      )}

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveProduct}
          product={editingProduct}
        />
      )}

      {deletingProduct && (
        <div className="modal-backdrop">
          <div className="modal">
            <header>
              <h3>Remover itens</h3>
              <button onClick={handleCancelDelete} className="ghost">X</button>
            </header>
            <p>
              Quantos itens de <strong>{deletingProduct.name}</strong> você deseja remover?
            </p>
            <input
              type="number"
              min="1"
              max={deletingProduct.quantity}
              value={deleteQuantity}
              onChange={(e) => setDeleteQuantity(Math.max(1, Math.min(deletingProduct.quantity, Number(e.target.value))))}
            />
            <div className="modal-actions">
              <button className="ghost" onClick={handleCancelDelete}>Cancelar</button>
              <button className="primary" onClick={handleConfirmDelete}>Confirmar</button>
            </div>
          </div>
        </div>
      )}

      {confirmOrderAction && (
        <div className="modal-backdrop">
          <div className="modal">
            <header>
              <h3>Confirmar {confirmOrderAction.status === 'PAID' ? 'pagamento' : 'rejeição'}</h3>
              <button onClick={() => setConfirmOrderAction(null)} className="ghost">X</button>
            </header>
            <p>
              Deseja marcar o pedido <strong>#{confirmOrderAction.order.id}</strong> de{' '}
              <strong>{confirmOrderAction.order.customerName}</strong> como{' '}
              <strong>{statusLabel[confirmOrderAction.status]}</strong>?
            </p>
            <div className="modal-actions">
              <button className="ghost" onClick={() => setConfirmOrderAction(null)}>Cancelar</button>
              <button
                className="primary"
                onClick={handleOrderAction}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
  const handleOrderAction = async () => {
    if (!confirmOrderAction) return;
    const { order, status } = confirmOrderAction;
    try {
      if (status === 'REJECTED') {
        await orderService.remove(order.id);
        setOrders((current) => current.filter((o) => o.id !== order.id));
        setMessage(`Pedido #${order.id} removido.`);
      } else {
        const updated = await orderService.updateStatus(order.id, status);
        setOrders((current) => current.filter((o) => o.id !== updated.id));
        setMessage(`Pedido #${updated.id} marcado como ${statusLabel[updated.status]}.`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Não foi possível atualizar o pedido.');
    } finally {
      setConfirmOrderAction(null);
    }
  };
