import { FaPen, FaShoppingCart } from 'react-icons/fa';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const ProductTable = ({ products, loading, onEdit, onQuantityChange, onQuickSale }) => {
  const handleDecrease = (product) => {
    if (product.quantity === 0) return;
    onQuantityChange(product, product.quantity - 1);
  };

  const handleIncrease = (product) => {
    onQuantityChange(product, product.quantity + 1);
  };

  return (
    <div className="table-shell">
      <table>
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="6">Carregando produtos...</td>
            </tr>
          )}
          {!loading && products.length === 0 && (
            <tr>
              <td colSpan="6">Cadastre o primeiro produto para começar!</td>
            </tr>
          )}
          {!loading &&
            products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.photoUrl || '/sample-product.svg'} alt={product.name} className="product-photo" />
                </td>
                <td className="product-name">{product.name}</td>
                <td>
                  <span className="category-pill">{translateCategory(product.category)}</span>
                </td>
                <td className="price">{currencyFormatter.format(product.price)}</td>
                <td>
                  <div className="quantity-control">
                    <button type="button" onClick={() => handleDecrease(product)}>-</button>
                    <span>{String(product.quantity).padStart(2, '0')}</span>
                    <button type="button" onClick={() => handleIncrease(product)}>+</button>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button type="button" className="cart" title="Venda rápida" onClick={() => onQuickSale(product)}>
                      <FaShoppingCart />
                    </button>
                    <button type="button" className="edit" title="Editar produto" onClick={() => onEdit(product)}>
                      <FaPen />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

const translateCategory = (category) => {
  switch (category) {
    case 'ALIMENTO':
      return 'Alimento';
    case 'BEBIDA':
      return 'Bebida';
    case 'LIMPEZA':
      return 'Limpeza';
    case 'HIGIENE':
      return 'Higiene';
    default:
      return 'Outro';
  }
};

export default ProductTable;
