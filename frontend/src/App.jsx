import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import LoginPanel from './components/LoginPanel.jsx';
import HighlightCard from './components/HighlightCard.jsx';
import ProductTable from './components/ProductTable.jsx';
import ProductFormModal from './components/ProductFormModal.jsx';
import { productService } from './services/productService.js';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error(error);
        setMessage('Não foi possível carregar os produtos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isAuthenticated]);

  const totalItems = useMemo(() => products.reduce((acc, product) => acc + product.quantity, 0), [products]);

  const handleLogin = ({ username, password }) => {
    if (username.trim() && password.trim()) {
      setIsAuthenticated(true);
      setMessage('');
    } else {
      setMessage('Informe usuário e senha para entrar.');
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProducts([]);
  };

  return (
    <div className="app-shell">
      <Header isAuthenticated={isAuthenticated} onNewProduct={handleCreate} onLogout={handleLogout} />

      {!isAuthenticated ? (
        <main className="login-wrapper">
          <LoginPanel onSubmit={handleLogin} />
          <HighlightCard />
        </main>
      ) : (
        <main className="dashboard">
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
              <strong>{products.length}</strong>
              <span>Produtos cadastrados</span>
            </div>
            <div>
              <strong>{totalItems}</strong>
              <span>Itens em estoque</span>
            </div>
          </section>

          {message && <p className="feedback">{message}</p>}

          <ProductTable
            products={products}
            loading={loading}
            onEdit={handleEdit}
            onQuantityChange={handleQuantityChange}
            onQuickSale={handleQuickSale}
          />
        </main>
      )}

      {showModal && (
        <ProductFormModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSaveProduct}
          product={editingProduct}
        />
      )}
    </div>
  );
};

export default App;
