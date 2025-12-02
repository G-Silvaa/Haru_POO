import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header.jsx';
import LoginPanel from './components/LoginPanel.jsx';
import HighlightCard from './components/HighlightCard.jsx';
import ProductTable from './components/ProductTable.jsx';
import ProductFormModal from './components/ProductFormModal.jsx';
import { productService } from './services/productService.js';
import { authService } from './services/authService.js';

const App = () => {
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

  useEffect(() => {
    productService.setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) return;
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
  }, [isAuthenticated, page, size, search, category]);

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
        </main>
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
    </div>
  );
};

export default App;
